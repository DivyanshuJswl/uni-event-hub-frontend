import { useEffect, useMemo, useState } from "react";
import { fetchHackathonWinners } from "../services/sheetsService";

export function useHackathonWinners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const winners = await fetchHackathonWinners();
        if (!isMounted) return;
        setData(winners);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => ({
    total: data.length,
  }), [data]);

  return { data, loading, error, stats };
}


