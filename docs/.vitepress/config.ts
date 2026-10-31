import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';
import { defineConfig } from 'vitepress';
import pkg from '../../package.json' with { type: 'json' };

export default defineConfig({
  title: 'Treadwheel',
  description:
    'Use time-lock puzzles to protect sensitive information from bots ' +
    'while keeping access simple for humans.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      {
        text: pkg.version,
        items: [
          {
            text: 'Releases',
            link: 'https://github.com/jo-phil/treadwheel/releases',
          },
        ],
      },
    ],
    sidebar: [
      { text: 'Quickstart', link: '/guide' },
      { text: 'CLI', link: '/cli' },
      { text: 'Widget', link: '/widget' },
      { text: 'API Reference', link: '/api' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jo-phil/treadwheel' },
    ],
    externalLinkIcon: true,
  },
  vite: {
    plugins: [minifyHTML()],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'treadwheel-widget',
      },
    },
  },
});
