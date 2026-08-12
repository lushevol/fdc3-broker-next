import { getUser } from "./authenticator";

const getEabledUsers = (name) => {
  const { id } = getUser();
  const enabledUsers = ratanConfig?.enableFeatureForUser
    ? ratanConfig?.enableFeatureForUser[name]
    : undefined;
  if (enabledUsers) {
    if (enabledUsers.includes(id)) {
      return true;
    }
    return false;
  }
  return "ignore";
};

const getEabledPages = (name, page?: string) => {
  const enabledPage = ratanConfig?.enableFeatureForPage
    ? ratanConfig?.enableFeatureForPage[name]
    : undefined;
  if (enabledPage && page) {
    if (enabledPage.includes(page)) {
      return true;
    }
    return false;
  }
  return "ignore";
};

export const getEnable: Function = (name: string, page?: string) => {
  if (ratanConfig?.disabledFeature?.includes(name)) {
    const enableUsers = getEabledUsers(name);
    const enablePages = getEabledPages(name, page);

    if (
      enableUsers !== false &&
      enablePages !== false &&
      (enablePages === true || enableUsers === true)
    ) {
      return true;
    }
    return false;
  }
  return true;
};
