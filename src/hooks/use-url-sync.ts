/* eslint-disable */

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useUrlSync({
  appliedSearchQuery,
  dateRange,
  statusFilter,
  currentPage,
  limit,
  setSearchQuery,
  setAppliedSearchQuery,
  setDateRange,
  setStatusFilter,
  handlePageChange,
  handleLimitChange,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasSynced = useRef(false);

  const updateUrl = (page?: number) => {
    const params = new URLSearchParams();
    if (appliedSearchQuery) params.set("search", appliedSearchQuery);
    if (dateRange.from) params.set("from", dateRange.from);
    if (dateRange.to) params.set("to", dateRange.to);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(page || currentPage));
    params.set("limit", String(limit));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (hasSynced.current) return;

    const search = searchParams.get("search");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    if (search) setSearchQuery(search);
    if (search) setAppliedSearchQuery(search);
    if (from || to)
      setDateRange({ from: from || undefined, to: to || undefined });
    if (status) setStatusFilter(status);
    if (limitParam) handleLimitChange(parseInt(limitParam, 10));
    if (page) handlePageChange(parseInt(page, 10));

    hasSynced.current = true;
  }, [
    searchParams,
    setSearchQuery,
    setAppliedSearchQuery,
    setDateRange,
    setStatusFilter,
    handlePageChange,
    handleLimitChange,
  ]);

  return { updateUrl };
}
