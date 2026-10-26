import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, server } from 'vitest/browser';

import { seal } from '../../src/browser/index.js';
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

  it('outputs HTML when attribute `output` is set to "html"', async () => {
    const html = `<a href="#">${fixture.plaintext}</a>`;
    const envelope = await seal(html, { time: 10 });

    widget.setAttribute('envelope', envelope);
    widget.setAttribute('output', 'html');
    document.body.appendChild(widget);

    await page.getByRole('button', { name: "I'm not a robot" }).click();
    const status = page.getByRole('status');
    expect(status).toHaveTextContent('Verifying…');

    const link = page.getByRole('link', { name: fixture.plaintext });
    await expect.element(link).toBeVisible();
  });

  it('shows error message for invalid envelope', async () => {
    widget.setAttribute('envelope', 'invalid-envelope');
    document.body.appendChild(widget);

    await page.getByRole('button', { name: "I'm not a robot" }).click();
    const status = page.getByRole('status');
    expect(status).toHaveTextContent('Verifying…');

    await expect.element(status).toHaveTextContent('Verification failed');
  });

  it('aborts when detached and reactivates on reattachment', async () => {
    const envelope = await seal(fixture.plaintext, { time: 1000 });
    widget.setAttribute('envelope', envelope);
    document.body.appendChild(widget);

    const button = page.getByRole('button', { name: "I'm not a robot" });
    await button.click();
    const status = page.getByRole('status');
    expect(status).toHaveTextContent('Verifying…');

    widget.remove();
    await expect.element(widget).not.toHaveAttribute('status');

    document.body.appendChild(widget);
    await expect.element(status).toBeEmptyDOMElement();

    await button.click();
    expect(status).toHaveTextContent('Verifying…');

    await expect.element(document.body).toHaveTextContent(fixture.plaintext);
    expect(widget).not.toBeInTheDocument();
  });
});
