// Firebase API Types for Yoga Dashboard

export type UserRole = "admin" | "member";

export interface Member {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  healthNotes?: string;
  joinDate: string;
  membershipStatus: "active" | "inactive" | "suspended";
  currentPackage?: string;
  remainingClasses?: number;
  role: "member";
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // days
  classLimit: number; // -1 for unlimited
  isActive: boolean;
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface YogaClass {
  id: string;
  name: string;
  description: string;
  instructor: string;
  instructorId?: string;
  duration: number; // minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  maxCapacity: number;
  price?: number; // if drop-in class
  isActive: boolean;
  category?: string;
  requirements?: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  classId: string;
  className: string;
  instructor: string;
  instructorId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  capacity: number;
  registeredCount: number;
  status: "scheduled" | "completed" | "cancelled";
  registrations: SessionRegistration[];
  difficulty: "beginner" | "intermediate" | "advanced";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRegistration {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: "confirmed" | "cancelled" | "attended" | "no-show";
  registeredAt: string;
  attendedAt?: string;
  cancelledAt?: string;
  notes?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeClasses: number;
  todaySessions: number;
  monthlyRevenue: number;
  memberGrowth: number;
  classGrowth: number;
  sessionGrowth: number;
  revenueGrowth: number;
  lastUpdated: string;
}

export interface RecentActivity {
  id: string;
  type:
    | "registration"
    | "cancellation"
    | "attendance"
    | "package_purchase"
    | "member_join";
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  error: string | null;
  success: boolean;
}

// API Request types
export interface MemberCreateRequest {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  healthNotes?: string;
  password: string;
  packageId?: string;
}

export interface MemberUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  healthNotes?: string;
  membershipStatus?: "active" | "inactive" | "suspended";
  currentPackage?: string;
  remainingClasses?: number;
}

export interface PackageCreateRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  classLimit: number;
  benefits?: string[];
}

export interface PackageUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  classLimit?: number;
  isActive?: boolean;
  benefits?: string[];
}

export interface ClassCreateRequest {
  name: string;
  description: string;
  instructor: string;
  instructorId?: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  maxCapacity: number;
  price?: number;
  category?: string;
  requirements?: string[];
  benefits?: string[];
}

export interface ClassUpdateRequest {
  name?: string;
  description?: string;
  instructor?: string;
  instructorId?: string;
  duration?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  maxCapacity?: number;
  price?: number;
  isActive?: boolean;
  category?: string;
  requirements?: string[];
  benefits?: string[];
}

export interface SessionCreateRequest {
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity?: number; // if different from class capacity
  notes?: string;
}

export interface SessionUpdateRequest {
  date?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  status?: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface SessionRegistrationRequest {
  sessionId: string;
  memberId: string;
  notes?: string;
}

// Query filters
export interface MemberFilters {
  search?: string;
  status?: "active" | "inactive" | "suspended";
  package?: string;
  joinDateFrom?: string;
  joinDateTo?: string;
}

export interface PackageFilters {
  search?: string;
  active?: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface ClassFilters {
  search?: string;
  instructor?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  active?: boolean;
  category?: string;
}

export interface SessionFilters {
  search?: string;
  classId?: string;
  instructor?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: "scheduled" | "completed" | "cancelled";
}
