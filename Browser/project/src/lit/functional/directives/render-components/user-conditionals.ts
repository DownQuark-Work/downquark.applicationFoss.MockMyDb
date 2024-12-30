import { cookie } from "../../../../processes/web/native/cookie";

export const AssertUserAuthentication = () => !!cookie.Named("Token");

export const AssertUserAuthenticationByType = (
  successCriteria: string, // stub for if/when RBAC implemented
) =>
  successCriteria === "USER_REQUIRES_AUTHENTICATION" && !!cookie.Named("Token");
