#!/bin/bash

# Script to convert base64 encoded file to tar.gz

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input_base64_file> <output_targz_file>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found."
    exit 1
fi

# Detect OS to determine base64 decode flag
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    base64 -D -i "$INPUT_FILE" -o "$OUTPUT_FILE"
else
    # Linux / other
    base64 -d "$INPUT_FILE" > "$OUTPUT_FILE"
fi

if [ $? -eq 0 ]; then
    echo "Successfully converted '$INPUT_FILE' to '$OUTPUT_FILE'"
else
    echo "Error: Failed to convert file."
    exit 1
fi
