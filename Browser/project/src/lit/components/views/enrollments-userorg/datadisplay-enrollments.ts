import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Iterate } from "../../../functional/directives/iterate-directive";

import "../../core/core-accordion";
import "../../templates/iterables/iterated-enrollments";
import "../../templates/iterables/iterated-testresults";

@customElement("datadisplay-enrollments")
class DisplayDataEnrollments extends LitElement {
  @property({ attribute: true, type: Object }) accessor enrollments: {
    data: any[];
  } = { data: [] };

  render() {
    return html`
      <iterated-testresults></iterated-testresults>
      <!-- <scale-card label="TwelveFactor"> -->
      <iterated-enrollments
        .iterations="${Iterate(this.enrollments)}"
      ></iterated-enrollments>
      <!-- </scale-card> -->
    `;
  }
}

export { DisplayDataEnrollments };
