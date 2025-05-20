import { Member, GymClass, Trainer, CheckIn, Note, DashboardStats, Guest, GuestVisit } from '../lib/types';

// Helper function to get a date in ISO format
const getDateISO = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Helper function to get a specific time today
const getTimeToday = (hours: number, minutes: number): string => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Members mock data
export const members: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    dateOfBirth: '1985-06-15',
    membershipType: 'Premium',
    membershipStatus: 'Active',
    membershipStartDate: '2022-01-15',
    membershipEndDate: '2023-01-15',
    tags: ['Personal Training'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 234-5678',
      relationship: 'Spouse'
    },
    notes: 'Prefers morning workouts. Working on strength training.',
    checkIns: [
      { id: '101', memberId: '1', dateTime: getTimeToday(8, 30) },
      { id: '102', memberId: '1', dateTime: getDateISO(-2) + 'T08:45:00.000Z' },
      { id: '103', memberId: '1', dateTime: getDateISO(-4) + 'T09:15:00.000Z' }
    ]
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    dateOfBirth: '1990-12-22',
    membershipType: 'Standard',
    membershipStatus: 'Active',
    membershipStartDate: '2022-03-10',
    membershipEndDate: '2023-03-10',
    tags: ['New Member'],
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 876-5432',
      relationship: 'Brother'
    },
    checkIns: [
      { id: '201', memberId: '2', dateTime: getTimeToday(17, 15) },
      { id: '202', memberId: '2', dateTime: getDateISO(-1) + 'T18:00:00.000Z' },
      { id: '203', memberId: '2', dateTime: getDateISO(-3) + 'T16:45:00.000Z' }
    ]
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.c@example.com',
    phone: '(555) 456-7890',
    profileImage: 'https://i.pravatar.cc/150?img=3',
    dateOfBirth: '1978-09-05',
    membershipType: 'VIP',
    membershipStatus: 'Active',
    membershipStartDate: '2021-11-05',
    membershipEndDate: '2022-11-05',
    tags: ['VIP', 'Personal Training'],
    checkIns: [
      { id: '301', memberId: '3', dateTime: getDateISO(-1) + 'T07:30:00.000Z' },
      { id: '302', memberId: '3', dateTime: getDateISO(-2) + 'T07:15:00.000Z' },
      { id: '303', memberId: '3', dateTime: getDateISO(-3) + 'T07:45:00.000Z' }
    ]
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Taylor',
    email: 'emily.t@example.com',
    phone: '(555) 765-4321',
    profileImage: 'https://i.pravatar.cc/150?img=9',
    dateOfBirth: '1995-03-18',
    membershipType: 'Student',
    membershipStatus: 'Active',
    membershipStartDate: '2022-05-01',
    membershipEndDate: '2023-05-01',
    tags: [],
    checkIns: [
      { id: '401', memberId: '4', dateTime: getDateISO(-1) + 'T16:00:00.000Z' },
      { id: '402', memberId: '4', dateTime: getDateISO(-3) + 'T15:30:00.000Z' },
      { id: '403', memberId: '4', dateTime: getDateISO(-5) + 'T17:00:00.000Z' }
    ]
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Garcia',
    email: 'robert.g@example.com',
    phone: '(555) 234-5678',
    profileImage: 'https://i.pravatar.cc/150?img=4',
    dateOfBirth: '1982-08-10',
    membershipType: 'Family',
    membershipStatus: 'Frozen',
    membershipStartDate: '2022-02-15',
    membershipEndDate: '2023-02-15',
    tags: [],
    notes: 'Membership frozen due to injury. Expected return: Next month.',
    checkIns: [
      { id: '501', memberId: '5', dateTime: getDateISO(-10) + 'T08:00:00.000Z' },
      { id: '502', memberId: '5', dateTime: getDateISO(-12) + 'T07:45:00.000Z' },
      { id: '503', memberId: '5', dateTime: getDateISO(-14) + 'T08:15:00.000Z' }
    ]
  },
  {
    id: '6',
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.m@example.com',
    phone: '(555) 876-5432',
    profileImage: 'https://i.pravatar.cc/150?img=8',
    dateOfBirth: '1988-11-27',
    membershipType: 'Premium',
    membershipStatus: 'Expired',
    membershipStartDate: '2021-09-01',
    membershipEndDate: '2022-09-01',
    tags: ['Prospect'],
    checkIns: [
      { id: '601', memberId: '6', dateTime: getDateISO(-35) + 'T17:30:00.000Z' },
      { id: '602', memberId: '6', dateTime: getDateISO(-42) + 'T18:15:00.000Z' },
      { id: '603', memberId: '6', dateTime: getDateISO(-49) + 'T16:45:00.000Z' }
    ]
  }
];

