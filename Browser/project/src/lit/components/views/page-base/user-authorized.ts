import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import { cookie } from "../../../../processes/web/native/cookie";
import "../enrollments-userorg";

@customElement("pagebase-userauthorized")
class PageBaseUserAuthorized extends LitElement {
  static styles?: CSSResultGroup | undefined = css`
    p {
      font-size: 1.5rem;
      font-weight: 800;
      text-transform: uppercase;
    }
  `;
  // @ts-ignore -- TODO: regex to allow unused vars if /^_/
  private _setUserLogout(_pe: PointerEvent) {
    cookie.Delete = "email";
    cookie.Delete = "jwt";
    const authorizationEventDispatch = new CustomEvent("unauthorizeUser", {
      detail: { jwt: null },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(authorizationEventDispatch);
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/css/crayons-min.css"
      />
      <div
        class="fw-flex fw-justify-between"
        style="align-items:center;margin-bottom:1rem"
      >
        <img
          src="twelvefactor-logo.png"
          alt="TwelveFactor"
          height="46"
          width="350"
        />
        <p style="margin-block: 0;">clinic dashboard</p>
        <fw-menu>
          <fw-menu-item>
            <fw-avatar initials="PT" size="xsmall" slot="prefix"></fw-avatar>
            ${cookie.Named("email")}
            <fw-button
              slot="suffix"
              color="primary"
              @click=${this._setUserLogout}
              >Log Out</fw-button
            >
          </fw-menu-item>
        </fw-menu>
      </div>
      <!-- https://telekom.github.io/scale/?path=/docs/components-sidebar-navigation--active-on-level-1 -->
      <enrollments-userorg></enrollments-userorg>
    `;
  }
}

export { PageBaseUserAuthorized };
