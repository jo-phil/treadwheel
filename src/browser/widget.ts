import { unsealInWorker } from './index.js';

class TreadwheelWidget extends HTMLElement {
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

    try {
      const plaintext = await unsealInWorker(envelope);
      this.setAttribute('status', 'success');
      this.textContent = plaintext;
    } catch (error) {
      this.setAttribute('status', 'error');
    }
  };

  render() {
    if (!this.shadowRoot) return;

    const template = `<style>
        article {
          all: initial;
          display: block;
          box-sizing: border-box;
          width: min(280px, 100dvw);
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

          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }

        :host([status="processing"]) button::before {
          border-radius: 50%;
          border-color: transparent transparent #111 #111;
          animation: spin 1s linear infinite;
        }

        :host([status="success"]) button::before {
          border-color: #16a34a;
          background-color: #16a34a;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTE4IDgtOCA5LTQtNCIvPjwvc3ZnPg==");
        }

        :host([status="error"]) button::before {
          border-color: #dc2626;
          background-color: #dc2626;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTE3IDcgNyAxN003IDdsMTAgMTAiLz48L3N2Zz4=");
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
        
        :host([status="error"]) button::after {
          content: 'Verification failed';
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

        :host([layout="floating"][status="processing"]) article,
        :host([layout="floating"][status="error"]) article {
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

customElements.define('treadwheel-widget', TreadwheelWidget);
