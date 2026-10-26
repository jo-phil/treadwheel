import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import MagicString from 'magic-string';
import {
  build,
  defineConfig,
  type TsdownPlugin,
  type UserConfig,
} from 'tsdown';

const tsdownConfig: UserConfig = {
  platform: 'browser',
  target: 'es2020',
  clean: false,
  dts: false,
  minify: true,
};

const inlineWorker: TsdownPlugin = {
  name: 'inline-worker',
  async renderChunk(code) {
    const workerRegex =
      /const worker =\s*new Worker\(\s*new URL\(['"]\.\/worker\.js['"],\s*import\.meta\.url\)\s*(?:,\s*\{.*?\}\s*)?;?\)/gs;

    const match = workerRegex.exec(code);
    if (!match) return null;

    const { bundles } = await build({
      ...tsdownConfig,
      entry: 'src/browser/worker.ts',
      format: 'iife',
      write: false,
      sourcemap: false,
    });

    const chunk = bundles[0]?.chunks[0];
    if (chunk?.type !== 'chunk') throw new Error('failed to build worker');

    const replacement = `
      const url = URL.createObjectURL(new Blob(
        [${JSON.stringify(chunk.code.trim())}],
        { type: 'application/javascript' },
      ));
      const worker = new Worker(url);
      URL.revokeObjectURL(url);
    `;

    const magicString = new MagicString(code);
    const start = match.index;
    const end = start + match[0].length;
    magicString.overwrite(start, end, replacement);

    return {
      code: magicString.toString(),
      map: magicString.generateMap({
        source: chunk.fileName,
        hires: true,
        includeContent: true,
      }),
    };
  },
};

const tsdownBundleConfig: UserConfig = {
  ...tsdownConfig,
  format: 'esm',
  sourcemap: true,
  fixedExtension: false,
  plugins: [minifyHTML(), inlineWorker],
};

export default defineConfig([
  {
    entry: { 'treadwheel.min': 'src/browser/index.ts' },
    ...tsdownBundleConfig,
  },
  {
    entry: { 'treadwheel-widget.min': 'src/browser/widget.ts' },
    ...tsdownBundleConfig,
  },
]);
