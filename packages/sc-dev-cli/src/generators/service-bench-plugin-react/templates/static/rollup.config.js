import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import nodeResolve from '@rollup/plugin-node-resolve';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'rollup-plugin-esbuild';
import litcss from 'rollup-plugin-lit-css';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginVersion = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8')).version;

function sbPluginManifest() {
    return {
        name: 'sb-plugin-manifest',
        generateBundle(outputOptions, bundle) {
            if (!String(outputOptions.entryFileNames).includes('[hash]')) return;

            const fileMap = Object.entries(bundle)
                .filter(([name, chunk]) => name.endsWith('.js') && chunk.isEntry)
                .reduce((map, [file, { name }]) => {
                    map[`${name}.js`] = file;
                    return map;
                }, {});

            const distDir = join(__dirname, 'dist');
            if (!existsSync(distDir)) mkdirSync(distDir);
            const manifestsDir = join(distDir, 'manifests');
            if (!existsSync(manifestsDir)) mkdirSync(manifestsDir);

            const routesPath = join(manifestsDir, 'routes.json');
            const sourceRaw = readFileSync('./manifests/routes.json');
            const sourceManifest = JSON.parse(sourceRaw);
            const finalManifest = existsSync(routesPath)
                ? JSON.parse(readFileSync(routesPath))
                : JSON.parse(sourceRaw);

            finalManifest.routes = finalManifest.routes.map((route) => {
                if (fileMap[route.element]) route.element = fileMap[route.element];
                return route;
            });

            if (sourceManifest.state?.stores) {
                const stores = sourceManifest.state.stores;
                Object.keys(stores).forEach((storeName) => {
                    if (stores[storeName].store) {
                        finalManifest.state.stores[storeName].store = fileMap[stores[storeName].store];
                    }
                });
            }

            if (sourceManifest.widgets) {
                const widgets = sourceManifest.widgets;
                Object.keys(widgets).forEach((widgetName) => {
                    if (widgets[widgetName].element && fileMap[widgets[widgetName].element]) {
                        finalManifest.widgets[widgetName].element = fileMap[widgets[widgetName].element];
                    }
                });
            }

            finalManifest._build = {
                version: pluginVersion,
                buildId: process.env['BUILD_BUILDID'] || '',
                buildNumber: process.env['BUILD_BUILDNUMBER'] || '',
            };

            writeFileSync(routesPath, JSON.stringify(finalManifest, null, 2));

            const tourPath = join(__dirname, 'manifests', 'tour.json');
            if (existsSync(tourPath)) {
                writeFileSync(join(manifestsDir, 'tour.json'), readFileSync(tourPath));
            }
        },
    };
}

const esbuildPlugin = esbuild({
    minify: true,
    target: ['chrome64', 'firefox67', 'safari11.1'],
    supported: { destructuring: true },
});

const configs = [];

const elementFiles = readdirSync('./elements').filter((file) => file !== 'index.js');
configs.push({
    input: elementFiles.map((file) => `./elements/${file}`),
    output: [
        {
            entryFileNames: 'element-[hash].js',
            chunkFileNames: 'chunk-[hash].js',
            assetFileNames: 'asset-[hash][extname]',
            format: 'es',
            dir: 'dist/elements',
            sourcemap: true,
        },
        {
            entryFileNames: '[name].js',
            chunkFileNames: 'chunk-[name].js',
            assetFileNames: 'asset-[name][extname]',
            format: 'es',
            dir: 'dist/elements',
            sourcemap: true,
        },
    ],
    preserveEntrySignatures: true,
    plugins: [
        nodeResolve(),
        esbuildPlugin,
        image(),
        litcss({
            include: ['**/*.css'],
            exclude: ['**/@scdevkit/**/*.css'],
        }),
        babel({
            babelHelpers: 'bundled',
            plugins: [
                '@babel/plugin-syntax-jsx',
                [
                    'babel-plugin-template-html-minifier',
                    {
                        modules: {
                            lit: [
                                'html',
                                { name: 'css', encapsulation: 'style' },
                            ],
                        },
                        failOnError: false,
                        strictCSS: true,
                        htmlMinifier: {
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            removeComments: true,
                            caseSensitive: true,
                            minifyCSS: true,
                        },
                    },
                ],
            ],
        }),
        sbPluginManifest(),
    ],
});

if (existsSync('./stores')) {
    const storeFiles = readdirSync('./stores').filter((file) => file !== 'index.js');
    configs.push({
        input: storeFiles.map((file) => `./stores/${file}`),
        output: [
            {
                entryFileNames: 'store-[hash].js',
                chunkFileNames: 'chunk-[hash].js',
                assetFileNames: 'asset-[hash][extname]',
                format: 'es',
                dir: 'dist/stores',
                sourcemap: true,
            },
            {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunk-[name].js',
                assetFileNames: 'asset-[name][extname]',
                format: 'es',
                dir: 'dist/stores',
                sourcemap: true,
            },
        ],
        preserveEntrySignatures: true,
        plugins: [
            nodeResolve(),
            esbuildPlugin,
            sbPluginManifest(),
        ],
    });
}

export default configs;
