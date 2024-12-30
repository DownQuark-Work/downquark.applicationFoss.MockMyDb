class Cookie {
  constructor() {}

  get AllAvailable() {
    return document.cookie;
  }

  getNamed(namedCookie: string) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${namedCookie}=`))
      ?.split("=")[1];
  }

  setCookie(
    cookieKey: string,
    cookieVal: string = "",
    cookieExpInDays: number = 1,
  ) {
    // accepts only the stringified `key=value` - all options remain as defaults
    const dt = new Date();
    dt.setTime(dt.getTime() + cookieExpInDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + dt.toUTCString();
    if (typeof cookieKey !== "string" || typeof cookieVal !== "string")
      throw new Error(
        "Cookie Key and Value Must be Stored as string: Received " +
          typeof cookieKey +
          ", " +
          typeof cookieVal,
      );
    document.cookie = cookieKey + "=" + cookieVal + ";" + expires + ";path=/";
  }

  get Named() {
    return (namedCookie: string) =>
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${namedCookie}=`))
        ?.split("=")[1];
  }

  set Delete(cookie: string) {
    const existingCookie = this.Named(cookie);
    if (!existingCookie)
      throw new Error(
        "No pre-existing cookie exists with identifier: " + cookie,
      );
    this.setCookie(cookie, "DELETED", -1);
  }
  set QuickSet(cookie: string) {
    // accepts only the stringified `key=value` - all options remain as defaults
    if (typeof cookie !== "string")
      throw new Error(
        "Cookie Must be Stored as string: Received " + typeof cookie,
      );
    document.cookie = cookie;
  }
}

const cookie = new Cookie();
export { cookie };
