import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, server } from 'vitest/browser';

import '../../src/browser/widget.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('widget', () => {
  let widget: HTMLElement;

  beforeEach(() => {
    widget = document.createElement('treadwheel-widget');
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('unseals envelope and goes away', async () => {
    widget.setAttribute('envelope', fixture.envelope);
    document.body.appendChild(widget);

    await page.getByRole('button', { name: "I'm not a robot" }).click();
    expect(page.getByRole('status')).toHaveTextContent('Verifying…');

    await expect.element(document.body).toHaveTextContent(fixture.plaintext);
    expect(widget).not.toBeInTheDocument();
  });

  it.skipIf(server.browser === 'webkit')(
    'unseals envelope in floating layout and fades out',
    async () => {
      const slottedButton = document.createElement('button');
      slottedButton.textContent = 'Click to reveal';
      widget.appendChild(slottedButton);

      widget.setAttribute('envelope', fixture.envelope);
      document.body.appendChild(widget);

      const article = widget.shadowRoot?.querySelector(
        'article',
      ) as HTMLElement;
      await expect.element(article).not.toBeVisible();

      const button = page.getByRole('button', { name: 'Click to reveal' });
      await button.click();
      expect(article).toBeVisible();

      const status = page.getByRole('status');
      expect(status).toHaveTextContent('Verifying…');

      await expect.element(document.body).toHaveTextContent(fixture.plaintext);
      expect(status).toHaveTextContent('Verified');

      await expect.element(widget).not.toBeInTheDocument();
    },
  );

  it('shows error message for invalid envelope', async () => {
    widget.setAttribute('envelope', 'invalid-envelope');
    document.body.appendChild(widget);

    await page.getByRole('button', { name: "I'm not a robot" }).click();
    const status = page.getByRole('status');
    expect(status).toHaveTextContent('Verifying…');

    await expect.element(status).toHaveTextContent('Verification failed');
  });
});
