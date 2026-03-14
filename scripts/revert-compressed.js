#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { extract } = require('tar');

async function revertCompressed(manifestPath, outputDir) {
    if (!fs.existsSync(manifestPath)) {
        console.error(`Error: Manifest file '${manifestPath}' does not exist.`);
        process.exit(1);
    }

    // Read and parse the manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const baseDir = path.dirname(manifestPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Restoring '${manifest.sourceName}' from ${manifest.numChunks} chunks...`);

    // Reassemble the chunks
    const chunks = [];
    for (const chunkFile of manifest.chunks) {
        const chunkPath = path.join(baseDir, chunkFile);

        if (!fs.existsSync(chunkPath)) {
            console.error(`Error: Chunk file '${chunkFile}' not found.`);
            process.exit(1);
        }

        const base64Content = fs.readFileSync(chunkPath, 'utf8');
        const chunkBuffer = Buffer.from(base64Content, 'base64');
        chunks.push(chunkBuffer);

        console.log(`  Read: ${chunkFile} (${chunkBuffer.length} bytes)`);
    }

    // Combine all chunks
    const combinedBuffer = Buffer.concat(chunks);

    if (combinedBuffer.length !== manifest.originalSize) {
        console.error(`Error: Reassembled size (${combinedBuffer.length}) does not match original size (${manifest.originalSize})`);
        process.exit(1);
    }

    // Create temporary tar.gz file
    const tempTarPath = path.join(outputDir, `${manifest.sourceName}.restored.tar.gz`);
    fs.writeFileSync(tempTarPath, combinedBuffer);

    console.log(`\nExtracting archive to '${outputDir}'...`);

    // Extract the tar.gz
    await extract({
        file: tempTarPath,
        cwd: outputDir,
    });

    // Clean up the temporary tar.gz file
    fs.unlinkSync(tempTarPath);

    console.log(`✓ Successfully restored '${manifest.sourceName}' to '${outputDir}'`);
}

// CLI usage
const [,, manifestPath, outputDir] = process.argv;

if (!manifestPath || !outputDir) {
    console.log('Usage: node revert-compressed.js <manifest-file> <output-folder>');
    console.log('');
    console.log('Example: node revert-compressed.js ./output/my-folder.manifest.json ./restored');
    process.exit(1);
}

revertCompressed(manifestPath, outputDir).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