// Trainers mock data
export const trainers: Trainer[] = [
  {
    id: '1',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.r@example.com',
    phone: '(555) 111-2222',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    specialties: ['Strength Training', 'Nutrition', 'Weight Loss'],
    certifications: ['NASM CPT', 'Precision Nutrition', 'TRX'],
    bio: 'Alex has been a fitness professional for over 10 years, specializing in strength training and nutrition coaching.',
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' }
    ],
    assignedClasses: ['1', '3'],
    assignedMembers: ['1', '3']
  },
  {
    id: '2',
    firstName: 'Jessica',
    lastName: 'Kim',
    email: 'jessica.k@example.com',
    phone: '(555) 333-4444',
    profileImage: 'https://i.pravatar.cc/150?img=25',
    specialties: ['Yoga', 'Pilates', 'Flexibility'],
    certifications: ['RYT 500', 'Pilates Method Alliance'],
    bio: 'Jessica is a certified yoga instructor and Pilates teacher with a focus on mindfulness and flexibility.',
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
    ],
    assignedClasses: ['2', '4'],
    assignedMembers: ['2', '4']
  },
  {
    id: '3',
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'marcus.w@example.com',
    phone: '(555) 555-6666',
    profileImage: 'https://i.pravatar.cc/150?img=11',
    specialties: ['Crossfit', 'HIIT', 'Functional Training'],
    certifications: ['CrossFit Level 2', 'NASM CPT', 'Kettlebell Specialist'],
    bio: 'Marcus specializes in high-intensity workouts and functional fitness, helping clients achieve their peak performance.',
    availability: [
      { day: 'Monday', startTime: '14:00', endTime: '21:00' },
      { day: 'Wednesday', startTime: '14:00', endTime: '21:00' },
      { day: 'Friday', startTime: '14:00', endTime: '21:00' }
    ],
    assignedClasses: ['5', '7'],
    assignedMembers: ['5']
  }
];

