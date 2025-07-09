import { useState, useEffect, useCallback } from "react";
import { searchCompanies } from "@/axios/users";
import { debounce } from "lodash";
import { CompanyData } from "@/types";

export function useCompanySearch({
  searchInput,
  lat,
  long,
  address,
}: {
  searchInput?: string;
  lat?: string;
  long?: string;
  address?: string;
}) {
  const [results, setResults] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useCallback(
    debounce(async () => {
      if (!searchInput && !address && !lat && !long) return;

      setLoading(true);
      setError("");

      try {
        const response = await searchCompanies(searchInput, lat, long, address);
        setResults(response);
      } catch (err: any) {
        setError(err.response?.data?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, 500),
    [searchInput, lat, long, address] // Dependencies for debounced function
  );

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return { results, loading, error };
}
