export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "DELETE";

async function request<TResponse, TBody = unknown>(
  path: string,
  method: HttpMethod = "GET",
  body?: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Unexpected error");
  }

  return (await response.json()) as TResponse;
}

export type AuthResponse = {
  id: string;
  full_name: string;
  email: string;
};

export function signup(payload: {
  full_name: string;
  email: string;
  password: string;
}) {
  return request<AuthResponse, typeof payload>("/auth/signup", "POST", payload);
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse, typeof payload>("/auth/login", "POST", payload);
}

export type EmployeeResponse = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};

export function addEmployee(payload: {
  full_name: string;
  email: string;
  phone: string;
  temporary_password: string;
  role: string;
}) {
  return request<EmployeeResponse, typeof payload>(
    "/employees",
    "POST",
    payload,
  );
}

export type DocumentResponse = {
  id: string;
  title: string;
  category: string;
  filename: string;
  cloud_link?: string;
};

export function uploadDocument(payload: {
  title: string;
  category: string;
  filename: string;
  cloud_link?: string;
}) {
  return request<DocumentResponse, typeof payload>(
    "/documents",
    "POST",
    payload,
  );
}

export function fetchRecentDocuments() {
  return request<DocumentResponse[]>("/documents");
}

export type SubscriptionPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
};

export function fetchSubscriptionPlans() {
  return request<SubscriptionPlan[]>("/subscriptions");
}

export type Connector = {
  id: string;
  title: string;
  description: string;
  icon: string;
  optional?: boolean;
  connected: boolean;
  last_synced_at?: string | null;
};

export function fetchConnectors() {
  return request<{ connectors: Connector[] }>("/data-sources");
}

export function disconnectConnector(provider: string) {
  return request<{ ok: boolean }>(`/integrations/${provider}`, "DELETE");
}

export function sendChatMessage(payload: { content: string }) {
  return request<{ id: string; content: string; created_at: string }, typeof payload>(
    "/chat/messages",
    "POST",
    payload,
  );
}

