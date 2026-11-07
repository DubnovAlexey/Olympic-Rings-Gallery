"""FILE: tools/identify-tracks.py
PURPOSE: find the artist and title of playlist tracks that have no tags, by their sound (AcoustID, like Shazam).

How it works: ffmpeg computes a Chromaprint fingerprint (a short code describing the sound) of the first two
minutes of each file; the fingerprint and the duration are sent to api.acoustid.org, which answers with matching
recordings from the MusicBrainz database. The audio files themselves are never uploaded.

Run from the project folder:  python tools/identify-tracks.py
It takes your AcoustID application API key (free: https://acoustid.org/new-application) from the ACOUSTID_KEY
environment variable or asks for it. The key is used only for these requests and is not saved anywhere. Results are printed and written to tools/identify-tracks-result.json.
"""
import getpass
import json
import os
import shutil
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

FILES = [
    'music/track5.mp3', 'music/track7.mp3', 'music/track8.mp3', 'music/track10.mp3',
    'music/track12.mp3', 'music/track14.mp3', 'music/2125218341 (1).mp3', 'music/6945b8a2e3c4a5.mp3',
]
FFMPEG_FALLBACK = os.path.expandvars(
    r'%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe'
    r'\ffmpeg-9.0.2-full_build\bin')


def tool(name):
    found = shutil.which(name) or shutil.which(os.path.join(FFMPEG_FALLBACK, name))
    if not found:
        sys.exit(f'{name} not found: install ffmpeg (full build with Chromaprint)')
    return found


def fingerprint(path):
    ffmpeg, ffprobe = tool('ffmpeg'), tool('ffprobe')
    duration = float(subprocess.run([ffprobe, '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                                    capture_output=True, text=True, check=True).stdout.strip())
    code = subprocess.run([ffmpeg, '-v', 'error', '-i', path, '-t', '120', '-ac', '1', '-f', 'chromaprint',
                           '-fp_format', 'base64', '-'], capture_output=True, text=True, check=True).stdout.strip()
    return round(duration), code


def lookup(key, duration, code):
    data = urllib.parse.urlencode({'client': key, 'duration': duration, 'fingerprint': code,
                                   'meta': 'recordings', 'format': 'json'}).encode()
    request = urllib.request.Request('https://api.acoustid.org/v2/lookup', data=data,
                                     headers={'User-Agent': 'OlympicRingsGallery/1.0 (study project)'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:  # the service explains a refusal in the body — show it
        body = error.read().decode('utf-8', 'replace')
        try:
            return json.loads(body)
        except ValueError:
            return {'status': 'error', 'error': {'message': f'HTTP {error.code}: {body[:200]}'}}


def best(answer):
    """The most confident match that has a title; artists joined like on the cover."""
    for result in sorted(answer.get('results', []), key=lambda r: -r.get('score', 0)):
        for recording in result.get('recordings', []):
            if recording.get('title'):
                artists = ', '.join(a.get('name', '') for a in recording.get('artists', []))
                return {'score': round(result.get('score', 0), 2), 'artist': artists, 'title': recording['title']}
    return None


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    key = os.environ.get('ACOUSTID_KEY', '').strip() or getpass.getpass('AcoustID API key (input is hidden): ').strip()
    if not key:
        sys.exit('No key entered.')
    results = {}
    for path in FILES:
        try:
            duration, code = fingerprint(path)
            answer = lookup(key, duration, code)
            if answer.get('status') != 'ok':
                results[path] = {'error': answer.get('error', {}).get('message', 'unknown error')}
            else:
                results[path] = best(answer) or {'match': None}
        except Exception as error:  # one bad file must not stop the rest
            results[path] = {'error': str(error)}
        print(path, '->', results[path])
    out = os.path.join('tools', 'identify-tracks-result.json')
    with open(out, 'w', encoding='utf-8') as handle:
        json.dump(results, handle, ensure_ascii=False, indent=2)
    print('Saved:', out)


if __name__ == '__main__':
    main()
