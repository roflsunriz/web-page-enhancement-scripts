import { gmRequest } from "@/shared/network/gmHttp";

import type { TextResponse } from "./alternative-sources";

const REQUEST_TIMEOUT_MS = 12_000;

export async function requestProviderPage(url: string): Promise<TextResponse> {
  const target = new URL(url);
  const headers: Record<string, string> = {
    Accept: "text/html,application/xhtml+xml",
  };
  if (target.hostname === "tapi.pureapk.com") {
    headers["Accept"] = "application/json";
    headers["Ual-Access-Businessid"] = "projecta";
    headers["Ual-Access-ProjectA"] = JSON.stringify({
      device_info: { os_ver: "35" },
    });
  }

  const response = await gmRequest<string>({
    url,
    method: "GET",
    responseType: "text",
    timeout: REQUEST_TIMEOUT_MS,
    anonymous: true,
    headers,
  });
  return {
    status: response.status,
    responseText: response.response,
    finalUrl: response.finalUrl,
  };
}
