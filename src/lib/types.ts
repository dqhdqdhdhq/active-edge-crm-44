
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
