export type MembershipType = 'Standard' | 'Premium' | 'VIP' | 'Student' | 'Senior' | 'Family' | 'Corporate';
export type MembershipStatus = 'Active' | 'Inactive' | 'Expired' | 'Frozen' | 'Pending';
export type MemberTag = 'VIP' | 'Personal Training' | 'New Member' | 'Special Needs' | 'Prospect' | 'Corporate';
export type ClassType = 'Yoga' | 'Spin' | 'HIIT' | 'Pilates' | 'Zumba' | 'Boxing' | 'CrossFit' | 'Strength' | 'Cardio';
export type Room = 'Studio A' | 'Studio B' | 'Main Floor' | 'Spin Room' | 'Yoga Studio' | 'Pool' | 'Outdoor';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  dateOfBirth: string;
  membershipType: MembershipType;
  membershipStatus: MembershipStatus;
  membershipStartDate: string;
  membershipEndDate: string;
  tags: MemberTag[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  checkIns: CheckIn[];
}

export type GuestVisitPurpose = 'Trial' | 'Day Pass' | 'Tour' | 'Event' | 'Member Guest';
export type GuestStatus = 'Checked In' | 'Checked Out' | 'Scheduled';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  visitPurpose: GuestVisitPurpose;
  relatedMemberId?: string;
  waiverSigned: boolean;
  checkInDateTime: string;
  checkOutDateTime?: string;
  status: GuestStatus;
  notes?: string;
  convertedToMember: boolean;
  referralSource?: string;
  visitHistory: GuestVisit[];
  marketingConsent: boolean;
}

export interface GuestVisit {
  id: string;
  guestId: string;
  checkInDateTime: string;
  checkOutDateTime?: string;
  visitPurpose: GuestVisitPurpose;
  notes?: string;
  staffId?: string;
}

export interface TrainerPerformance {
  classesCount: number;
  attendanceRate: number;
  clientRetentionRate: number;
  ptSessionsCount: number;
  memberFeedback: number;
  revenueGenerated: number;
  rankLastMonth?: number;
  rankChange?: number;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  specialties: string[];
  certifications: string[];
  bio: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  assignedClasses: string[];
  assignedMembers: string[];
  performance?: TrainerPerformance;
}

export interface GymClass {
  id: string;
  name: string;
  type: ClassType;
  description: string;
  trainerId: string;
  room: Room;
  startTime: string;
  endTime: string;
  date: string;
  capacity: number;
  attendees: string[];
}

export interface CheckIn {
  id: string;
  memberId: string;
  dateTime: string;
}

export interface Note {
  id: string;
  category: 'Member Notes' | 'Training Logs' | 'Incidents' | 'Maintenance' | 'Communication';
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  relatedTo?: {
    type: 'Member' | 'Class' | 'Trainer';
    id: string;
  };
}

export interface DashboardStats {
  todayCheckIns: number;
  activeMembers: number;
  expiringMemberships: number;
  upcomingClasses: number;
  newMembers: number;
}

// Expense-related types
export type PaymentMethod = 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check' | 'Other';
export type RecurrenceFrequency = 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
export type BudgetPeriod = 'monthly' | 'quarterly' | 'annually';

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  parentCategoryId?: string;
  budget?: {
    amount: number;
    period: BudgetPeriod;
  };
}

export interface Receipt {
  id: string;
  expenseId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface Expense {
  id: string;
  date: string; // ISO date string
  categoryId: string;
  amount: number;
  payee: string;
  description: string;
  paymentMethod: PaymentMethod;
  receipts: Receipt[];
  isRecurring: boolean;
  recurrenceFrequency?: RecurrenceFrequency;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseBudget {
  id: string;
  categoryId: string;
  amount: number;
  periodType: BudgetPeriod;
  periodStartDate: string;
}
