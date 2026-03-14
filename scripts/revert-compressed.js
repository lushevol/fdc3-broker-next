#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { extract } = require('tar');

async function revertCompressed(chunksDir, outputDir) {
    if (!fs.existsSync(chunksDir)) {
        console.error(`Error: Chunks directory '${chunksDir}' does not exist.`);
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Auto-detect sourceName from chunk files in the directory
    // Pattern: {sourceName}.chunk.{XXXX}.b64
    const chunkPattern = /^(.+)\.chunk\.(\d{4})\.b64$/;
    const allFiles = fs.readdirSync(chunksDir);

    const chunkFiles = allFiles
        .map(file => {
            const match = file.match(chunkPattern);
            if (match) {
                return { file, sourceName: match[1], index: parseInt(match[2], 10) };
            }
            return null;
        })
        .filter(item => item !== null)
        .sort((a, b) => a.index - b.index);

    if (chunkFiles.length === 0) {
        console.error(`Error: No chunk files found matching '*.chunk.XXXX.b64' in '${chunksDir}'`);
        process.exit(1);
    }

    // Get sourceName from the first chunk (all chunks should have the same sourceName)
    const sourceName = chunkFiles[0].sourceName;

    console.log(`Restoring '${sourceName}' from ${chunkFiles.length} chunks...`);

    // Reassemble the chunks
    const chunks = [];
    for (const { file: chunkFile } of chunkFiles) {
        const chunkPath = path.join(chunksDir, chunkFile);
        const base64Content = fs.readFileSync(chunkPath, 'utf8');
        const chunkBuffer = Buffer.from(base64Content, 'base64');
        chunks.push(chunkBuffer);
        console.log(`  Read: ${chunkFile} (${chunkBuffer.length} bytes)`);
    }

    // Combine all chunks
    const combinedBuffer = Buffer.concat(chunks);
    console.log(`  Total reassembled size: ${combinedBuffer.length} bytes`);

    // Create temporary tar.gz file
    const tempTarPath = path.join(outputDir, `${sourceName}.restored.tar.gz`);
    fs.writeFileSync(tempTarPath, combinedBuffer);

    console.log(`\nExtracting archive to '${outputDir}'...`);

    // Extract the tar.gz
    await extract({
        file: tempTarPath,
        cwd: outputDir,
    });

    // Clean up the temporary tar.gz file
    fs.unlinkSync(tempTarPath);

    console.log(`✓ Successfully restored '${sourceName}' to '${outputDir}'`);
}

// CLI usage
const [,, chunksDir, outputDir = './restored'] = process.argv;

if (!chunksDir) {
    console.log('Usage: node revert-compressed.js <chunks-folder> [output-folder]');
    console.log('');
    console.log('Example: node revert-compressed.js ./output ./restored');
    process.exit(1);
}

revertCompressed(chunksDir, outputDir).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
