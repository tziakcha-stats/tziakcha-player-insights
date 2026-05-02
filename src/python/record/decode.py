import base64
import json
import zlib
import sys

def main():
    try:
        with open('data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading data.json: {e}", file=sys.stderr)
        sys.exit(1)

    script = data.get('script')
    if not script:
        print("Error: 'script' field not found in data.json.", file=sys.stderr)
        sys.exit(1)

    try:
        decoded_bytes = base64.b64decode(script)
        decoded_bytes = zlib.decompress(decoded_bytes)
        decoded_json = json.loads(decoded_bytes)
        with open('step2.json', 'w', encoding='utf-8') as f:
            json.dump(decoded_json, f, ensure_ascii=False, indent=2)
        print("Successfully wrote decoded JSON to step.json")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()