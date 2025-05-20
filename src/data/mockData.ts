import { CheckIn, Guest, Member, ExpenseCategory, Expense, ExpenseBudget, GuestVisit, Note, DashboardStats, ClassType, Room, GymClass, Trainer, MembershipType, MembershipStatus, GuestVisitPurpose, GuestStatus } from '@/lib/types';

// Mock data for members
export const members: Member[] = [
  {
    id: 'mem-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    profileImage: undefined,
    dateOfBirth: '1990-05-15',
    membershipType: MembershipType.Standard,
    membershipStatus: MembershipStatus.Active,
    membershipStartDate: '2023-01-01',
    membershipEndDate: '2024-01-01',
    tags: [],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '098-765-4321',
      relationship: 'Spouse'
    },
    notes: 'Regular attendee',
    checkIns: []
  },
  {
    id: 'mem-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    profileImage: undefined,
    dateOfBirth: '1985-10-20',
    membershipType: MembershipType.Standard,
    membershipStatus: MembershipStatus.Inactive,
    membershipStartDate: '2022-12-15',
    membershipEndDate: '2023-12-15',
    tags: [],
    emergencyContact: {
      name: 'Mike Smith',
      phone: '111-222-3333',
      relationship: 'Husband'
    },
    notes: 'Interested in yoga classes',
    checkIns: []
  },
  {
    id: 'mem-3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-123-4567',
    profileImage: undefined,
    dateOfBirth: '1992-07-08',
    membershipType: MembershipType.Premium,
    membershipStatus: MembershipStatus.Active,
    membershipStartDate: '2023-03-01',
    membershipEndDate: '2024-03-01',
    tags: [],
    emergencyContact: {
      name: 'Bob Johnson',
      phone: '444-555-6666',
      relationship: 'Brother'
    },
    notes: 'Prefers morning workouts',
    checkIns: []
  },
  {
    id: 'mem-4',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.williams@example.com',
    phone: '777-888-9999',
    profileImage: undefined,
    dateOfBirth: '1988-12-25',
    membershipType: MembershipType.Standard,
    membershipStatus: MembershipStatus.Active,
    membershipStartDate: '2023-04-10',
    membershipEndDate: '2024-04-10',
    tags: [],
    emergencyContact: {
      name: 'Carol Williams',
      phone: '777-111-2222',
      relationship: 'Wife'
    },
    notes: 'Interested in weightlifting',
    checkIns: []
  },
];

// Mock data for recent check-ins
export const recentCheckIns: CheckIn[] = [
  {
    id: 'checkin-1',
    memberId: 'mem-1',
    dateTime: new Date().toISOString()
  },
  {
    id: 'checkin-2',
    memberId: 'mem-2',
    dateTime: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'checkin-3',
    memberId: 'mem-3',
    dateTime: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  }
];

// Mock data for guests
export const guests: Guest[] = [
  {
    id: 'guest-1',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    phone: '333-444-5555',
    visitPurpose: GuestVisitPurpose.Trial,
    relatedMemberId: 'mem-1',
    waiverSigned: true,
    checkInDateTime: new Date().toISOString(),
    checkOutDateTime: undefined,
    status: 'Checked In',
    convertedToMember: false,
    referralSource: undefined,
    visitHistory: [],
    marketingConsent: false,
    notes: undefined
  },
  {
    id: 'guest-2',
    firstName: 'Lucy',
    lastName: 'Van Pelt',
    email: 'lucy.vanpelt@example.com',
    phone: '444-555-6666',
    visitPurpose: GuestVisitPurpose.Tour,
    relatedMemberId: 'mem-2',
    waiverSigned: true,
    checkInDateTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    checkOutDateTime: undefined,
    status: 'Checked In',
    convertedToMember: false,
    referralSource: undefined,
    visitHistory: [],
    marketingConsent: false,
    notes: undefined
  }
];

// Expense Categories
export const expenseCategories: ExpenseCategory[] = [
  { id: 'cat-1', name: 'Rent/Mortgage', color: '#4f46e5' },
  { id: 'cat-2', name: 'Utilities', color: '#06b6d4' },
  { id: 'cat-3', name: 'Equipment', color: '#10b981' },
  { id: 'cat-4', name: 'Staff Salaries', color: '#f97316' },
  { id: 'cat-5', name: 'Marketing', color: '#8b5cf6' },
  { id: 'cat-6', name: 'Insurance', color: '#ec4899' },
  { id: 'cat-7', name: 'Office Supplies', color: '#6366f1' },
  { id: 'cat-8', name: 'Miscellaneous', color: '#64748b' },
];

