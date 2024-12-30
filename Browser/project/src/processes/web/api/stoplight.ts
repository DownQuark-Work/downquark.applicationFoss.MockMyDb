import { API_STOPLIGHT_RESOURCES } from "../../../resources/api.stoplight";

const { _updated, ...apiResourceObj } = API_STOPLIGHT_RESOURCES,
  apiResourceKeyValues = { ...Object.keys(apiResourceObj) };
export const STOPLIGHT_API_RESOURCE_KEYS: KeyValueGenericType<string> = {};
for (const resource_key in apiResourceKeyValues) {
  STOPLIGHT_API_RESOURCE_KEYS[apiResourceKeyValues[resource_key]] =
    apiResourceKeyValues[resource_key];
}

export type STOPLIGHT_API_RESOURCE_KEYS_TYPE = {
  [K in keyof typeof STOPLIGHT_API_RESOURCE_KEYS]: (typeof STOPLIGHT_API_RESOURCE_KEYS)[K];
};

const validateFetchParams = (key: string, opts = {}) => {
  const resourceConfig = { ...API_STOPLIGHT_RESOURCES[key] };

  if (!resourceConfig || !Object.keys(resourceConfig).length)
    throw new Error("INVALID API CONFIG TYPE: " + key);

  const {
      REQUIRED_VALUES = [],
      params: {
        ALLOW_UNSPECIFIED: ALLOW_UNSPECIFIED_PARAMS,
        ...resourceParams
      },
      ...defaultResourceParams
    } = resourceConfig,
    defaultFetchParams = {
      ...defaultResourceParams,
      params: { ...resourceParams },
    };

  const deepMergeObjects = (target: any, source: any) => {
    for (const key in source) {
      if (typeof source[key] === "object") {
        if (!target[key]) target[key] = {};
        deepMergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  const fullFetchParams = deepMergeObjects(defaultFetchParams, opts);

  const verifyRequiredValues = () => {
    REQUIRED_VALUES.forEach((reqVal: string) => {
      let validateFullFetch = { ...fullFetchParams };

      reqVal.split(".").forEach((reqValKey: string) => {
        validateFullFetch = validateFullFetch[reqValKey];
        if (!validateFullFetch)
          throw new Error("MISSING REQUIRED PARAM VALUE: " + reqVal);
      });
    });
  };
  verifyRequiredValues();

  const filterAllowedParamOpts = () => {
    // no need to throw. there may be valid use cases (RBAC, etc).  just remove any not allowed
    for (const paramType in fullFetchParams.params) {
      const { AVAILABLE_OPTS: allowedOpts, ...allOpts } =
        fullFetchParams.params[paramType];
      fullFetchParams.params[paramType] = allOpts;

      if (ALLOW_UNSPECIFIED_PARAMS || !allowedOpts) continue;

      Object.keys(allOpts).forEach((curOpt: string) => {
        if (!allowedOpts.includes(curOpt))
          delete fullFetchParams.params[paramType][curOpt];
      });
    }
  };
  filterAllowedParamOpts();

  return fullFetchParams;
};

const formatValidatedData = (validData: { [k: string]: any }) => {
  const { params, url, ...formattedData } = validData;

  if (params.query) {
    let urlQuery = "";
    Object.entries(params.query).forEach((qry: [string, unknown]) => {
      urlQuery += `&${qry[0]}=${qry[1]}`;
    });
    urlQuery = encodeURI(urlQuery.replace("&", "?"));
    formattedData.url = url + urlQuery;
  }
  if (params.body) formattedData.body = JSON.stringify(params.body);

  const { url: urlstr, ...options } = formattedData;
  return [urlstr, options];
};

export const processStoplightApi = (
  apiKey: string,
  fetchOpts: Object = {},
): any => {
  let validatedFetchParams = {};
  try {
    validatedFetchParams = validateFetchParams(apiKey, fetchOpts);
  } catch (error) {
    return "ERROR: " + (error as { message: string }).message;
  }

  return formatValidatedData(validatedFetchParams);
};
