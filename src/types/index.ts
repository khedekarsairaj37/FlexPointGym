// Type definitions for Flex Point Gym

export type UserRole = 'admin' | 'member' | 'user';

export type MemberStatus = 'active' | 'new' | 'inactive';

export type PackageType = 'Basic' | 'Pro' | 'Elite' | 'Free' | 'Pending';

export type BillingStatus = 'paid' | 'pending' | 'overdue';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Member {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  package: PackageType;
  status: MemberStatus;
  joinDate: Date;
  expiryDate?: Date;
  createdAt: Date;
}

export interface Billing {
  id: string;
  memberId: string;
  memberName?: string;
  amount: number;
  currency: 'INR';
  status: BillingStatus;
  date: Date;
  description?: string;
  packageType?: PackageType;
}

export interface Supplement {
  id: string;
  name: string;
  price: number;
  currency: 'INR';
  stock: number;
  description?: string;
  category?: string;
}

export interface DietPlan {
  id: string;
  memberId: string;
  memberName?: string;
  plan: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
}
