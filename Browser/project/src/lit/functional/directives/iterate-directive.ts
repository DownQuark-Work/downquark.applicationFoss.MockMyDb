import { Directive, directive, PartType } from "lit/directive.js";

import { formatOrganizationEnrollments } from "./iterate-directive/enrollments";

class IterateDirective extends Directive {
  _partInfo = { element: { nodeName: "" } };
  _formattedIterations: Array<[string, { [k: string]: any }]> = [];

  constructor(partInfo: any) {
    super(partInfo);
    this._partInfo = partInfo;

    if (
      !(partInfo.type === PartType.PROPERTY && partInfo.name === "iterations")
    )
      throw new Error(
        'The `Iterate` directive must be used as a `property` attribute named "iterations"',
      );
  }
  render(data: any) {
    switch (this._partInfo.element.nodeName) {
      case "ITERATED-ENROLLMENTS":
        this._formattedIterations = formatOrganizationEnrollments(
          data,
        ) as typeof this._formattedIterations;
        break;
    }

    return this._formattedIterations;
  }
}
// Create the directive function
export const Iterate = directive(IterateDirective);