// Classes mock data
export const gymClasses: GymClass[] = [
  {
    id: '1',
    name: 'Morning Yoga Flow',
    type: 'Yoga',
    description: 'Start your day with a rejuvenating yoga flow that combines breath work with gentle movements.',
    trainerId: '2',
    room: 'Yoga Studio',
    startTime: '08:00',
    endTime: '09:00',
    date: getDateISO(0).split('T')[0],
    capacity: 20,
    attendees: ['2', '4', '6']
  },
  {
    id: '2',
    name: 'High-Intensity Interval Training',
    type: 'HIIT',
    description: 'A fast-paced workout combining cardio and strength exercises for maximum calorie burn.',
    trainerId: '3',
    room: 'Main Floor',
    startTime: '12:00',
    endTime: '13:00',
    date: getDateISO(0).split('T')[0],
    capacity: 15,
    attendees: ['1', '3', '5']
  },
  {
    id: '3',
    name: 'Power Spin',
    type: 'Spin',
    description: 'High-energy indoor cycling class with music and varying intensity levels.',
    trainerId: '1',
    room: 'Spin Room',
    startTime: '17:30',
    endTime: '18:30',
    date: getDateISO(0).split('T')[0],
    capacity: 18,
    attendees: ['2', '4']
  },
  {
    id: '4',
    name: 'Core & More',
    type: 'Strength',
    description: 'Focus on building core strength and improving overall stability.',
    trainerId: '1',
    room: 'Studio A',
    startTime: '09:15',
    endTime: '10:15',
    date: getDateISO(1).split('T')[0],
    capacity: 20,
    attendees: []
  },
  {
    id: '5',
    name: 'Zumba Dance Party',
    type: 'Zumba',
    description: 'Fun, energetic dance workout featuring Latin and international music.',
    trainerId: '2',
    room: 'Studio B',
    startTime: '18:00',
    endTime: '19:00',
    date: getDateISO(1).split('T')[0],
    capacity: 25,
    attendees: []
  },
  {
    id: '6',
    name: 'Advanced Pilates',
    type: 'Pilates',
    description: 'Challenging Pilates session focused on precise movements and deep core engagement.',
    trainerId: '2',
    room: 'Yoga Studio',
    startTime: '10:30',
    endTime: '11:30',
    date: getDateISO(2).split('T')[0],
    capacity: 15,
    attendees: []
  },
  {
    id: '7',
    name: 'CrossFit Challenge',
    type: 'CrossFit',
    description: 'High-intensity functional movements to build strength and conditioning.',
    trainerId: '3',
    room: 'Main Floor',
    startTime: '16:00',
    endTime: '17:00',
    date: getDateISO(2).split('T')[0],
    capacity: 12,
    attendees: []
  }
];

// Recent check-ins
export const recentCheckIns: CheckIn[] = [
  { id: '1001', memberId: '1', dateTime: getTimeToday(8, 30) },
  { id: '1002', memberId: '2', dateTime: getTimeToday(9, 15) },
  { id: '1003', memberId: '3', dateTime: getTimeToday(7, 45) },
  { id: '1004', memberId: '4', dateTime: getTimeToday(17, 30) },
];

// Notes mock data
export const notes: Note[] = [
  {
    id: '1',
    category: 'Member Notes',
    title: 'Initial Assessment - John Doe',
    content: 'John is focusing on weight loss and strength training. Set up a 12-week program with progressive overload.',
    createdAt: getDateISO(-5),
    createdBy: 'Alex Rodriguez',
    relatedTo: {
      type: 'Member',
      id: '1'
    }
  },
  {
    id: '2',
    category: 'Training Logs',
    title: 'Personal Training Session - Sarah Johnson',
    content: 'Worked on squat form. Increased weight by 10lbs from previous session. Needs to focus on depth and keeping knees out.',
    createdAt: getDateISO(-2),
    createdBy: 'Jessica Kim',
    relatedTo: {
      type: 'Member',
      id: '2'
    }
  },
  {
    id: '3',
    category: 'Incidents',
    title: 'Minor Equipment Issue',
    content: 'Treadmill #3 showing error code E4. Maintenance has been notified. Machine temporarily out of service.',
    createdAt: getDateISO(-1),
    createdBy: 'Marcus Williams'
  },
  {
    id: '4',
    category: 'Communication',
    title: 'Follow-up with Expired Member',
    content: 'Called Olivia Martinez about renewing her expired membership. She\'s interested but wants to review the new pricing options. Will follow up next week.',
    createdAt: getDateISO(-3),
    createdBy: 'Alex Rodriguez',
    relatedTo: {
      type: 'Member',
      id: '6'
    }
  }
];

