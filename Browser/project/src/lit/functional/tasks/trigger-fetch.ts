import { ReactiveControllerHost } from "lit";
import { Task, ArgsFunction } from "@lit/task";

import { TRIGGER_FETCH_MOCK_DATA_ENROLLMENTS } from "./trigger-fetch-mock-data";

export type Result = any; // update with final shape of API call
export type TriggerType = (typeof types)[number];
export type FetchPropertiesType = Partial<{
  headers: KeyValueGenericType<string>;
  body: KeyValueGenericType<string>;
  query: KeyValueGenericType<string>;
}>;

export enum TRIGGER_TYPE_ENUM {
  MANUAL = "MANUAL",
  ON_LOAD = "ON_LOAD",
  ON_UPDATE_PROPERTIES = "ON_UPDATE_PROPERTIES",
  TRIGGER_MANUAL = "TRIGGER_MANUAL",
}

export const types = [
  TRIGGER_TYPE_ENUM.MANUAL, // do nothing when selected
  TRIGGER_TYPE_ENUM.ON_LOAD,
  TRIGGER_TYPE_ENUM.ON_UPDATE_PROPERTIES, // pagination, filter, sort, etc
  TRIGGER_TYPE_ENUM.TRIGGER_MANUAL, // trigger manual fetch request
  // expand as needed
] as const;

import { processStoplightApi } from "../../../processes/web/api/stoplight";
import { cookie } from "../../../processes/web/native/cookie";

export const CreateTask = (
  reactiveScope: ReactiveControllerHost,
  controlledProperties: (string | symbol)[],
  reactiveArguments: ArgsFunction<[TriggerType, FetchPropertiesType]>,
) =>
  new Task<[TriggerType, FetchPropertiesType], Result>(
    reactiveScope,
    async ([triggerType, fetchProperties]: [
      TriggerType,
      FetchPropertiesType,
    ]) => {
      const [resourceKey, initialState] = controlledProperties;
      if (
        !triggerType ||
        triggerType === TRIGGER_TYPE_ENUM.MANUAL ||
        !resourceKey
      )
        return initialState;

      const apiConfigEnrollments = processStoplightApi(
        resourceKey as string,
        fetchProperties,
      );

      if (typeof apiConfigEnrollments === "string")
        throw new Error(`API Configuration Error "${apiConfigEnrollments}"`);

      try {
        // @ts-ignore // only needed for mock data return
        const [url, options] = apiConfigEnrollments;

        if (cookie.Named("jwt")) {
          const forceNewestAuth = { ...options.headers };
          forceNewestAuth.Authorization = "Bearer " + cookie.Named("jwt");
          options.headers = forceNewestAuth;
        }
        // console.log('options',{...options.headers}); // for screengrab

        // FOR DEMO[POC] ONLY
        // if(~url.indexOf('enrollments')) // use ngrok for this
        //   return TRIGGER_FETCH_MOCK_DATA_ENROLLMENTS as Result
        if (~url.indexOf("test_results"))
          // mock this
          return TRIGGER_FETCH_MOCK_DATA_ENROLLMENTS as Result;

        const response = await fetch(url, options);
        const data = await response.json();
        return data as Result;
      } catch {
        throw new Error(`Failed to fetch "${triggerType}"`);
      }
    },
    reactiveArguments,
  );
