const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
  lang?: string;
}

// Get token from localStorage (client-side only)
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // Token is stored by zustand persist under "zaklad-auth"
    const authData = localStorage.getItem("zaklad-auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed?.state?.token || null;
    }
  } catch (e) {
    console.error("Failed to get token:", e);
  }
  return null;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, lang = "uk", ...fetchOptions } = options;

  // Use provided token or get from localStorage
  const authToken = token || getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-lang": lang,
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const url = endpoint.includes("?") 
    ? `${API_URL}${endpoint}&lang=${lang}` 
    : `${API_URL}${endpoint}?lang=${lang}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Error" }));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),

  put: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "DELETE" }),
};

export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    registerBusiness: "/auth/register/business",
    me: "/auth/me",
  },
  establishments: {
    list: "/establishments",
    detail: (id: string) => `/establishments/${id}`,
    compare: "/establishments/compare",
    approve: (id: string) => `/establishments/${id}/approve`,
    reject: (id: string) => `/establishments/${id}/reject`,
  },
  posSystems: {
    list: "/pos-systems",
    detail: (id: string) => `/pos-systems/${id}`,
    compare: "/pos-systems/compare",
    toggleFeatured: (id: string) => `/pos-systems/${id}/featured`,
  },
  categories: {
    list: "/categories",
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  reviews: {
    list: "/reviews",
    pending: "/reviews/pending",
    byEstablishment: (id: string) => `/reviews/establishment/${id}`,
    byPosSystem: (id: string) => `/reviews/pos-system/${id}`,
    moderate: (id: string) => `/reviews/${id}/moderate`,
  },
  ratings: {
    stats: (type: string, id: string) => `/ratings/stats/${type}/${id}`,
  },
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    verifyBusiness: (id: string) => `/users/${id}/verify-business`,
    delete: (id: string) => `/users/${id}`,
  },
  aiLogs: {
    list: "/ai-logs",
    stats: "/ai-logs/stats",
    categories: "/ai-logs/categories",
    updateHelpful: (id: string) => `/ai-logs/${id}/helpful`,
  },
  analytics: {
    overview: "/analytics/overview",
    events: "/analytics/events",
  },
  siteContent: {
    getAll: "/site-content",
    get: (key: string) => `/site-content/${key}`,
    upsert: (key: string) => `/site-content/${key}`,
    delete: (key: string) => `/site-content/${key}`,
  },
  seo: {
    settings: "/seo/settings",
    pages: "/seo/pages",
    getPageSeo: (path: string) => `/seo/pages/${encodeURIComponent(path)}`,
    upsertPageSeo: (path: string) => `/seo/pages/${encodeURIComponent(path)}`,
  },
  blog: {
    list: "/blog",
    detail: (slug: string) => `/blog/${slug}`,
    byId: (id: string) => `/blog/id/${id}`,
    create: "/blog",
    update: (id: string) => `/blog/${id}`,
    delete: (id: string) => `/blog/${id}`,
    categories: "/blog/categories",
  },
  technicians: {
    list: "/technicians",
    detail: (id: string) => `/technicians/${id}`,
    create: "/technicians",
    update: (id: string) => `/technicians/${id}`,
    delete: (id: string) => `/technicians/${id}`,
    specializations: "/technicians/specializations",
    cities: "/technicians/cities",
  },
};

