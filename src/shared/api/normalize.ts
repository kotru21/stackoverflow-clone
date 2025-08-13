// Универсальные помощники для нормализации ответов API

export function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function getKey<T = unknown>(obj: unknown, key: string): T | undefined {
  return isObj(obj) && key in obj
    ? ((obj as Record<string, unknown>)[key] as T)
    : undefined;
}

export function unwrapData<T>(raw: unknown): T {
  if (isObj(raw) && "data" in raw) {
    return (raw as Record<string, unknown>)["data"] as T;
  }
  return raw as T;
}

export type PaginatedMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export function normalizePaginated<T>(
  raw: unknown,
  opts: {
    fallbackLimit: number;
    pageParam: number;
  }
): Paginated<T> {
  const rawData = getKey<unknown>(raw, "data");
  const payload = Array.isArray(rawData)
    ? (raw as Record<string, unknown>)
    : isObj(rawData)
    ? (rawData as Record<string, unknown>)
    : isObj(raw)
    ? (raw as Record<string, unknown>)
    : ({ data: [] } as Record<string, unknown>);

  const dataUnknown = getKey<unknown>(payload, "data");
  const data = (Array.isArray(dataUnknown) ? (dataUnknown as T[]) : []) as T[];

  const metaUnknown = getKey<unknown>(payload, "meta");
  const metaRaw = isObj(metaUnknown)
    ? (metaUnknown as Record<string, unknown>)
    : {};
  const meta: PaginatedMeta = {
    itemsPerPage: Number(metaRaw.itemsPerPage ?? opts.fallbackLimit),
    totalItems: Number(metaRaw.totalItems ?? data.length),
    currentPage: Number(metaRaw.currentPage ?? opts.pageParam ?? 1),
    totalPages: Number(metaRaw.totalPages ?? 1),
  };

  return { data, meta };
}