// Mock Expenses
export const expenses: Expense[] = [
  {
    id: 'exp-1',
    date: new Date(2025, 4, 1).toISOString(),
    categoryId: 'cat-1',
    amount: 2500,
    payee: 'Lakeside Properties',
    description: 'Monthly rent for gym premises',
    paymentMethod: 'Bank Transfer',
    receipts: [],
    isRecurring: true,
    recurrenceFrequency: 'Monthly',
    recurrenceStartDate: new Date(2025, 0, 1).toISOString(),
    createdAt: new Date(2025, 0, 1).toISOString(),
    updatedAt: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: 'exp-2',
    date: new Date(2025, 4, 5).toISOString(),
    categoryId: 'cat-2',
    amount: 350,
    payee: 'City Power & Light',
    description: 'Electricity bill for May',
    paymentMethod: 'Credit Card',
    receipts: [{
      id: 'rec-1',
      expenseId: 'exp-2',
      fileName: 'may_electricity.pdf',
      fileUrl: '/placeholder.svg',
      fileType: 'application/pdf',
      uploadedAt: new Date(2025, 4, 5).toISOString(),
    }],
    isRecurring: true,
    recurrenceFrequency: 'Monthly',
    recurrenceStartDate: new Date(2025, 0, 5).toISOString(),
    createdAt: new Date(2025, 4, 5).toISOString(),
    updatedAt: new Date(2025, 4, 5).toISOString(),
  },
  {
    id: 'exp-3',
    date: new Date(2025, 4, 10).toISOString(),
    categoryId: 'cat-3',
    amount: 1200,
    payee: 'Fitness Equipment Co.',
    description: 'New treadmill maintenance parts',
    paymentMethod: 'Credit Card',
    receipts: [],
    isRecurring: false,
    createdAt: new Date(2025, 4, 10).toISOString(),
    updatedAt: new Date(2025, 4, 10).toISOString(),
  },
  {
    id: 'exp-4',
    date: new Date(2025, 4, 15).toISOString(),
    categoryId: 'cat-4',
    amount: 4500,
    payee: 'Staff Payroll',
    description: 'Staff salaries for May',
    paymentMethod: 'Bank Transfer',
    receipts: [],
    isRecurring: true,
    recurrenceFrequency: 'Monthly',
    recurrenceStartDate: new Date(2025, 0, 15).toISOString(),
    createdAt: new Date(2025, 4, 15).toISOString(),
    updatedAt: new Date(2025, 4, 15).toISOString(),
  },
  {
    id: 'exp-5',
    date: new Date(2025, 4, 18).toISOString(),
    categoryId: 'cat-5',
    amount: 500,
    payee: 'Social Media Ads',
    description: 'Facebook ad campaign for summer promotion',
    paymentMethod: 'Credit Card',
    receipts: [{
      id: 'rec-2',
      expenseId: 'exp-5',
      fileName: 'fb_ads_receipt.pdf',
      fileUrl: '/placeholder.svg',
      fileType: 'application/pdf',
      uploadedAt: new Date(2025, 4, 18).toISOString(),
    }],
    isRecurring: false,
    createdAt: new Date(2025, 4, 18).toISOString(),
    updatedAt: new Date(2025, 4, 18).toISOString(),
  },
  {
    id: 'exp-6',
    date: new Date(2025, 4, 20).toISOString(),
    categoryId: 'cat-7',
    amount: 120,
    payee: 'Office Supply Store',
    description: 'Printer ink and paper',
    paymentMethod: 'Cash',
    receipts: [{
      id: 'rec-3',
      expenseId: 'exp-6',
      fileName: 'office_supplies.jpg',
      fileUrl: '/placeholder.svg',
      fileType: 'image/jpeg',
      uploadedAt: new Date(2025, 4, 20).toISOString(),
    }],
    isRecurring: false,
    createdAt: new Date(2025, 4, 20).toISOString(),
    updatedAt: new Date(2025, 4, 20).toISOString(),
  },
];

