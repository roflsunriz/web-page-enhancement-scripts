import { GM_xmlhttpRequest } from "vite-plugin-monkey/dist/client";

export type GmHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface GmHttpRequest {
  url: string;
  method?: GmHttpMethod;
  headers?: Record<string, string>;
  data?: string | FormData | Blob | ArrayBuffer;
  responseType?: "arraybuffer" | "blob" | "json" | "stream" | "text";
  timeout?: number;
  onprogress?: (progress: Tampermonkey.ProgressResponse<object>) => void;
}

export interface GmHttpResponse<T = string> {
  status: number;
  statusText: string;
  response: T;
  finalUrl: string;
  headers: string;
}

export const gmRequest = <T = string>(
  request: GmHttpRequest,
): Promise<GmHttpResponse<T>> => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: request.url,
      method: request.method ?? "GET",
      headers: request.headers,
      data: request.data,
      responseType: request.responseType ?? "text",
      timeout: request.timeout,
      onprogress: request.onprogress,
      onload: (response) => {
        resolve({
          status: response.status,
          statusText: response.statusText,
          response: response.response as T,
          finalUrl: response.finalUrl,
          headers: response.responseHeaders,
        });
      },
      onerror: (error) => {
        const reason = error?.error ?? "unknown error";
        reject(new Error(`GM_xmlhttpRequest failed: ${reason}`));
      },
      ontimeout: () => {
        reject(new Error("GM_xmlhttpRequest timeout"));
      },
    });
  });
};
