export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  dateOfBirth: string;
  membershipType: string;
  membershipStatus: string;
  membershipStartDate: string;
  membershipEndDate: string;
  tags: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  checkIns: CheckIn[];
}

export interface CheckIn {
  id: string;
  memberId: string;
  dateTime: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visitPurpose: string;
  relatedMemberId?: string;
  waiverSigned: boolean;
  checkInDateTime: string;
  checkOutDateTime?: string;
  status: 'Checked In' | 'Checked Out';
  convertedToMember: boolean;
  referralSource?: string;
  visitHistory: GuestVisit[];
  marketingConsent: boolean;
  notes?: string;
}

export interface GuestVisit {
  id: string;
  guestId: string;
  checkInDateTime: string;
  checkOutDateTime?: string;
  purpose: string;
  notes?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  budget?: {
    amount: number;
    period: 'monthly' | 'quarterly' | 'yearly';
  };
}

export interface Expense {
  id: string;
  date: string;
  categoryId: string;
  amount: number;
  payee: string;
  description: string;
  paymentMethod: string;
  receipts: ExpenseReceipt[];
  isRecurring: boolean;
  recurrenceFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReceipt {
  id: string;
  expenseId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface ExpenseBudget {
  id: string;
  categoryId: string;
  amount: number;
  periodType: 'monthly' | 'quarterly' | 'yearly';
  periodStartDate: string;
}

export interface Note {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  relatedTo: {
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

// Add these specific enums for ClassType and Room
export enum ClassType {
  Yoga = 'Yoga',
  HIIT = 'HIIT',
  Pilates = 'Pilates',
  Zumba = 'Zumba',
  Cycling = 'Cycling',
  Strength = 'Strength',
  CrossFit = 'CrossFit',
  Cardio = 'Cardio',
  Other = 'Other'
}

export enum Room {
  YogaStudio = 'Yoga Studio',
  MainFloor = 'Main Floor',
  CyclingRoom = 'Cycling Room',
  GroupFitness = 'Group Fitness',
  PoolArea = 'Pool Area',
  PersonalTraining = 'Personal Training',
  OutdoorSpace = 'Outdoor Space',
  Other = 'Other'
}

// Update GymClass to use these enums
export interface GymClass {
  id: string;
  name: string;
  type: ClassType;  // Use the enum
  description: string;
  trainerId: string;
  room: Room;       // Use the enum
  startTime: string;
  endTime: string;
  date: string;
  capacity: number;
  attendees: string[];
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  certifications: string[];
  bio: string;
  profileImage?: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  assignedClasses: string[];
  assignedMembers: string[];
}