// Expense Budgets
export const expenseBudgets: ExpenseBudget[] = [
  {
    id: 'budget-1',
    categoryId: 'cat-1',
    amount: 2500,
    periodType: 'monthly',
    periodStartDate: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: 'budget-2',
    categoryId: 'cat-2',
    amount: 400,
    periodType: 'monthly',
    periodStartDate: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: 'budget-3',
    categoryId: 'cat-3',
    amount: 2000,
    periodType: 'quarterly',
    periodStartDate: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: 'budget-4',
    categoryId: 'cat-4',
    amount: 5000,
    periodType: 'monthly',
    periodStartDate: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: 'budget-5',
    categoryId: 'cat-5',
    amount: 1000,
    periodType: 'monthly',
    periodStartDate: new Date(2025, 0, 1).toISOString(),
  },
];

// Add missing exports needed by other pages
export const gymClasses: GymClass[] = [
  {
    id: 'class-1',
    name: 'Morning Yoga',
    type: ClassType.Yoga,
    description: 'Start your day with rejuvenating yoga',
    trainerId: 'trainer-1',
    room: Room.YogaStudio,
    startTime: '07:00',
    endTime: '08:00',
    date: new Date().toISOString(),
    capacity: 15,
    attendees: ['mem-1', 'mem-3']
  },
  {
    id: 'class-2',
    name: 'HIIT Workout',
    type: ClassType.HIIT,
    description: 'High intensity interval training',
    trainerId: 'trainer-2',
    room: Room.MainFloor,
    startTime: '18:00',
    endTime: '19:00',
    date: new Date().toISOString(),
    capacity: 20,
    attendees: ['mem-2', 'mem-4']
  }
];

export const trainers: Trainer[] = [
  {
    id: 'trainer-1',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    phone: '555-123-7890',
    specialties: ['Yoga', 'Pilates'],
    certifications: ['Certified Yoga Instructor'],
    bio: 'Experienced yoga instructor with 5+ years of teaching',
    profileImage: undefined,
    availability: [
      {
        day: 'Monday',
        startTime: '07:00',
        endTime: '15:00'
      },
      {
        day: 'Wednesday',
        startTime: '07:00',
        endTime: '15:00'
      },
      {
        day: 'Friday',
        startTime: '07:00',
        endTime: '15:00'
      }
    ],
    assignedClasses: ['class-1'],
    assignedMembers: ['mem-1', 'mem-3']
  },
  {
    id: 'trainer-2',
    firstName: 'Sarah',
    lastName: 'Thompson',
    email: 'sarah@example.com',
    phone: '555-987-6543',
    specialties: ['HIIT', 'Strength Training'],
    certifications: ['NASM Certified Personal Trainer'],
    bio: 'Fitness expert specializing in high intensity workouts',
    profileImage: undefined,
    availability: [
      {
        day: 'Tuesday',
        startTime: '12:00',
        endTime: '20:00'
      },
      {
        day: 'Thursday',
        startTime: '12:00',
        endTime: '20:00'
      },
      {
        day: 'Saturday',
        startTime: '09:00',
        endTime: '15:00'
      }
    ],
    assignedClasses: ['class-2'],
    assignedMembers: ['mem-2', 'mem-4']
  }
];

export const notes: Note[] = [
  {
    id: 'note-1',
    category: 'Member Notes',
    title: 'New workout plan for John',
    content: 'Created custom strength training program for John Doe',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'trainer-1',
    relatedTo: {
      type: 'Member',
      id: 'mem-1'
    }
  },
  {
    id: 'note-2',
    category: 'Training Logs',
    title: 'HIIT Class Adjustments',
    content: 'Modified exercises for beginners in today\'s class',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: 'trainer-2',
    relatedTo: {
      type: 'Class',
      id: 'class-2'
    }
  }
];

export const dashboardStats: DashboardStats = {
  todayCheckIns: 15,
  activeMembers: 87,
  expiringMemberships: 4,
  upcomingClasses: 8,
  newMembers: 6
};

// Add mock data functions for the Reports page
export const generateMembershipDistributionData = () => {
  return [
    { name: 'Standard', value: 45 },
    { name: 'Premium', value: 30 },
    { name: 'VIP', value: 10 },
    { name: 'Student', value: 25 },
    { name: 'Senior', value: 15 }
  ];
};

export const generateMonthlyCheckInData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    checkIns: Math.floor(Math.random() * 500) + 300
  }));
};

export const generateWeeklyClassAttendanceData = () => {
  return [
    { name: 'Yoga', attendance: 85 },
    { name: 'HIIT', attendance: 75 },
    { name: 'Spin', attendance: 90 },
    { name: 'Zumba', attendance: 65 },
    { name: 'CrossFit', attendance: 80 }
  ];
};
