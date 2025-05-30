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
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  checkIns: CheckIn[];
}

export enum MembershipType {
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
  Student = 'Student',
  Senior = 'Senior',
  Family = 'Family',
  Corporate = 'Corporate',
  Trial = 'Trial',
  VIP = 'VIP'
}

export enum MembershipStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Expired = 'Expired',
  Frozen = 'Frozen',
  Cancelled = 'Cancelled'
}

export type MemberTag = 
  | 'New Member' 
  | 'VIP' 
  | 'Personal Training' 
  | 'Group Classes' 
  | 'Referral' 
  | 'Promotion' 
  | 'Student' 
  | 'Senior' 
  | 'Corporate' 
  | 'Family'
  | 'Special Needs';

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
  profileImage?: string;
  visitPurpose: GuestVisitPurpose;
  relatedMemberId?: string;
  waiverSigned: boolean;
  checkInDateTime: string;
  checkOutDateTime?: string;
  status: GuestStatus;
  convertedToMember: boolean;
  referralSource?: string;
  visitHistory: GuestVisit[];
  marketingConsent: boolean;
  notes?: string;
}

export type GuestStatus = 'Checked In' | 'Checked Out' | 'Scheduled';

export enum GuestVisitPurpose {
  Tour = 'Tour',
  DayPass = 'Day Pass',
  GuestPass = 'Guest Pass',
  Event = 'Event',
  FriendOfMember = 'Friend of Member',
  PotentialMember = 'Potential Member',
  Other = 'Other',
  Trial = 'Trial',
  MemberGuest = 'Member Guest'
}

export interface GuestVisit {
  id: string;
  guestId: string;
  checkInDateTime: string;
  checkOutDateTime?: string;
  purpose: GuestVisitPurpose;
  staffId?: string;
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
  paymentMethod: PaymentMethod;
  receipts: ExpenseReceipt[];
  isRecurring: boolean;
  recurrenceFrequency?: RecurrenceFrequency;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'Credit Card' | 'Cash' | 'Check' | 'Bank Transfer' | 'Other';

export type RecurrenceFrequency = 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Annually';

export interface ExpenseReceipt {
  id: string;
  expenseId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export type Receipt = ExpenseReceipt; // Alias for backward compatibility

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

export enum ClassType {
  Yoga = 'Yoga',
  HIIT = 'HIIT',
  Pilates = 'Pilates',
  Zumba = 'Zumba',
  Cycling = 'Cycling',
  Strength = 'Strength',
  CrossFit = 'CrossFit',
  Cardio = 'Cardio',
  Boxing = 'Boxing',
  Spin = 'Spin',
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
  StudioA = 'Studio A',
  StudioB = 'Studio B',
  SpinRoom = 'Spin Room',
  Pool = 'Pool',
  Outdoor = 'Outdoor',
  Other = 'Other'
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
  performance?: TrainerPerformance;
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

export interface MemberPortalConfig {
  portalEnabled: boolean;
  portalUrl: string;
  autoInviteNewMembers: boolean;
  
  logo?: string;
  favicon?: string;
  colorScheme: "light" | "dark" | "primary" | "custom";
  primaryColor?: string;
  secondaryColor?: string;
  welcomeMessage: string;
  footerText: string;
  
  features: {
    profile: {
      viewProfile: boolean;
      editContactDetails: boolean;
      editEmergencyContact: boolean;
      uploadProfilePicture: boolean;
      updateCommunicationPreferences: boolean;
      changePassword: boolean;
      viewMembershipDetails: boolean;
      viewContractDocuments: boolean;
      viewPaymentMethods: boolean;
      updatePaymentMethods: boolean;
      viewBillingHistory: boolean;
      downloadInvoices: boolean;
    };
    bookings: {
      enableClassBooking: boolean;
      bookingWindow: number; // days in advance
      cancellationWindow: number; // hours before
      showClassDescription: boolean;
      showTrainerInfo: boolean;
      showRemainingSpots: boolean;
      enableWaitlist: boolean;
      showWaitlistPosition: boolean;
      enableAppointmentBooking: boolean;
      bookableAppointmentTypes: string[];
      bookableStaffMembers: string[];
      viewSchedule: boolean;
      viewAttendanceHistory: boolean;
    };
    purchases: {
      enableMembershipPurchase: boolean;
      availableMembershipTypes: string[];
      enablePackagePurchase: boolean;
      availablePackages: string[];
      enableRetailPurchase: boolean;
      availableProductCategories: string[];
    };
    engagement: {
      viewChallenges: boolean;
      registerForChallenges: boolean;
      viewLeaderboards: boolean;
      logChallengeProgress: boolean;
      accessWorkoutLibrary: boolean;
      enableReferralProgram: boolean;
      submitReferrals: boolean;
    };
  };
  
  announcements: Array<MemberPortalAnnouncement>;
  resources: Array<MemberPortalResource>;
  faqCategories: Array<MemberPortalFaqCategory>;
  emailTemplates: Array<MemberPortalEmailTemplate>;
  feedbackForms: Array<MemberPortalFeedbackForm>;
}

export interface MemberPortalAnnouncement {
  id: string;
  title: string;
  content: string;
  isSticky: boolean;
  isImportant: boolean;
  publishDate: string;
  expiryDate?: string;
  isPublished: boolean;
}

export interface MemberPortalResource {
  id: string;
  name: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  isVisible: boolean;
  uploadDate: string;
}

export interface MemberPortalFaqCategory {
  id: string;
  name: string;
  order: number;
  questions: MemberPortalFaqQuestion[];
}

export interface MemberPortalFaqQuestion {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface MemberPortalEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isEnabled: boolean;
}

export interface MemberPortalFeedbackForm {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  recipientEmails: string[];
  fields: MemberPortalFeedbackField[];
}

export interface MemberPortalFeedbackField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface MemberPortalUser {
  id: string;
  memberId: string;
  memberName: string;
  status: 'Invited' | 'Active' | 'Disabled' | 'Never Logged In';
  lastLoginDate?: string;
  inviteSentDate?: string;
}
