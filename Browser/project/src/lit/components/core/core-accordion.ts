import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("core-accordion")
class CoreAccordion extends LitElement {
  @property({ type: Boolean }) accessor container: boolean = false;

  render() {
    return html`${this.container
      ? html`<sp-accordion><slot></slot></sp-accordion>`
      : html`<sp-accordion-item
          open
          label="${ifDefined(this.attributes.getNamedItem("label")?.value)}"
          ><slot></slot
        ></sp-accordion-item>`}`;
  }
}

export { CoreAccordion };
