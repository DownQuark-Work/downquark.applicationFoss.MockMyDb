import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import * as TriggerFetch from "../../../functional/tasks/trigger-fetch";
import {
  STOPLIGHT_API_RESOURCE_KEYS,
  STOPLIGHT_API_RESOURCE_KEYS_TYPE,
} from "../../../../processes/web/api/stoplight";
import { ApiStoplightController } from "../../../functional/controllers/api.stoplight";

@customElement("iterated-testresults")
class IteratedTestResults extends LitElement {
  private _fetchTestResultsController = new ApiStoplightController(
    this,
    STOPLIGHT_API_RESOURCE_KEYS.LIST_ALL_USER_ORGANIZATION_TEST_RESULTS as unknown as STOPLIGHT_API_RESOURCE_KEYS_TYPE,
  );

  private _setTrigger(trigger: TriggerFetch.TRIGGER_TYPE_ENUM) {
    this._fetchTestResultsController.triggerType = trigger;
  }

  render() {
    return html`<section style="display:none">
      <p>
        content mocked for upcoming demo - leaving element in place to prove
        \`test_results\` API call is taking place
      </p>
      <p>LOAD TEST RESULTS: LIST_ALL_USER_ORGANIZATION_TEST_RESULTS</p>
    </section> `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._setTrigger(TriggerFetch.TRIGGER_TYPE_ENUM.ON_LOAD);
  }
}

export { IteratedTestResults };
