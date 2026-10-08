"use client";

import { useMutation } from "@tanstack/react-query";
import {
  fileAppeal,
  fileCopyrightNotice,
  fileCounterNotice,
  filePrivacyRequest,
} from "@/axios/legalRequests";

/** Filing on /privacy-request and /dmca. Anyone can file; nothing is
 *  cached (each filing is a one-off write). */
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
