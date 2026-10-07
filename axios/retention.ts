import { ApiClientSingleton } from "@/axios/conf";
import type {
  HoldKind,
  RetentionHold,
  RetentionOverview,
  RetentionRun,
} from "@/lib/retention";

const { axiosInstance } = ApiClientSingleton.getInstance();

/** Data retention (admin/retention): periods, runs, legal holds. */
export async function getRetentionOverview(): Promise<RetentionOverview> {
  const { data } = await axiosInstance.get("admin/retention");
  return data;
}

export async function getRetentionRuns(limit = 30): Promise<RetentionRun[]> {
  const { data } = await axiosInstance.get("admin/retention/runs", {
    params: { limit },
  });
  return data;
}

/** What the job would delete now. Deletes nothing. */
export async function previewRetention(): Promise<RetentionRun> {
  const { data } = await axiosInstance.post("admin/retention/preview");
  return data;
}

export async function getRetentionHolds(): Promise<RetentionHold[]> {
  const { data } = await axiosInstance.get("admin/retention/holds");
  return data;
}

export async function placeRetentionHold(input: {
  kind: HoldKind;
  recordId: string;
  reason: string;
}): Promise<RetentionHold> {
  const { data } = await axiosInstance.post("admin/retention/holds", input);
  return data;
}

export async function releaseRetentionHold(input: {
  id: string;
  note?: string;
}): Promise<RetentionHold> {
  const { data } = await axiosInstance.post(
    `admin/retention/holds/${input.id}/release`,
    { note: input.note ?? "" },
  );
  return data;
}
