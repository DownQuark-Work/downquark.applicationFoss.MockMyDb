import { Directive, directive, PartType } from "lit/directive.js";

import { AssertUserAuthentication } from "./render-components/user-conditionals";

export enum GATE_AND_GUARD_TYPES {
  // GATES
  USER_IS_AUTHENTICATED = "USER_IS_AUTHENTICATED",
  // GUARDS
  USER_REQUIRES_AUTHENTICATION = "USER_REQUIRES_AUTHENTICATION",
}

class RenderComponentDirective extends Directive {
  _partInfo!: unknown;

  constructor(partInfo: any) {
    super(partInfo);
    this._partInfo = partInfo;
    if (!(partInfo.type === PartType.CHILD))
      throw new Error(
        'The `Iterate` directive must be used as a `child` part named "iterations"',
      );
    // console.log('PartType',PartType) // keep for debug
  }
  render(
    gateGuard: GATE_AND_GUARD_TYPES,
    SuccessComponent: unknown,
    FailOverComponent?: unknown,
  ) {
    let renderConditional!: Function;
    switch (gateGuard) {
      case "USER_IS_AUTHENTICATED":
      case "USER_REQUIRES_AUTHENTICATION":
        renderConditional = AssertUserAuthentication;
        break;
    }
    // console.log('renderConditional(gateGuard)',renderConditional(gateGuard)); // keep for debug

    return renderConditional(gateGuard) ? SuccessComponent : FailOverComponent;
  }
}
// Create the directive function
export const RenderComponent = directive(RenderComponentDirective);