// Mock guest data
export const guests: Guest[] = [
  {
    id: '1',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '(555) 234-5678',
    visitPurpose: 'Trial',
    waiverSigned: true,
    checkInDateTime: getTimeToday(10, 15),
    status: 'Checked In',
    notes: 'Interested in personal training options. Considering a Premium membership.',
    convertedToMember: false,
    referralSource: 'Social Media',
    visitHistory: [
      {
        id: '101',
        guestId: '1',
        checkInDateTime: getTimeToday(10, 15),
        visitPurpose: 'Trial',
        notes: 'First visit - complimentary trial pass',
        staffId: '1'
      }
    ],
    marketingConsent: true
  },
  {
    id: '2',
    firstName: 'Amanda',
    lastName: 'Garcia',
    email: 'amanda.g@example.com',
    phone: '(555) 876-5432',
    visitPurpose: 'Tour',
    waiverSigned: true,
    checkInDateTime: getTimeToday(14, 30),
    checkOutDateTime: getTimeToday(15, 15),
    status: 'Checked Out',
    notes: 'Brought family to tour facility. Very interested in family membership.',
    convertedToMember: false,
    referralSource: 'Website',
    visitHistory: [
      {
        id: '201',
        guestId: '2',
        checkInDateTime: getTimeToday(14, 30),
        checkOutDateTime: getTimeToday(15, 15),
        visitPurpose: 'Tour',
        notes: 'Facility tour with family',
        staffId: '2'
      },
      {
        id: '202',
        guestId: '2',
        checkInDateTime: getDateISO(-7) + 'T13:00:00.000Z',
        checkOutDateTime: getDateISO(-7) + 'T14:30:00.000Z',
        visitPurpose: 'Trial',
        notes: 'Initial workout session',
        staffId: '3'
      }
    ],
    marketingConsent: true
  },
  {
    id: '3',
    firstName: 'Thomas',
    lastName: 'Lee',
    email: 'thomas.l@example.com',
    phone: '(555) 345-6789',
    visitPurpose: 'Day Pass',
    relatedMemberId: '1',
    waiverSigned: true,
    checkInDateTime: getDateISO(-1) + 'T16:45:00.000Z',
    checkOutDateTime: getDateISO(-1) + 'T18:30:00.000Z',
    status: 'Checked Out',
    convertedToMember: false,
    visitHistory: [
      {
        id: '301',
        guestId: '3',
        checkInDateTime: getDateISO(-1) + 'T16:45:00.000Z',
        checkOutDateTime: getDateISO(-1) + 'T18:30:00.000Z',
        visitPurpose: 'Day Pass',
        staffId: '1'
      }
    ],
    marketingConsent: false
  },
  {
    id: '4',
    firstName: 'Michelle',
    lastName: 'Parker',
    email: 'michelle.p@example.com',
    phone: '(555) 987-1234',
    visitPurpose: 'Event',
    waiverSigned: true,
    checkInDateTime: getDateISO(-3) + 'T09:00:00.000Z',
    checkOutDateTime: getDateISO(-3) + 'T11:30:00.000Z',
    status: 'Checked Out',
    notes: 'Attended charity fitness event. Showed interest in VIP membership.',
    convertedToMember: true,
    referralSource: 'Friend Referral',
    visitHistory: [
      {
        id: '401',
        guestId: '4',
        checkInDateTime: getDateISO(-3) + 'T09:00:00.000Z',
        checkOutDateTime: getDateISO(-3) + 'T11:30:00.000Z',
        visitPurpose: 'Event',
        notes: 'Charity fitness event',
        staffId: '2'
      },
      {
        id: '402',
        guestId: '4',
        checkInDateTime: getDateISO(-10) + 'T15:00:00.000Z',
        checkOutDateTime: getDateISO(-10) + 'T16:45:00.000Z',
        visitPurpose: 'Tour',
        notes: 'Initial facility tour',
        staffId: '1'
      }
    ],
    marketingConsent: true
  },
  {
    id: '5',
    firstName: 'Ryan',
    lastName: 'Zhang',
    email: 'ryan.z@example.com',
    phone: '(555) 456-7890',
    visitPurpose: 'Member Guest',
    relatedMemberId: '3',
    waiverSigned: true,
    checkInDateTime: getTimeToday(17, 45),
    status: 'Checked In',
    convertedToMember: false,
    visitHistory: [
      {
        id: '501',
        guestId: '5',
        checkInDateTime: getTimeToday(17, 45),
        visitPurpose: 'Member Guest',
        staffId: '3'
      },
      {
        id: '502',
        guestId: '5',
        checkInDateTime: getDateISO(-14) + 'T18:00:00.000Z',
        checkOutDateTime: getDateISO(-14) + 'T19:45:00.000Z',
        visitPurpose: 'Member Guest',
        staffId: '3'
      }
    ],
    marketingConsent: true
  }
];

