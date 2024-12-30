import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import {
  STOPLIGHT_API_RESOURCE_KEYS,
  STOPLIGHT_API_RESOURCE_KEYS_TYPE,
} from "../../../processes/web/api/stoplight";
import { ApiStoplightController } from "../../functional/controllers/api.stoplight";
import * as TriggerFetch from "../../functional/tasks/trigger-fetch";

import "../core/core-progressindicator";
import "./enrollments-userorg/datadisplay-enrollments";

@customElement("enrollments-userorg")
class EnrollmentsUserOrg extends LitElement {
  readonly _DEBUG = 0;

  private _fetchEnrollmentController = new ApiStoplightController(
    this,
    STOPLIGHT_API_RESOURCE_KEYS.LIST_ALL_USER_ORGANIZATION_ENROLLMENTS as unknown as STOPLIGHT_API_RESOURCE_KEYS_TYPE,
  );

  private _setTrigger(e: Event | TriggerFetch.TRIGGER_TYPE_ENUM) {
    this._fetchEnrollmentController.triggerType =
      typeof e === "string"
        ? e
        : ((e.target as HTMLSelectElement)
            .value as TriggerFetch.TRIGGER_TYPE_ENUM);
  }

  private _setFetchProperties(e: Event) {
    this._fetchEnrollmentController.fetchProperties = (
      e.target as HTMLSelectElement
    ).value as string;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <section>
        ${this._fetchEnrollmentController.render({
          complete: (result: TriggerFetch.Result) =>
            html`<datadisplay-enrollments
              .enrollments="${result}"
            ></datadisplay-enrollments>`,
          initial: () =>
            html`<p>
              Invalid configuration key:
              ${STOPLIGHT_API_RESOURCE_KEYS.LIST_ALL_USER_ORGANIZATION_ENROLLMENTS}
            </p>`,
          pending: () =>
            html`<core-progressindicator></core-progressindicator>`,
          error: (e: any) =>
            html`<p>
              TODO: replace with notification web component<br />${e}
            </p>`,
        })}
        ${this._DEBUG
          ? html`<select @change=${this._setFetchProperties}>
              <option value="{}">default</option>
              <option
                value="${JSON.stringify({
                  headers: { Prefer: "code=200, example=Example 1" },
                })}"
              >
                example 1
              </option>
              <option
                value="${JSON.stringify({
                  headers: { Prefer: "code=200, example=Example 2" },
                })}"
              >
                example 2
              </option>
              <option
                value="${JSON.stringify({
                  params: { query: { "page[number]": 1, "page[size]": 1 } },
                })}"
              >
                1 result, page 1
              </option>
              <option
                value="${JSON.stringify({
                  params: { query: { "page[number]": 2, "page[size]": 1 } },
                })}"
              >
                1 result, page 2
              </option>
              <option
                value="${JSON.stringify({
                  params: { query: { include: "courses" } },
                })}"
              >
                Filter courses
              </option>
            </select>`
          : html``}
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setTrigger(TriggerFetch.TRIGGER_TYPE_ENUM.ON_LOAD);
  }
}

export { EnrollmentsUserOrg };
