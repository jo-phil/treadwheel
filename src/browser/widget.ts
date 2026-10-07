import { unsealInWorker } from './index.js';

class Widget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.addEventListener('click', this.handleClick);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot?.querySelector('slot')?.addEventListener(
      'slotchange',
      () => {
        if (this.hasAttribute('layout')) return;
        if (this.querySelector('button')) {
          this.setAttribute('layout', 'floating');
        } else {
          this.setAttribute('layout', 'block');
        }
      },
      { once: true },
    );
  }

  private handleClick = async (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest('button')) return;

    const envelope = this.getAttribute('envelope');
    if (!envelope) return;

    this.setAttribute('status', 'processing');
    const button = this.shadowRoot?.querySelector('button');
    if (button) button.disabled = true;
    this.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
    });

    const plaintext = await unsealInWorker(envelope);
    this.setAttribute('status', 'success');
    this.textContent = plaintext;
  };

  render() {
    if (!this.shadowRoot) return;

    const template = `<style>
        article {
          all: initial;
          display: block;
          box-sizing: border-box;
          width: 300px;
          border-radius: 10px;
          color: #111;
          background: #fff;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.06),
            0 1px 2px 0 rgba(0, 0, 0, 0.04),
            0 4px 12px 0 rgba(0, 0, 0, 0.03);
          font-family:
            Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial,
            sans-serif;
          font-size: 16px;
        }

        button {
          all: unset;
          box-sizing: border-box;
          position: relative;
          width: 100%;
          padding: 16px 16px 12px 52px;
          border-radius: 6px;
          cursor: pointer;
        }

        button:focus-visible {
          outline: revert;
        }

        button:disabled {
          cursor: default;
        }

        :host([status="processing"]) button:disabled {
          cursor: wait;
        }

        button::before {
          content: '';
          position: absolute;
          left: 14px;
          top: 50%;
          width: 24px;
          height: 24px;
          margin-top: -11px;
          border: 1px solid #bbb;
          border-radius: 6px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        :host([status="processing"]) button::before {
          border-radius: 50%;
          border-color: transparent transparent #333 #333;
          border-top-width: 2px;
          animation: spin 900ms linear infinite;
        }

        :host([status="success"]) button::before {
          content: '✓';
          color: #fff;
          border-color: #16a34a;
          background-color: #16a34a;
          font-size: 20px;
          font-weight: 600;
        }

        button::after {
          content: "I'm not a robot";
        }

        :host([status="processing"]) button::after {
          content: 'Verifying…';
        }

        :host([status="success"]) button::after {
          content: 'Verified';
        }

        :host([layout="block"][status="success"]) article {
          display: none;
        }

        :host([layout="floating"]) {
          display: inline-block;
          anchor-name: --host;
        }

        :host([layout="floating"]) article {
          position: fixed;
          position-anchor: --host;
          position-area: block-end span-inline-end;
          z-index: 1000000;
          opacity: 0;
          pointer-events: none;
        }

        :host([layout="floating"][status="processing"]) article {
          opacity: 1;
          transition: opacity 100ms ease;
          pointer-events: auto;
        }
        
        :host([layout="floating"][status="success"]) article {
          transition: opacity 200ms ease-in;
          transition-delay: 500ms;
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
        <button></button>
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
      </article>`;

    this.shadowRoot.innerHTML = template.replace(/>\s+</g, '><').trim();
  }
}

customElements.define('treadwheel-widget', Widget);
