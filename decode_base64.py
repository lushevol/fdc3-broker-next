import base64
import sys
import os

def decode_base64_file(input_file, output_file):
    try:
        with open(input_file, 'r') as f:
            base64_data = f.read().strip()
        
        # Add padding if missing
        missing_padding = len(base64_data) % 4
        if missing_padding:
            base64_data += '=' * (4 - missing_padding)

        decoded_data = base64.b64decode(base64_data)

        with open(output_file, 'wb') as f:
            f.write(decoded_data)
        
        print(f"Successfully decoded {input_file} to {output_file}")
    except Exception as e:
        print(f"Error decoding file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 decode_base64.py <input_file> <output_file>")
        sys.exit(1)
    
    decode_base64_file(sys.argv[1], sys.argv[2])
