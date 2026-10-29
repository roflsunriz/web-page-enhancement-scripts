import { z } from "zod";
import type { NicoApiResponseBody } from "./nico-api-fetcher";

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const optionalString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);
const optionalNumber = z
  .number()
  .nullish()
  .transform((value) => value ?? undefined);
const schema = z.object({
  video: z.object({
    id: z.string().min(1),
    title: z.string(),
    count: z
      .object({
        view: optionalNumber,
        mylist: optionalNumber,
        comment: optionalNumber,
      })
      .nullish()
      .transform((value) => value ?? undefined),
    registeredAt: optionalString,
    thumbnail: z
      .object({ url: optionalString })
      .nullish()
      .transform((value) => value ?? undefined),
    description: optionalString,
  }),
  comment: z
    .object({
      nvComment: z
        .object({
          server: optionalString,
          params: z.unknown().optional(),
          threadKey: optionalString,
        })
        .nullish()
        .transform((value) => value ?? undefined),
    })
    .nullish()
    .transform((value) => value ?? undefined),
  owner: z
    .object({ nickname: optionalString, name: optionalString })
    .nullish()
    .transform((value) => value ?? undefined),
  channel: z
    .object({ name: optionalString })
    .nullish()
    .transform((value) => value ?? undefined),
  series: z
    .object({
      video: z
        .object({
          next: z
            .object({ id: optionalString })
            .nullish()
            .transform((value) => value ?? undefined),
        })
        .nullish()
        .transform((value) => value ?? undefined),
    })
    .nullish()
    .transform((value) => value ?? undefined),
});

export function parseWatchResponse(text: string): NicoApiResponseBody {
  let json = text;
  if (text.trimStart().startsWith("<")) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const content = doc
      .querySelector('meta[name="server-response"]')
      ?.getAttribute("content");
    if (!content) throw new Error("Watch page response data is missing");
    json = content;
  }

  let value: unknown;
  try {
    value = JSON.parse(json) as unknown;
  } catch {
    value = JSON.parse(decodeURIComponent(json)) as unknown;
  }
  if (!record(value) || !record(value.data))
    throw new Error("Invalid watch response");
  if (
    record(value.meta) &&
    typeof value.meta.status === "number" &&
    (value.meta.status < 200 || value.meta.status >= 300)
  ) {
    throw new Error(`Watch response failed (API ${value.meta.status})`);
  }
  const outer = record(value.data.response) ? value.data.response : value.data;
  let payload = outer;
  if ("$watchV4" in outer) {
    if (record(outer.$watchV4) && record(outer.$watchV4.data)) {
      payload = { ...outer, ...outer.$watchV4.data };
    } else if (!record(outer.video)) {
      throw new Error("Invalid watchV4 response");
    }
  }
  const result = schema.safeParse(payload);
  if (!result.success) throw new Error("Incomplete watch response data");
  return result.data;
}
