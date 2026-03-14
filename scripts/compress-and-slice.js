#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { create: createTar } = require('tar');

const MAX_CHUNK_SIZE = 10 * 1024; // 10KB

async function compressAndSlice(sourceDir, outputDir) {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Error: Source directory '${sourceDir}' does not exist.`);
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const sourceName = path.basename(sourceDir);
    const tempTarPath = path.join(outputDir, `${sourceName}.tar.gz`);

    console.log(`Creating tar.gz archive from '${sourceDir}' with highest compression...`);

    // Create tar.gz with highest compression (level 9)
    await createTar(
        {
            gzip: { level: 9 },
            file: tempTarPath,
            cwd: path.dirname(sourceDir),
        },
        [path.basename(sourceDir)]
    );

    console.log(`Archive created: ${tempTarPath}`);

    // Read the compressed file and split into chunks
    const fileBuffer = fs.readFileSync(tempTarPath);
    const totalSize = fileBuffer.length;
    const numChunks = Math.ceil(totalSize / MAX_CHUNK_SIZE);

    console.log(`File size: ${totalSize} bytes`);
    console.log(`Splitting into ${numChunks} chunks (max ${MAX_CHUNK_SIZE} bytes each)...`);

    const chunkFiles = [];

    for (let i = 0; i < numChunks; i++) {
        const start = i * MAX_CHUNK_SIZE;
        const end = Math.min(start + MAX_CHUNK_SIZE, totalSize);
        const chunk = fileBuffer.slice(start, end);
        const base64Chunk = chunk.toString('base64');

        const chunkFileName = `${sourceName}.chunk.${String(i).padStart(4, '0')}.b64`;
        const chunkPath = path.join(outputDir, chunkFileName);

        fs.writeFileSync(chunkPath, base64Chunk);
        chunkFiles.push(chunkFileName);

        console.log(`  Created: ${chunkFileName} (${base64Chunk.length} base64 chars)`);
    }

    // Create a manifest file
    const manifest = {
        sourceName,
        originalSize: totalSize,
        numChunks,
        chunkSize: MAX_CHUNK_SIZE,
        compression: 'gzip-9',
        chunks: chunkFiles,
    };

    const manifestPath = path.join(outputDir, `${sourceName}.manifest.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // Clean up the temporary tar.gz file
    fs.unlinkSync(tempTarPath);

    console.log(`\n✓ Created ${numChunks} chunks in '${outputDir}'`);
    console.log(`✓ Manifest saved to: ${manifestPath}`);
}

// CLI usage
const [,, sourceDir, outputDir = "./output"] = process.argv;

if (!sourceDir || !outputDir) {
    console.log('Usage: node compress-and-slice.js <source-folder> <output-folder>');
    console.log('');
    console.log('Example: node compress-and-slice.js ./my-folder ./output');
    process.exit(1);
}

compressAndSlice(sourceDir, outputDir).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
