import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("enrollment-progress")
class EnrollmentProgress extends LitElement {
  static styles = css``;

  @property() accessor progress: any = {};

  render() {
    let variant = "";
    if (this.progress.stats.percentage_completed < 25) variant = "notice";
    if (this.progress.stats.percentage_completed > 85) variant = "positive";
    // https://telekom.github.io/scale/?path=/docs/components-progress-bar--standard
    return html` <scale-progress-bar
        percentage="${Math.round(this.progress.stats.percentage_completed)}"
        percentage-start="${Math.round(
          this.progress.stats.percentage_completed,
        )}"
        label="${this.progress.name}"
        status-description="${this.progress.description}"
        show-status="true"
        show-progress="false"
        styles="${variant === "positive"
          ? ".progress-bar__outer{transition:none !important;} :host{--background:var(--twelvefactor-color-green-status) !important;}"
          : ":host{--background:var(--twelvefactor-color-bluegray-dark) !important;}"}"
      ></scale-progress-bar>
      <br />`;
  }
}

export { EnrollmentProgress };
