import { parse, stringify } from "query-string";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ParsedQs = Record<string, number | string>;

class NetworkError extends Error {
  public code: number;
  constructor(message: string, response: Response) {
    super(`[${response.url}](${response.status}) - ${message}`);
    this.code = response.status;
  }
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new NetworkError(response.statusText, response);
  }
  const data = await response.json();
  return data;
};

const noop = {};

const absoluteURL = (url: string) => /^https?:\/\//;

const useUrl = (path: string | null, qs: ParsedQs = noop) =>
  useMemo(() => {
    if (path === null) {
      return null;
    }
    const base = absoluteURL(path) ? path : window.location.origin;
    const url = new URL(path, base);
    url.search = stringify(qs);
    return url.href;
  }, [qs, path]);

const useQs = <T extends {}>() => {
  const [state, setState] = useState<T>({} as T);
  const previousUrl = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onChangeUrl = () => {
      const currentPath = window.location.href;
      if (currentPath === previousUrl.current) return;
      previousUrl.current = window.location.href;
      setState(
        parse(window.location.search, {
          parseBooleans: true,
          parseNumbers: true,
        }) as T
      );
    };
    const watcher = new MutationObserver(onChangeUrl);
    watcher.observe(document, { subtree: true, childList: true });
    window.addEventListener("popstate", onChangeUrl);
    window.addEventListener("hashchange", onChangeUrl);

    return () => {
      watcher.disconnect();
      window.removeEventListener("popstate", onChangeUrl);
      window.removeEventListener("hashchange", onChangeUrl);
    };
  }, []);
  return state;
};

const updateQueryString = (qs: string) => {
  const path = new URL(window.location.pathname, window.location.origin);
  path.search = qs;
  window.history.pushState({ path: path.href }, "", path.href);
};

const useUrlState = (path: string) => {
  const uncontrolledQs = useQs();
  const [controlledQs, setControlledQs] = useState(uncontrolledQs);
  const url = useUrl(path, controlledQs);

  useEffect(() => {
    setControlledQs(uncontrolledQs);
  }, [uncontrolledQs]);

  const setWindowQueryString = useCallback(<T>(params: T) => {
    const queryString = stringify(params);
    updateQueryString(queryString);
    setControlledQs(params);
  }, []);

  return { qs: controlledQs, href: url, setWindowQueryString };
};

export const HttpClient = {
  fetcher,
  useUrl,
  useQs,
  useUrlState,
};
