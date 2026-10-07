import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/worker.ts', 'src/node/cli.ts'],
    },
    projects: [
      {
        test: {
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/**/browser.test.ts'],
          name: 'node',
          environment: 'node',
        },
      },
      {
        test: {
          include: ['tests/**/browser.test.ts'],
          name: 'browser',
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' },
            ],
          },
        },
      },
    ],
  },
});
