"use client";
import { useEffect, useState } from "react";

export default function useReportResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
) {
  const [result, setResult] = useState<{
    load: typeof load;
    data: T | null;
    error: unknown;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ load, data, error: null });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ load, data: null, error });
      });
    return () => controller.abort();
  }, [load]);
  const current = result?.load === load ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: current === null,
  };
}
