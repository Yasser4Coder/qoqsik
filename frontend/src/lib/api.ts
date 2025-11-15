export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "DELETE";

async function request<TResponse, TBody = unknown>(
  path: string,
  method: HttpMethod = "GET",
  body?: TBody,
): Promise<TResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = "An unexpected error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    // Handle network errors (Failed to fetch)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Cannot connect to server at ${API_BASE_URL}. Please ensure the backend server is running.`
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection.");
  }
}

export type AuthResponse = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
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

// Store user data in localStorage
export function setAuthUser(user: AuthResponse): void {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

// Get user data from localStorage
export function getAuthUser(): AuthResponse | null {
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthResponse;
  } catch {
    return null;
  }
}

// Clear user data from localStorage
export function clearAuthUser(): void {
  localStorage.removeItem("auth_user");
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}

// Logout user
export async function logout(): Promise<void> {
  try {
    await request<{ message: string }>("/auth/logout", "POST");
  } catch (error) {
    // Even if the API call fails, clear local storage
    console.error("Logout error:", error);
  } finally {
    clearAuthUser();
  }
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

export type ChatMessageResponse = {
  id: string;
  content: string;
  role: "user" | "assistant";
  user_id?: string | null;
  conversation_id?: string | null;
  created_at: string;
};

export function sendChatMessage(payload: {
  content: string;
  user_id?: string;
  conversation_id?: string;
}) {
  // Include user_id from localStorage if available
  const user = getAuthUser();
  const messagePayload = {
    ...payload,
    user_id: payload.user_id || user?.id || undefined,
  };
  
  return request<ChatMessageResponse, typeof messagePayload>(
    "/chat/messages",
    "POST",
    messagePayload,
  );
}

