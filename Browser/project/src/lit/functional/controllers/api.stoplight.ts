import { ReactiveController, ReactiveControllerHost } from "lit";
import { initialState, StatusRenderer, Task } from "@lit/task";

import {
  STOPLIGHT_API_RESOURCE_KEYS,
  STOPLIGHT_API_RESOURCE_KEYS_TYPE,
} from "../../../processes/web/api/stoplight";
import * as TriggerFetch from "../tasks/trigger-fetch";

export class ApiStoplightController implements ReactiveController {
  host: ReactiveControllerHost;

  value?: string[];
  readonly triggertypes = TriggerFetch.types;
  private _taskTrigger: Task<
    [TriggerFetch.TriggerType, TriggerFetch.FetchPropertiesType],
    TriggerFetch.Result
  >;
  private _triggerType: TriggerFetch.TriggerType =
    TriggerFetch.TRIGGER_TYPE_ENUM.MANUAL; // await user action by default

  private _resourceKey: string;
  private _fetchProperties: TriggerFetch.FetchPropertiesType = {};

  constructor(
    host: ReactiveControllerHost,
    resourceKey: STOPLIGHT_API_RESOURCE_KEYS_TYPE,
  ) {
    (this.host = host).addController(this);
    this._resourceKey =
      STOPLIGHT_API_RESOURCE_KEYS[resourceKey as unknown as string];

    this._taskTrigger = TriggerFetch.CreateTask(
      host,
      [this._resourceKey, initialState],
      () => [this._triggerType, this._fetchProperties],
    );
  }

  set fetchProperties(value: TriggerFetch.FetchPropertiesType | string) {
    const fetchPropertiesObj =
      typeof value === "string" ? JSON.parse(value) : value;

    this._fetchProperties = fetchPropertiesObj;
    this.host.requestUpdate();
  }
  get fetchProperties() {
    return this._fetchProperties;
  }

  set triggerType(value: TriggerFetch.TriggerType) {
    this._triggerType = value;
    this.host.requestUpdate();
  }
  get triggerType() {
    return this._triggerType;
  }

  render(renderFunctions: StatusRenderer<TriggerFetch.Result>) {
    return this._taskTrigger.render(renderFunctions);
  }

  hostConnected() {
    this.host.requestUpdate();
  }
  hostDisconnected() {
    this.host.requestUpdate();
  }
}
