// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Member types
export interface Member extends User {
  membershipStatus: "active" | "inactive" | "expired";
  joinDate: Date;
  packages: Package[];
}

// Package types
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  classLimit: number; // number of classes included
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Class types
export interface YogaClass {
  id: string;
  name: string;
  description: string;
  instructor: string;
  capacity: number;
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Session types
export interface Session {
  id: string;
  classId: string;
  className: string;
  instructor: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  registeredCount: number;
  registrations: Registration[];
  status: "scheduled" | "completed" | "cancelled";
}

// Registration types
export interface Registration {
  id: string;
  sessionId: string;
  memberId: string;
  memberName: string;
  registeredAt: Date;
  status: "confirmed" | "cancelled" | "attended";
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  isPublished: boolean;
  featuredImage?: string;
}
