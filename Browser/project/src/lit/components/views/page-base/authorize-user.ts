import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  STOPLIGHT_API_RESOURCE_KEYS,
  STOPLIGHT_API_RESOURCE_KEYS_TYPE,
} from "../../../../processes/web/api/stoplight";
import { ApiStoplightController } from "../../../functional/controllers/api.stoplight";
import * as TriggerFetch from "../../../functional/tasks/trigger-fetch";

import { cookie } from "../../../../processes/web/native/cookie";

@customElement("pagebase-authorizeuser")
class PageBaseAuthorizeUser extends LitElement {
  static styles: CSSResultGroup | undefined = css`
    details {
      font-family: monospace;
      font-size: smaller;
      min-height: 1.2rem;
      opacity: 0.6;
      position: relative;
      text-align: right;
      > summary {
        background-color: #7b8e9f;
        border-radius: 25%;
        cursor: pointer;
        display: block;
        height: 1rem;
        opacity: 0.8;
        padding-top: 0.2rem;
        position: absolute;
        right: 0;
        width: 1.2rem;
        text-align: center;
        &::marker {
          display: none;
        }
      }
    }
  `;

  @property({ attribute: false, type: Boolean })
  private accessor _asPass = true;

  @property({ attribute: false, type: Boolean })
  private accessor _isInvalid = true;

  private _authorizeUserController = new ApiStoplightController(
    this,
    STOPLIGHT_API_RESOURCE_KEYS.USER_AUTHENTICATE as unknown as STOPLIGHT_API_RESOURCE_KEYS_TYPE,
  );

  private _authProps = new Array(2);
  private _setFetchProperties() {
    const userCredentials = {
      user: {
        email: this._authProps[0],
        password: this._authProps[1],
      },
    };

    this._authorizeUserController.fetchProperties = JSON.stringify({
      params: { body: userCredentials },
    }); // update props
    this._authorizeUserController.triggerType =
      TriggerFetch.TRIGGER_TYPE_ENUM.TRIGGER_MANUAL; // fetch with updated props
  }

  authLogin(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation(); // prevent native form submission
    this._setFetchProperties();
  }

  validateInputFields() {
    this._isInvalid = true;
    if (this._authProps.length < 2) return;
    if (!this._authProps[0] || !this._authProps[1]) return;
    if (this._authProps[0].length < 4 || !/\w+@\w+\./.test(this._authProps[0]))
      return;
    if (this._authProps[1].length < 8) return;
    this._isInvalid = false;
  }
  changeInputEmail(ie: InputEvent) {
    this._authProps[0] = (ie.target as any).value;
    this.validateInputFields();
  }
  changeInputPassword(ie: InputEvent) {
    this._authProps[1] = (ie.target as any).value;
    this.validateInputFields();
  }

  handleSuccessfulLogin(loginResult: TriggerFetch.Result) {
    cookie.QuickSet = "jwt=" + loginResult.token;
    cookie.QuickSet = "email=" + loginResult.user.email;
    const authorizationEventDispatch = new CustomEvent("authorizeUser", {
      detail: { jwt: loginResult.token },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(authorizationEventDispatch);
  }

  loginFormTemplate() {
    return html` <form style="margin-top:2.5rem">
      <fieldset>
        <legend>Login</legend>
        <table>
          <tr>
            <td>
              <label for="email"><fw-label value="Email"></fw-label></label>
            </td>
            <td>
              <input
                id="email"
                type="email"
                pattern=".+@.+..+"
                name="email"
                @keyup="${this.changeInputEmail}"
                @change="${this.changeInputEmail}"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="password"
                ><fw-label value="Password"></fw-label
              ></label>
            </td>
            <td>
              <input
                id="password"
                name="password"
                type="${ifDefined(this._asPass ? "password" : undefined)}"
                @keyup="${this.changeInputPassword}"
                @change="${this.changeInputPassword}"
              />
              <fw-button
                color="text"
                @click="${() => (this._asPass = !this._asPass)}"
              >
                show password
              </fw-button>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td align="center">
              <fw-button
                color="primary"
                disabled="${ifDefined(
                  this._isInvalid ? "disbaled" : undefined,
                )}"
                @click="${this.authLogin}"
                >login</fw-button
              >
            </td>
          </tr>
        </table>
        <details>
          <summary>i</summary>
          <br /><br />
          &bull; Email must be valid and at least 4 characters
          <br />&bull;Password must be at least 8 characters
        </details>
      </fieldset>
    </form>`;
  }

  render() {
    return html`${this._authorizeUserController.render({
      complete: (result: TriggerFetch.Result) => {
        this.handleSuccessfulLogin(result);
        html`<core-progressindicator></core-progressindicator>`; // stub to allow event dispatch to complete
      },
      initial: () => html`${this.loginFormTemplate()}`,
      pending: () => html`<core-progressindicator></core-progressindicator>`,
      error: (e: any) =>
        html`<p>TODO: replace with notification web component<br />${e}</p>`,
    })}`;
  }
}

export { PageBaseAuthorizeUser };
