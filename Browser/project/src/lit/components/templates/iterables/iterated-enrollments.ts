import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import "../../views/enrollments-userorg/enrollment-progress";
import "../../views/enrollments-userorg/enrollment-testresults";
import "../../core/core-piechart";

// below will be pulled from the database (`iterated-testresults.ts`) when applicable
// - temporarily using mock values for demo purposes
const daysInMs = 1000 * 60 * 60 * 24,
  MockTestResults: [string, number[], number[]][] = [
    [
      "HTS CRM Pathway",
      [73, 80, 91],
      [
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 2,
        Date.now() - daysInMs * 1,
      ],
    ],
    [
      "cardiac anatomy and physiology",
      [71, 94],
      [Date.now() - daysInMs * 3, Date.now() - daysInMs * 2],
    ],
    [
      "electrical and mechanical function",
      [81, 79, 90],
      [
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 2,
      ],
    ],

    [
      "cardiac rhythm management 1",
      [73, 80, 93],
      [
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 2,
        Date.now() - daysInMs * 1,
      ],
    ],
    [
      "Advanced ablation techniques",
      [71, 94],
      [Date.now() - daysInMs * 3, Date.now() - daysInMs * 2],
    ],
    ["electrophysiology bundle 2", [90], [Date.now() - daysInMs * 1]],

    [
      "electrophysiology bundle 1",
      [73, 80, 91],
      [
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 2,
        Date.now() - daysInMs * 1,
      ],
    ],
    [
      "cardiac rhythm management 2",
      [71, 94],
      [Date.now() - daysInMs * 3, Date.now() - daysInMs * 2],
    ],
    [
      "cardiac anatomy and physiology",
      [81, 79, 90],
      [
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 3,
        Date.now() - daysInMs * 2,
      ],
    ],
  ];
let MockTestResultsIterationPointer = 0;

@customElement("iterated-enrollments")
class IteratedEnrollments extends LitElement {
  @property({ attribute: true, type: Array }) accessor iterations: any[] = [];

  displayEnrollmentTestResult() {
    const curTestResult =
      MockTestResults[MockTestResultsIterationPointer % MockTestResults.length];
    MockTestResultsIterationPointer = MockTestResultsIterationPointer + 1;
    return html`<enrollment-testresults .grades="${curTestResult[1]}"
      >${curTestResult[0]}</enrollment-testresults
    >`;
  }

  private _iterateIndex = 1;
  iterateOrgEnrollments = (orgEnrollment: any[]) => {
    this._iterateIndex = this._iterateIndex + 1;
    const usr = orgEnrollment.shift(),
      // @ts-ignore -- TODO: regex to allow unused vars if /^_/
      _org = orgEnrollment.shift(),
      aggregates = orgEnrollment.shift();

    return html`<div style="margin-bottom:1rem">
      <scale-card label="TwelveFactor User">
        <h3
          style="color:var(--twelvefactor-color-blue-light-brand);margin-bottom:1rem;"
        >
          ${usr.first_name} ${usr.last_name}
          <!-- all retrieved db data has been updated within seconds of each other - use below for demo -->
          <small style="color:var(--twelvefactor-color-gray-dark);"
            >last active: ${this._iterateIndex} days ago</small
          >
        </h3>
        <div style="display:flex">
          <section>
            <scale-card label="TwelveFactor Enrollments">
              <h3
                style="color:var(--twelvefactor-color-blue-dark-brand);position:absolute;text-decoration:underline;"
              >
                Enrollment Progresss
              </h3>
              <div
                style="max-height:calc(30vb - 2rem);overflow:auto;margin-top:2rem;"
              >
                ${orgEnrollment.map(
                  (usrEnrollment) =>
                    html`<enrollment-progress
                      .progress="${usrEnrollment}"
                    ></enrollment-progress>`,
                )}
              </div>
            </scale-card>
          </section>
          <div>
            <scale-divider vertical style="height:30vb"></scale-divider>
          </div>
          <section>
            <scale-card label="TwelveFactor Test Results">
              <h3
                style="color:var(--twelvefactor-color-blue-dark-brand);position:absolute;text-decoration:underline;"
              >
                Test Results
              </h3>
              <div
                style="align-items:center;max-height:calc(30vb - 2rem);overflow:auto;margin-top:2rem;"
              >
                ${this.displayEnrollmentTestResult()}
                ${this.displayEnrollmentTestResult()}
                ${this.displayEnrollmentTestResult()}
              </div>
            </scale-card>
          </section>
          <div>
            <scale-divider vertical style="height:30vb"></scale-divider>
          </div>
          <section>
            <scale-card label="TwelveFactor Graph">
              <div style="max-height:30vb;overflow:auto">
                <core-piechart .aggregates="${aggregates}"></core-piechart>
              </div>
            </scale-card>
          </section>
        </div>
      </scale-card>
    </div> `;
  };

  render() {
    const enrolledUsers = html`${repeat(this.iterations, (orgEnrollment) =>
      this.iterateOrgEnrollments(orgEnrollment[1]),
    )}`;
    return html`${enrolledUsers}`;
  }
}

export { IteratedEnrollments };
