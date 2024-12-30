import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("core-piechart")
class CorePieChart extends LitElement {
  static styles: CSSResultGroup = css`
    .pie-chart {
      position: relative;
      width: 25vi;
      height: 30vb;
      margin: 0;
    }
    .pie-chart h3 {
      position: absolute;
      margin: 1rem;
    }
    .pie-chart cite {
      position: absolute;
      bottom: 0;
      font-size: 80%;
      padding: 1rem;
      color: gray;
    }
    .pie-chart figcaption {
      position: absolute;
      bottom: 1em;
      right: 1em;
      font-size: smaller;
      text-align: right;
    }
    .pie-chart span:after {
      display: inline-block;
      content: "";
      width: 0.8em;
      height: 0.8em;
      margin-left: 0.4em;
      height: 0.8em;
      border-radius: 0.2em;
      background: currentColor;
    }
    /* */
    .pie-chart-test-results {
      background: radial-gradient(circle closest-side, transparent 66%, white 0),
        conic-gradient(#59a14f 0, #59a14f 62.5%, #e15759 0, #e15759 100%);
      position: relative;
      width: 25vi;
      height: 30vb;
      margin: 0;
      outline: 1px solid #ccc;
    }
    .pie-chart-test-results h2 {
      position: absolute;
      margin: 1rem;
    }
    .pie-chart-test-results cite {
      position: absolute;
      bottom: 0;
      font-size: 80%;
      padding: 1rem;
      color: gray;
    }
    .pie-chart-test-results figcaption {
      position: absolute;
      bottom: 1em;
      right: 1em;
      font-size: smaller;
      text-align: right;
    }
    .pie-chart-test-results span:after {
      display: inline-block;
      content: "";
      width: 0.8em;
      height: 0.8em;
      margin-left: 0.4em;
      height: 0.8em;
      border-radius: 0.2em;
      background: currentColor;
    }
  `;

  aggregates: KeyValueGenericType<number>;
  getCssGradientValue(aggregateKey: "complete" | "in_process") {
    return (
      (this.aggregates[aggregateKey] / this.aggregates.total) *
      100
    ).toFixed(1);
  }
  render() {
    return html` <style>
        .pie-chart {
          background: radial-gradient(
              circle closest-side,
              white 0,
              white 29.7%,
              transparent 29.7%,
              transparent 66%,
              white 0
            ),
            conic-gradient(
              var(--twelvefactor-color-green-status) 0,
              var(--twelvefactor-color-green-status)
                ${this.getCssGradientValue("complete")}%,
              var(--twelvefactor-color-bluegray-light) 0,
              var(--twelvefactor-color-bluegray-light)
                ${parseFloat(this.getCssGradientValue("complete")) +
                parseFloat(this.getCssGradientValue("in_process"))}%,
              var(--twelvefactor-color-gray-light) 0,
              var(--twelvefactor-color-gray-light) 99.9%
            );
        }
      </style>
      <figure class="pie-chart">
        <h3
          style="color:var(--twelvefactor-color-blue-dark-brand);margin-top:0;text-decoration:underline;"
        >
          Total Progress
        </h3>
        <figcaption>
          Completed ${this.aggregates.complete || 0}<span
            style="color:var(--twelvefactor-color-green-status)"
          ></span
          ><br />
          In Process ${this.aggregates.in_process || 0}<span
            style="color:var(--twelvefactor-color-bluegray-light)"
          ></span
          ><br />
          Unstarted ${this.aggregates.unstarted || 0}<span
            style="color:var(--twelvefactor-color-gray-light)"
          ></span>
        </figcaption>
        <cite>TwelveFactor Enrollments</cite>
      </figure>`;
  }
}

export { CorePieChart };
