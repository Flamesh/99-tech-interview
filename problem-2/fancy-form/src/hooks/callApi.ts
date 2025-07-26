import React, { useState, useEffect } from "react";

export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: React.DependencyList = []
): { data: T | null; error: Error | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiCall()
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { data, error, loading };
}
