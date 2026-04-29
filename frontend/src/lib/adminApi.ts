/**
 * Admin API client — all calls require an Authorization: Bearer token.
 * Token is stored in sessionStorage (intentionally — cleared when the tab
 * closes to reduce the risk of token theft on shared/public computers).
 * For persistent sessions across browser restarts, switch to localStorage.
 */

const API_BASE = "/api/admin";
const TOKEN_KEY = "admin_token";

// ── helpers ───────────────────────────────────────────────────────────────────

const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);

const req = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body && typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      // non-JSON body
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as Record<string, unknown>).message === "string"
        ? (data as Record<string, unknown>).message as string
        : `Request failed with status ${response.status}`;
    // Attach HTTP status so callers can branch on it without string-matching
    const err = new Error(message) as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return data as T;
};

const get  = <T>(path: string)                       => req<T>(path, { method: "GET" });
const post = <T>(path: string, body?: unknown)       => req<T>(path, { method: "POST",  body: body != null ? JSON.stringify(body) : undefined });
const put  = <T>(path: string, body?: unknown)       => req<T>(path, { method: "PUT",   body: body != null ? JSON.stringify(body) : undefined });
const patch= <T>(path: string, body?: unknown)       => req<T>(path, { method: "PATCH", body: body != null ? JSON.stringify(body) : undefined });
const del  = <T>(path: string)                       => req<T>(path, { method: "DELETE" });

// ── types ─────────────────────────────────────────────────────────────────────

export type ApiList<T> = { data: T[] };
export type ApiItem<T> = { data: T };

export type AdminUserPayload = { id: number; name: string; email: string; roles: string[]; permissions: string[] };

export type AdminLoginResponse = {
  token: string;
  user: AdminUserPayload;
};

