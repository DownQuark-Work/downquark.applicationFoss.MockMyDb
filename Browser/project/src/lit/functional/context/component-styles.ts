/**
 * before making this a regular theme implementation we are going to use it to help
 * rapidly prototype different web components and styles as we decide the approach
 * to be taken.
 *
 * Initialize Templated View #14 will extend this to allow use switch between:
 * - all (or a combination of) adobe, x, ibm
 * - default styles, or select custom overrides
 * */

import { html, LitElement } from "lit";
import { createContext, provide, consume } from "@lit/context";
import { customElement, property } from "lit/decorators.js";

export enum ThemeContextComponentEnum {
  ADOBE = "ADOBE",
  IBM = "IBM",
  X = "X",
}
export type ThemeContextType = {
  component: ThemeContextComponentEnum;
  styles: { [k: string]: string };
};
export const themeContext = createContext<ThemeContextType>(
  Symbol("themeContext"),
);

const defaultTheme = {
  component: ThemeContextComponentEnum.ADOBE,
  styles: { color: "inherit" },
};

@customElement("component-styles")
export class ComponentStyles extends LitElement {
  @property({ attribute: true, type: String })
  accessor "theme-component": ThemeContextComponentEnum =
    defaultTheme.component;
  @property({ attribute: true, type: String })
  accessor "theme-styles": { [k: string]: string } = defaultTheme.styles;

  @provide({ context: themeContext })
  accessor provider = defaultTheme;

  @consume({ context: themeContext })
  accessor consumer = defaultTheme;

  render() {
    return html`<slot></slot>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.provider = {
      component: this["theme-component"],
      styles: JSON.parse(JSON.stringify(this["theme-styles"])),
    };
    console.log(this.provider);
  }
}
