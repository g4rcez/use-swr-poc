import { stringify, parse } from "query-string";
import { useEffect, useMemo, useRef, useState } from "react";

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

export const HttpClient = {
  fetcher,
  useUrl: (path: string, qs: ParsedQs = noop, base = window.location.origin) =>
    useMemo(() => {
      const url = new URL(path, base);
      url.search = stringify(qs);
      return url.href;
    }, [qs, path, base]),

  useQs: <T extends {}>() => {
    const [state, setState] = useState<T>({} as T);
    const previousUrl = useRef("");

    useEffect(() => {
      if (typeof window === "undefined") return;
      const watcher = new MutationObserver(() => {
        const path = window.location.href;
        if (path === previousUrl.current) return;
        previousUrl.current = window.location.href;
        setState(
          parse(window.location.search, {
            parseBooleans: true,
            parseNumbers: true,
          }) as T
        );
      });
      watcher.observe(document, { subtree: true, childList: true });
      return () => {
        watcher.disconnect();
      };
    }, []);
    return state;
  },
};
