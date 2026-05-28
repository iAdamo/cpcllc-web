"use client";

import { useCallback, useRef, useEffect } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Loader2 } from "lucide-react";
import ProviderCard, { ProviderCardSkeleton } from "./ProviderCard";
import EmptyState from "./EmptyState";
import SortBar from "./SortBar";
import { ProviderData } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProviderListProps {
  providers: ProviderData[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onLoadMore: () => void;
  query?: string;
  onReset: () => void;
  onRetry: () => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  listStyle: "list" | "grid";
  onListStyleChange: (style: "list" | "grid") => void;
}

const SKELETON_COUNT = 6;

export default function ProviderList({
  providers,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  sortBy,
  onSortChange,
  onLoadMore,
  query,
  onReset,
  onRetry,
  hoveredId,
  onHover,
  listStyle,
  onListStyleChange,
}: ProviderListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const Footer = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 size={16} className="animate-spin text-blue-500" />
            Loading more providers...
          </div>
        </div>
      );
    }
    if (!hasNextPage && providers.length > 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 font-medium">
            You&apos;ve seen all {providers.length} providers
          </p>
        </div>
      );
    }
    return null;
  }, [isFetchingNextPage, hasNextPage, providers.length]);

  if (isError) {
    return (
      <div className="flex-1 min-w-0">
        <EmptyState variant="error" onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Sort bar */}
      <SortBar
        sortBy={sortBy}
        onSortChange={onSortChange}
        resultCount={providers.length}
        isLoading={isLoading}
        listStyle={listStyle}
        onListStyleChange={onListStyleChange}
        query={query}
      />

      {/* Skeleton loading */}
      {isLoading && (
        <div
          className={
            listStyle === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && providers.length === 0 && (
        <EmptyState
          variant="no-results"
          query={query}
          onReset={onReset}
        />
      )}

      {/* Provider list — grid mode */}
      {!isLoading && providers.length > 0 && listStyle === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {providers.map((p, i) => (
            <ProviderCard
              key={p._id}
              provider={p}
              index={i}
              isHovered={hoveredId === p._id}
              onHover={onHover}
            />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: 2 }).map((_, i) => (
              <ProviderCardSkeleton key={`sk-${i}`} />
            ))}
          {hasNextPage && !isFetchingNextPage && (
            <div className="col-span-full flex justify-center py-4">
              <button
                type="button"
                onClick={onLoadMore}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Load more providers
              </button>
            </div>
          )}
        </div>
      )}

      {/* Provider list — virtualized list mode */}
      {!isLoading && providers.length > 0 && listStyle === "list" && (
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: "calc(100vh - 200px)" }}
          data={providers}
          endReached={hasNextPage ? onLoadMore : undefined}
          overscan={3}
          itemContent={(index, provider) => (
            <div className={index > 0 ? "pt-3" : ""}>
              <ProviderCard
                provider={provider}
                index={index}
                isHovered={hoveredId === provider._id}
                onHover={onHover}
              />
            </div>
          )}
          components={{ Footer }}
        />
      )}
    </div>
  );
}
