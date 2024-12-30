// IMPORTANT: all content here is client facing.
// - DO NOT include _any_ content requiring authorization (or any other gate/guard access)
//
// ALSO NOTE: The values exported in `API_STOPLIGHT_RESOURCES` are the source of truth for the
// application API call types. This allows all internals to be updated without a deploy if/when required

import { StringMap } from "../types";

// @ts-ignore
const { DATABASE_URI_NGROK, DATABASE_URI_STOPLIGHT, SLUG } = __ENV_DOT_FILES__,
  APP_ENV = (import.meta as ImportMeta & { env: { PROD: boolean } }).env.PROD
    ? "PROD"
    : "DEV",
  USE_NGROK = 1;

const defaultEndPointConfig = {
  api_uri: USE_NGROK
    ? "https://staging-api.twelvefactor.com"
    : DATABASE_URI_STOPLIGHT + SLUG,
  headers: {
    Accept: "application/vnd.api+json",
    Authorization: "Bearer 123",
    "ngrok-skip-browser-warning": "1313",
  },
  params: {
    ALLOW_UNSPECIFIED: APP_ENV === "DEV", // to help with dev/debugging
  },
};

const LIST_ALL_USER_ORGANIZATION_ENROLLMENTS = {
  // List all Enrollments at the User's Organization
  url: `${defaultEndPointConfig.api_uri}/enrollments`,
  method: "GET",
  headers: {
    ...defaultEndPointConfig.headers,
  },
  params: {
    ...defaultEndPointConfig.params,
    query: {
      AVAILABLE_OPTS: ["include", "page[number]", "page[size]"],
    },
  },
  REQUIRED_VALUES: [
    "headers.Authorization",
    // 'params.query.DNE', // DEBUG
  ],
};

const LIST_OPEN_COURSES = {
  // List all Open Courses
  url: `${defaultEndPointConfig.api_uri}/enrollments`,
  method: "GET",
  headers: {
    ...defaultEndPointConfig.headers,
  },
  params: {
    ...defaultEndPointConfig.params,
    query: {},
  },
  REQUIRED_VALUES: ["headers.Authorization"],
};

const USER_AUTHENTICATE = {
  url: `${defaultEndPointConfig.api_uri}/users/sign-in`,
  method: "POST",
  headers: {
    ...defaultEndPointConfig.headers,
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
  },
  params: {
    ...defaultEndPointConfig.params,
    body: {
      AVAILABLE_OPTS: ["user"],
    },
    query: {},
  },
  REQUIRED_VALUES: ["params.body.user.email", "params.body.user.password"],
};
if (
  (
    USER_AUTHENTICATE.headers as typeof USER_AUTHENTICATE.headers & {
      Authorization: string;
    }
  ).Authorization
)
  delete (USER_AUTHENTICATE.headers as { Authorization?: string })
    .Authorization;

const USER_UNAUTHENTICATE = {
  ...USER_AUTHENTICATE,
  url: `${defaultEndPointConfig.api_uri}/users/sign_out`,
  method: "DELETE",
  REQUIRED_VALUES: ["headers.Authorization"],
};

// below to be consumed by js module `import` methods
export const API_STOPLIGHT_RESOURCES: { [k: string]: any } = {
  _updated: Date.now(), // set version as timestamp with each update
  LIST_ALL_USER_ORGANIZATION_ENROLLMENTS,
  LIST_OPEN_COURSES,
  USER_AUTHENTICATE,
  USER_UNAUTHENTICATE,
};

// below to be consumed ONLY by service workers
export const SW_API_STOPLIGHT_RESOURCES: StringMap<
  typeof API_STOPLIGHT_RESOURCES
> = JSON.parse(JSON.stringify(API_STOPLIGHT_RESOURCES));