// Dashboard stats
export const dashboardStats: DashboardStats = {
  todayCheckIns: 27,
  activeMembers: 187,
  expiringMemberships: 12,
  upcomingClasses: 8,
  newMembers: 5
};

// Generate monthly check-in data for charts
export const generateMonthlyCheckInData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    // Generate realistic looking data with an upward trend and seasonal variations
    let value = 150 + Math.floor(Math.random() * 50) + (index * 10);
    
    // Summer months (May-Aug) have higher attendance
    if (index >= 4 && index <= 7) {
      value += 50;
    }
    
    // Winter months (Dec-Feb) have slightly higher attendance (New Year's resolutions)
    if (index === 11 || index === 0 || index === 1) {
      value += 30;
    }
    
    // Current month and future months don't have complete data
    if (index > currentMonth) {
      value = 0;
    }
    
    return {
      name: month,
      checkIns: value
    };
  });
};

// Generate weekly class attendance data for charts
export const generateWeeklyClassAttendanceData = () => {
  const classTypes = ['Yoga', 'Spin', 'HIIT', 'Pilates', 'Zumba', 'Boxing', 'CrossFit'];
  
  return classTypes.map(classType => {
    // Different classes have different popularity levels
    let baseAttendance = 0;
    switch (classType) {
      case 'HIIT':
      case 'Spin':
        baseAttendance = 85;
        break;
      case 'Yoga':
      case 'Zumba':
        baseAttendance = 75;
        break;
      default:
        baseAttendance = 65;
    }
    
    return {
      name: classType,
      attendance: baseAttendance + Math.floor(Math.random() * 15)
    };
  });
};

// Generate membership distribution data for charts
export const generateMembershipDistributionData = () => {
  return [
    { name: 'Standard', value: 110 },
    { name: 'Premium', value: 65 },
    { name: 'VIP', value: 22 },
    { name: 'Student', value: 45 },
    { name: 'Family', value: 33 },
    { name: 'Corporate', value: 18 },
    { name: 'Senior', value: 25 }
  ];
};

// Mock guest visit data
export const guestVisits: GuestVisit[] = [
  {
    id: '1',
    guestId: '1',
    checkInDateTime: getTimeToday(10, 15),
    checkOutDateTime: getTimeToday(11, 00),
    staffId: '1',
    notes: 'Checked in for a complimentary trial pass'
  },
  {
    id: '2',
    guestId: '2',
    checkInDateTime: getTimeToday(14, 30),
    checkOutDateTime: getTimeToday(15, 15),
    staffId: '2',
    notes: 'Facility tour with family'
  },
  {
    id: '3',
    guestId: '3',
    checkInDateTime: getDateISO(-1) + 'T16:45:00.000Z',
    checkOutDateTime: getDateISO(-1) + 'T18:30:00.000Z',
    staffId: '1',
    notes: 'Day pass'
  },
  {
    id: '4',
    guestId: '4',
    checkInDateTime: getDateISO(-3) + 'T09:00:00.000Z',
    checkOutDateTime: getDateISO(-3) + 'T11:30:00.000Z',
    staffId: '2',
    notes: 'Charity fitness event'
  },
  {
    id: '5',
    guestId: '5',
    checkInDateTime: getTimeToday(17, 45),
    checkOutDateTime: getTimeToday(18, 00),
    staffId: '3',
    notes: 'Member guest'
  }
];
