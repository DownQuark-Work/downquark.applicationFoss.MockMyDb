import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("enrollment-testresults")
class EnrollmentTestResults extends LitElement {
  static styles = css`
    section {
      align-items: center;
      display: flex;
      justify-content: space-between;
      width: 28vi;
    }
    .grade {
      background: slategray;
      border: 1px solid darkgray;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      font-size: 1rem;
      height: 2.5em;
      margin: 0 0.25rem;
      line-height: 2.5em;
      width: 2.5em;
      text-align: center;
      text-transform: uppercase;
      & + & {
        margin-left: -0.75rem;
      }
    }
    .grade-a {
      background: var(--twelvefactor-color-green-status);
      color: white;
    }
    .grade-b {
      background: var(--twelvefactor-color-blue-status);
      color: white;
    }
    .grade-c {
      background: var(--twelvefactor-color-gray-status);
      color: white;
    }
    .grade-d {
      background: darkorange;
      color: lightorange;
    }
    .grade-f {
      background: darkred;
      color: lightred;
    }
  `;
  grades: number[];

  convertGrade(percentage) {
    if (typeof percentage === "string") return percentage;
    const percent = Math.round(percentage);
    if (percent > 89) return "A";
    if (percent > 79) return "B";
    if (percent > 69) return "C";
    if (percent > 59) return "D";
    return "F";
  }

  render() {
    return html` <section>
        <p style="text-transform:capitalize;margin-top:2rem;"><slot></slot></p>
        <div style="display:flex;margin-top:1.5rem;">
          ${this.grades.map((grade) => {
            const letterGrade = this.convertGrade(grade);
            return html`<div class="grade grade-${letterGrade.toLowerCase()}">
              ${letterGrade}
            </div>`;
          })}
        </div>
      </section>
      <br />`;
  }
}

export { EnrollmentTestResults };
