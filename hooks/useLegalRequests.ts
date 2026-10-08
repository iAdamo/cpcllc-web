"use client";

import { useMutation } from "@tanstack/react-query";
import {
  fileAppeal,
  fileCopyrightNotice,
  fileCounterNotice,
  fileDisputeNotice,
  fileLegalNotice,
  fileOptOut,
  filePrivacyRequest,
} from "@/axios/legalRequests";

/** Filing on /privacy-request, /dmca and /legal-notice. Anyone can file;
 *  nothing is cached (each filing is a one-off write). */
export function useFilePrivacyRequest() {
  return useMutation({ mutationFn: filePrivacyRequest });
}

export function useFileAppeal() {
  return useMutation({ mutationFn: fileAppeal });
}

export function useFileCopyrightNotice() {
  return useMutation({ mutationFn: fileCopyrightNotice });
}

export function useFileCounterNotice() {
  return useMutation({ mutationFn: fileCounterNotice });
}

export function useFileDisputeNotice() {
  return useMutation({ mutationFn: fileDisputeNotice });
}

export function useFileOptOut() {
  return useMutation({ mutationFn: fileOptOut });
}

export function useFileLegalNotice() {
  return useMutation({ mutationFn: fileLegalNotice });
}
