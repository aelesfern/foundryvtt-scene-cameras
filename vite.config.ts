import * as fsPromises from 'fs/promises';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import scss from 'rollup-plugin-scss';
import watchAssets from 'rollup-plugin-watch-assets';

import { defineConfig, Plugin } from 'vite';
import { id } from './src/module.json';

const moduleVersion = process.env.MODULE_VERSION;
const githubProject = process.env.GH_PROJECT;
const githubTag = process.env.GH_TAG;

console.log(process.env.VSCODE_INJECTION);

export default defineConfig({
	build: {
		sourcemap: true,
		rollupOptions: {
			input: 'src/index.ts',
			output: {
				dir: 'dist/scripts',
				entryFileNames: 'index.js',
				format: 'es',
			},
			watch: {
				include: 'src/**',
			},
		},
	},
	plugins: [
		del({ targets: 'dist/*' }),
		watchAssets({
			assets: ['src/**/*.html', 'src/**/*.hbs', 'src/**/*.json', 'src/assets/*.css'],
		}),
		updateModuleManifestPlugin(),
		scss({
			output: 'dist/style.css',
			sourceMap: true,
			watch: ['src/styles/*.scss'],
		}),
		copy({
			targets: [
				{ src: 'src/languages', dest: 'dist' },
				{ src: ['src/**/*.html', '!src/assets/*.html'], dest: 'dist/templates' },
				{ src: 'src/**/*.hbs', dest: 'dist/templates' },
				{ src: 'src/assets', dest: 'dist' },
				{
					src: 'dist',
					dest: '../FoundryVTT - Entorno desarrollo/Data/modules',
					rename: id,
				},
			],
			hook: 'writeBundle',
		}),
	],
});

function updateModuleManifestPlugin(): Plugin {
	return {
		name: 'update-module-manifest',
		async writeBundle(): Promise<void> {
			const packageContents = JSON.parse(await fsPromises.readFile('./package.json', 'utf-8')) as Record<string, unknown>;
			const version = moduleVersion || (packageContents.version as string);
			const manifestContents: string = await fsPromises.readFile('src/module.json', 'utf-8');
			const manifestJson = JSON.parse(manifestContents) as Record<string, unknown>;
			manifestJson['version'] = version;
			if (githubProject) {
				const baseUrl = `https://github.com/${githubProject}/releases`;
				manifestJson['manifest'] = `${baseUrl}/latest/download/module.json`;
				if (githubTag) {
					manifestJson['download'] = `${baseUrl}/download/${githubTag}/module.zip`;
				}
			}
			await fsPromises.writeFile('dist/module.json', JSON.stringify(manifestJson, null, 4));
		},
	};
}
