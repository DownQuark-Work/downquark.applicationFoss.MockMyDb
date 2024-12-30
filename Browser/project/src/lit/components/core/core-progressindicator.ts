import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * This should be extended to hold all types
 * - bars, spinners, etc
 */
@customElement("core-progressindicator")
class CoreProgressIndicator extends LitElement {
  render() {
    return html`<l-cardio
      size="50"
      stroke="4"
      speed="1.5"
      color="teal"
    ></l-cardio>`;
    return html`<sl-spinner
      style="font-size: 3rem; --indicator-color: deeppink; --track-color: pink;"
    ></sl-spinner>`;
  }
}

export { CoreProgressIndicator };
