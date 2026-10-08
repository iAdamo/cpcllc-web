import { ApiClientSingleton } from "@/axios/conf";
import type {
  AppealForm,
  CopyrightPayload,
  CounterPayload,
  Filed,
  LegalRequestDetail,
  LegalRequestList,
  PrivacyPayload,
} from "@/lib/legalRequests";

const { axiosInstance } = ApiClientSingleton.getInstance();

// ── Filing (public, no sign-in) ───────────────────────────────────────────

export async function filePrivacyRequest(body: PrivacyPayload): Promise<Filed> {
  const { data } = await axiosInstance.post("legal-requests/privacy", body);
  return data;
}

export async function fileAppeal(body: AppealForm): Promise<Filed> {
  const { data } = await axiosInstance.post("legal-requests/appeal", body);
  return data;
}

export async function fileCopyrightNotice(body: CopyrightPayload): Promise<Filed> {
  const { data } = await axiosInstance.post("legal-requests/copyright", body);
  return data;
}

export async function fileCounterNotice(body: CounterPayload): Promise<Filed> {
  const { data } = await axiosInstance.post("legal-requests/counter-notice", body);
  return data;
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface LegalRequestFilters {
  kind?: string;
  status?: string;
  q?: string;
  page?: number;
}

export async function getLegalRequests(f: LegalRequestFilters): Promise<LegalRequestList> {
  const params: Record<string, string> = {};
  if (f.kind) params.kind = f.kind;
  if (f.status) params.status = f.status;
  if (f.q?.trim()) params.q = f.q.trim();
  if (f.page && f.page > 1) params.page = String(f.page);
  const { data } = await axiosInstance.get("admin/legal-requests", { params });
  return data;
}

export async function getLegalRequest(id: string): Promise<LegalRequestDetail> {
  const { data } = await axiosInstance.get(`admin/legal-requests/${id}`);
  return data;
}

export async function moveLegalRequest(input: {
  id: string;
  status: "received" | "verifying" | "in_progress";
}): Promise<LegalRequestDetail> {
  const { data } = await axiosInstance.post(`admin/legal-requests/${input.id}/status`, {
    status: input.status,
  });
  return data;
}

export async function noteLegalRequest(input: { id: string; text: string }): Promise<LegalRequestDetail> {
  const { data } = await axiosInstance.post(`admin/legal-requests/${input.id}/notes`, {
    text: input.text,
  });
  return data;
}

export async function decideLegalRequest(input: {
  id: string;
  outcome: "completed" | "denied" | "withdrawn";
  message?: string;
  accountId?: string;
}): Promise<LegalRequestDetail> {
  const { id, ...body } = input;
  const { data } = await axiosInstance.post(`admin/legal-requests/${id}/decision`, body);
  return data;
}
