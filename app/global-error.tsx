"use client";

import { useEffect } from "react";
import { AppErrorService } from "@/lib/errorService";
import { ErrorStateCard } from "@/components/error/ErrorStateCard";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    AppErrorService.log(error, {
      code: "UNEXPECTED_ERROR",
      category: "unexpected_system_error",
      severity: "critical",
      message: "The web app encountered an unexpected error.",
      technicalMessage: error.message,
      userMessage: "Something unexpected happened. We recorded the issue.",
      source: "web",
      module: "app-shell",
      service: "global-error",
      route: "/global-error",
      feature: "global-error-boundary",
      context: { digest: error.digest },
    });
  }, [error]);

  return (
    <ErrorStateCard
      title="We hit a problem loading this experience."
      message="We recorded the issue and can help if it continues. Please try again or go back home."
      onRetry={reset}
    />
  );
}