export type Inquiry = {
  id: number;
  buyer_type: string;
  product: string;
  packaging: string;
  quantity: string | null;
  location: string;
  name: string;
  email: string;
  phone: string;
  language: string;
  message: string | null;
  status: "new" | "in-progress" | "resolved" | "archived";
  follow_up_note: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryStats = {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  archived: number;
};

export type AdminProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  tag: string | null;
  image_key: string | null;
  categories: string[];
  sizes: string[];
  uses: string[];
  highlights: string[];
  nutrition: Record<string, unknown>[];
  translations: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminTestimonial = {
  id: number;
  quote: string;
  name: string;
  role: string | null;
  translations: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminFaq = {
  id: number;
  question: string;
  answer: string;
  translations: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminSiteSetting = {
  id: number;
  key: string;
  trust_metrics: Record<string, unknown>[] | null;
  process_steps: Record<string, unknown>[] | null;
  delivery_zones: Record<string, unknown>[] | null;
  buyer_logos: string[] | null;
  promo_highlights: Record<string, unknown>[] | null;
  hero_slides: Record<string, unknown>[] | null;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  is_active: boolean;
  created_at: string;
};

export type AdminRole = {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  users_count: number;
};

export type AdminPermission = {
  id: number;
  name: string;
  description: string | null;
  roles_count: number;
  created_at: string;
};

// ── auth ──────────────────────────────────────────────────────────────────────

export const adminLogin = (email: string, password: string) =>
  post<AdminLoginResponse>("/login", { email, password });

export const adminRegister = (name: string, email: string, password: string, password_confirmation: string) =>
  post<AdminLoginResponse>("/register", { name, email, password, password_confirmation });

export const adminLogout = () => post<{ message: string }>("/logout");

export const adminMe = () => get<AdminUserPayload>("/me");

// ── inquiries ─────────────────────────────────────────────────────────────────

export const fetchInquiries = (params?: { status?: string; search?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";
  return get<ApiList<Inquiry>>(`/inquiries${query}`);
};

export const fetchAllInquiries = () =>
  get<ApiList<Inquiry>>("/inquiries");

export const bulkUpdateInquiries = (ids: number[], status: Inquiry["status"]) =>
  post<{ message: string }>("/inquiries/bulk-update", { ids, status });

export const bulkDeleteInquiries = (ids: number[]) =>
  post<{ message: string }>("/inquiries/bulk-delete", { ids });

export const fetchInquiry = (id: number) =>
  get<ApiItem<Inquiry>>(`/inquiries/${id}`);

export const fetchInquiryStats = () =>
  get<InquiryStats>("/inquiries/stats");

export const updateInquiry = (id: number, body: Partial<Pick<Inquiry, "status" | "follow_up_note">>) =>
  patch<ApiItem<Inquiry>>(`/inquiries/${id}`, body);

export const deleteInquiry = (id: number) =>
  del<{ message: string }>(`/inquiries/${id}`);

// ── products ──────────────────────────────────────────────────────────────────

export const fetchAdminProducts = () =>
  get<ApiList<AdminProduct>>("/products");

export const createProduct = (body: Partial<AdminProduct>) =>
  post<ApiItem<AdminProduct>>("/products", body);

export const updateProduct = (id: number, body: Partial<AdminProduct>) =>
  put<ApiItem<AdminProduct>>(`/products/${id}`, body);

export const deleteProduct = (id: number) =>
  del<{ message: string }>(`/products/${id}`);

export const reorderProducts = (order: number[]) =>
  post<{ message: string }>("/products/reorder", { order });

// ── testimonials ──────────────────────────────────────────────────────────────

export const fetchAdminTestimonials = () =>
  get<ApiList<AdminTestimonial>>("/testimonials");

export const createTestimonial = (body: Partial<AdminTestimonial>) =>
  post<ApiItem<AdminTestimonial>>("/testimonials", body);

export const updateTestimonial = (id: number, body: Partial<AdminTestimonial>) =>
  put<ApiItem<AdminTestimonial>>(`/testimonials/${id}`, body);

export const deleteTestimonial = (id: number) =>
  del<{ message: string }>(`/testimonials/${id}`);

export const reorderTestimonials = (order: number[]) =>
  post<{ message: string }>("/testimonials/reorder", { order });

// ── faqs ──────────────────────────────────────────────────────────────────────

export const fetchAdminFaqs = () =>
  get<ApiList<AdminFaq>>("/faqs");

export const createFaq = (body: Partial<AdminFaq>) =>
  post<ApiItem<AdminFaq>>("/faqs", body);

export const updateFaq = (id: number, body: Partial<AdminFaq>) =>
  put<ApiItem<AdminFaq>>(`/faqs/${id}`, body);

export const deleteFaq = (id: number) =>
  del<{ message: string }>(`/faqs/${id}`);

export const reorderFaqs = (order: number[]) =>
  post<{ message: string }>("/faqs/reorder", { order });

// ── site settings ─────────────────────────────────────────────────────────────

export const fetchSiteSettings = () =>
  get<ApiItem<AdminSiteSetting>>("/site-settings");

export const updateSiteSettings = (body: Partial<AdminSiteSetting>) =>
  put<ApiItem<AdminSiteSetting>>("/site-settings", body);

// ── users ─────────────────────────────────────────────────────────────────────

export const fetchAdminUsers = () =>
  get<ApiList<AdminUser>>("/users");

export const createAdminUser = (body: { name: string; email: string; password: string; roles?: string[] }) =>
  post<ApiItem<AdminUser>>("/users", body);

export const updateAdminUser = (id: number, body: Partial<{ name: string; email: string; password: string; roles: string[]; is_active: boolean }>) =>
  put<ApiItem<AdminUser>>(`/users/${id}`, body);

export const deleteAdminUser = (id: number) =>
  del<{ message: string }>(`/users/${id}`);

// ── roles ─────────────────────────────────────────────────────────────────────

export const fetchAdminRoles = () =>
  get<ApiList<AdminRole>>("/roles");

export const createAdminRole = (body: { name: string; description?: string; permissions?: string[] }) =>
  post<ApiItem<AdminRole>>("/roles", body);

export const updateAdminRole = (id: number, body: Partial<{ name: string; description: string; permissions: string[] }>) =>
  put<ApiItem<AdminRole>>(`/roles/${id}`, body);

export const deleteAdminRole = (id: number) =>
  del<{ message: string }>(`/roles/${id}`);

// ── permissions ───────────────────────────────────────────────────────────────

export const fetchAdminPermissions = () =>
  get<ApiList<AdminPermission>>("/permissions");

export const createAdminPermission = (body: { name: string; description?: string }) =>
  post<ApiItem<AdminPermission>>("/permissions", body);

export const updateAdminPermission = (id: number, body: Partial<{ name: string; description: string }>) =>
  put<ApiItem<AdminPermission>>(`/permissions/${id}`, body);

export const deleteAdminPermission = (id: number) =>
  del<{ message: string }>(`/permissions/${id}`);
