export const PUBLIC_NAVIGATION_PATH_KEY = "nan-public-navigation-path";
export const PUBLIC_NAVIGATION_HISTORY_KEY = "nan-public-navigation-history";

export function shouldUseBrowserHistory(historyLength: number, hasInAppHistory: boolean): boolean {
  return historyLength > 1 && hasInAppHistory;
}

export function getBackFallback(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/" || path === "/explore") return null;
  if (["/calendar", "/passport", "/rewards", "/chat"].includes(path)) return "/";

  const checkinMatch = path.match(/^\/checkin\/([^/]+)$/);
  if (checkinMatch) return `/events/${checkinMatch[1]}`;
  if (/^\/events\/[^/]+$/.test(path)) return "/calendar";

  const postMatch = path.match(/^\/posts\/([^/]+)\/[^/]+$/);
  if (postMatch) return `/posts/${postMatch[1]}`;
  if (/^\/posts\/[^/]+$/.test(path)) return "/explore";

  if (/^\/s\/[^/]+$/.test(path)) return "/";
  if (
    ["/map", "/plan", "/wellness", "/search"].includes(path) ||
    /^(?:\/category|\/place|\/biz)\/[^/]+$/.test(path)
  ) {
    return "/explore";
  }

  return "/";
}
