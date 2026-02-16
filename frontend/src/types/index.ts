export interface User {
  id: string;
  email: string;
  role: "GUEST" | "USER" | "BUSINESS" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  profile?: UserProfile;
  businessProfile?: BusinessProfile;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  city?: string;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  companyNameRu?: string;
  description?: string;
  logoUrl?: string;
  isVerified: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  children?: Category[];
}

export interface City {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
}

export interface Establishment {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
  description?: string;
  businessType: string;
  address?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  coverUrl?: string;
  priceRange: number;
  averageRating: number;
  reviewCount: number;
  features?: string[];
  workingHours?: Record<string, { open: string; close: string }>;
  category?: Category;
  city?: City;
  images?: { url: string; alt?: string }[];
}

export interface PosSystem {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
  description?: string;
  shortDescription?: string;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  priceFrom?: number;
  priceTo?: number;
  pricingModel?: string;
  features?: string[];
  integrations?: string[];
  averageRating: number;
  reviewCount: number;
  category?: Category;
  images?: { url: string; alt?: string }[];
}

export interface Review {
  id: string;
  content: string;
  pros?: string;
  cons?: string;
  createdAt: string;
  user: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
  responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    role: string;
    businessProfile?: {
      companyName: string;
      logoUrl?: string;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Service type alias for PosSystem (used for delivery, qr-menu, etc.)
export type Service = PosSystem;

