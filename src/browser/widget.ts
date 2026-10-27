import { unsealInWorker } from './index.js';

const html = String.raw;

const template = document.createElement('template');
template.innerHTML = html`
  <style>
    article {
      all: initial;
      display: block;
      box-sizing: border-box;
      width: min(300px, 100dvw);
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 10px;
      color: #111;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      font-family:
        Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial,
        sans-serif;
      font-size: 16px;
      line-height: 1.25;
      user-select: none;
    }

    :host([layout="floating"]) {
      display: inline-block;
      position: relative;
    }

    :host([layout="floating"]) article {
      display: none;
      position: absolute;
      z-index: 1000000;
      opacity: 0;
      transition: opacity .2s ease-in .8s;
    }

    :host([layout="floating"][status]) article {
      display: block;
    }

    :host([layout="floating"][status="processing"]) article,
    :host([layout="floating"][status="error"]) article {
      opacity: 1;
      transition: opacity .1s ease-out;
    }

    @supports (position-area: block-end span-inline-end) {
      :host([layout="floating"]) {
        position: static;
        anchor-name: --host;
      }

      :host([layout="floating"]) article {
        position: fixed;
        position-anchor: --host;
        position-area: block-end span-inline-end;
        position-try-fallbacks: flip-inline;
      }
    }

    button {
      all: unset;
      width: 100%;
      cursor: pointer;
    }

    button:focus-visible {
      outline: revert;
    }

    button, :host([status]) #status {
      position: relative;
      box-sizing: border-box;
      min-height: 46px;
      padding: 16px 16px 10px 52px;
      border-radius: 6px;
    }

    :host([status]) button {
      display: none;
    }

    :host([status="processing"]) #status {
      cursor: wait;
    }

    button::before, :host([status]) #status::before {
      content: '';
      position: absolute;
      left: 14px;
      top: 50%;
      width: 24px;
      height: 24px;
      margin-top: -10px;
      border: 1px solid #bbb;
      border-radius: 6px;
    }

    :host([status="processing"]) #status::before {
      border-radius: 50%;
      border-color: transparent transparent #111 #111;
      animation: spin 1s linear infinite;
    }

    :host([status="success"]) #status::before {
      border-color: #16a34a;
      background-color: #16a34a;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTE4IDgtOCA5LTQtNCIvPjwvc3ZnPg==");
    }

    :host([status="error"]) #status::before {
      border-color: #dc2626;
      background-color: #dc2626;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTE3IDcgNyAxN003IDdsMTAgMTAiLz48L3N2Zz4=");
    }

    footer {
      text-align: right;
      font-size: 12px;
      color: #666;
      padding: 2px 9px 7px 9px;
    }

    footer a {
      color: inherit;
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
  <slot></slot>
  <article>
    <button type="button">I'm not a robot</button>
    <div id="status" role="status"></div>
    <footer>
      Protected by
      <a
        href="https://github.com/jo-phil/treadwheel"
        target="_blank"
        rel="noopener noreferrer"
      >
        Treadwheel
      </a>
    </footer>
  </article>
`;

class TreadwheelWidget extends HTMLElement {
  private _shadow = this.attachShadow({ mode: 'open' });
  private _abortController?: AbortController;

  constructor() {
    super();

    this._shadow.appendChild(template.content.cloneNode(true));
    this._shadow.addEventListener('click', this._handleClick);
    this._shadow.querySelector('slot')?.addEventListener(
      'slotchange',
      () => {
        if (this.hasAttribute('layout')) return;
        if (this.querySelector('button')) {
          this.setAttribute('layout', 'floating');
        }
      },
      { once: true },
    );
  }

  connectedCallback() {
    this._abortController = new AbortController();
  }

  disconnectedCallback() {
    this._abortController?.abort();
  }

  private _handleClick = async (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest('button')) return;

    const envelope = this.getAttribute('envelope');
    if (!envelope) return;

    this.setAttribute('status', 'processing');
    const status = this._shadow.getElementById('status');
    if (status) status.textContent = 'Verifying…';
    this.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
    });

    try {
      const plaintext = await unsealInWorker(envelope, {
        signal: this._abortController?.signal,
      });
      this.setAttribute('status', 'success');
      if (status) status.textContent = 'Verified';

      const output = document.createElement('template');
      if (this.getAttribute('output') === 'html') {
        output.innerHTML = plaintext;
      } else {
        output.content.textContent = plaintext;
      }

      if (this.getAttribute('layout') === 'floating') {
        this.replaceChildren(output.content);
        this._shadow.addEventListener(
          'transitionend',
          () => this.replaceWith(...this.childNodes),
          { once: true },
        );
      } else {
        this.replaceWith(output.content);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        this.removeAttribute('status');
        if (status) status.textContent = '';
        this.querySelectorAll('button').forEach((button) => {
          button.disabled = false;
        });
      } else {
        this.setAttribute('status', 'error');
        if (status) status.textContent = 'Verification failed';
      }
    }
  };
}

customElements.define('treadwheel-widget', TreadwheelWidget);
