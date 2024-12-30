import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

import { cookie } from "../../../../processes/web/native/cookie";
import { manageConfig } from "../../../../processes/worker/manage-config";
import {
  RenderComponent,
  GATE_AND_GUARD_TYPES,
} from "../../../functional/directives/render-component";

import "../../views/page-base/authorize-user";
import "../../views/page-base/user-authorized";

import "../../views/enrollments-userorg";
import "../../core/core-progressindicator";

@customElement("template-pagebase")
class TemplatePageBase extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    .flex-container-border {
      padding: 5px;
    }
    .fw-flex {
      display: flex;
      justify-content: center;
      /* margin-top: 8vb; */
    }
  `;

  constructor() {
    super();
    if ("serviceWorker" in navigator) {
      manageConfig(() => (this.configManaged = true));
    } else this._configManaged = true;

    this._setUserAuthorization();
  }

  @property({ attribute: false, type: Boolean })
  private accessor _configManaged = false;
  @property({ attribute: false, type: Boolean })
  private accessor _userAuthorized: string | false = false;

  set configManaged(configBool: boolean) {
    this._configManaged = configBool;
  }

  _setUserAuthorization(ce?: CustomEvent) {
    if (ce?.detail.jwt === null) {
      this._userAuthorized = false;
      return;
    }

    this._userAuthorized =
      (!!cookie.Named("jwt") && cookie.Named("jwt")) || false;
  }

  render() {
    // waiting for service worker: ${this._configManaged.toString()}
    return html`<div class="fw-flex flex-container-border">
      ${this._configManaged && this._userAuthorized // skip check if already validated
        ? html`<pagebase-userauthorized
            @unauthorizeUser=${this._setUserAuthorization}
          ></pagebase-userauthorized>`
        : RenderComponent(
            GATE_AND_GUARD_TYPES.USER_REQUIRES_AUTHENTICATION, // check user for auth
            this._configManaged
              ? html`<pagebase-userauthorized></pagebase-userauthorized>`
              : html`<core-progressindicator></core-progressindicator>`, // success
            html`<pagebase-authorizeuser
              @authorizeUser=${this._setUserAuthorization}
            ></pagebase-authorizeuser>`, // failure
          )}
    </div>`;
  }
}
export { TemplatePageBase };
