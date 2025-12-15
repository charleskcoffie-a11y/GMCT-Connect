
export type UserRole = 'rev_minister' | 'class_leader' | 'society_steward' | 'member' | 'admin';

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: UserRole;
  classId?: string;   // e.g. "c1" (Only for Class Leaders/Members)
  className?: string; // e.g. "Class 1"
  phoneNumber?: string;
  createdAt?: string;
}

export interface Member {
  id: string;
  fullName: string;
  classId: string;
  classNumber: string; // e.g. "001"
  phone: string;
  status: 'Active' | 'Inactive';
  lastAttended?: string; // ISO Date
}

export interface LeaderNote {
  id: string;
  classId: string;
  leaderId: string;
  leaderName: string;
  memberId: string; // The member being discussed
  memberName: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface ClassMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  classId: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'General' | 'Audio' | 'Video';
  content: string;
  date: string; // Creation date
  startDate?: string; // Schedule Start
  endDate?: string;   // Schedule End
  isFeatured?: boolean;
  mediaUrl?: string;
  imageUrl?: string;
}

export interface DailyVerse {
  text: string;
  reference: string;
  version: string;
  imageUrl: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; 
  time: string;
  location: string;
  description: string;
  category: 'Service' | 'Program' | 'Meeting' | 'Social';
}

export interface SundayService {
  id: string;
  date: string;
  theme: string;
  preacher: string;
  serviceType: 'Communion' | 'Matins' | 'Evensong' | 'Praise & Worship' | 'Special';
  readings: string[]; // Expecting 3 readings
  hymns?: string[];
  description?: string;
}

export interface Devotion {
  id: string;
  date: string;
  title: string;
  scripture: string;
  content: string;
  prayer: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  tags: string[];
  audioUrl?: string;
  videoUrl?: string;
  summary: string;
}

export type HymnBook = 'MHB' | 'CAN' | 'Canticles';

export interface Hymn {
  id: string;
  number: string;
  title: string;
  book: HymnBook;
  lyrics: string;
  category?: string;
}

export interface LiturgicalSeason {
  id: string;
  name: string;
  color: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Sick' | 'Travelled';
export type DayType = 'Tuesday' | 'Sunday';

export interface AttendanceRecord {
  id: string; // constructed as classId_date_dayType
  date: string; // YYYY-MM-DD
  dayType: DayType;
  classId: string;
  classNumber?: string;
  leaderId: string;
  markedByUid: string;
  createdAt: string;
  records: {
    memberId: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export interface PrayerRequest {
  id: string;
  requesterName: string;
  phone: string;
  content: string;
  date: string;
  status: 'New' | 'In-Progress' | 'Closed';
  ministerNotes?: string[];
  isAnonymous: boolean;
}

export interface MinisterMessage {
  id: string;
  senderName: string;
  phone: string;
  text: string;
  date: string;
  isRead: boolean;
}

export interface SickReport {
  id: string;
  reportedBy: string; 
  memberName: string;
  condition: string;
  urgency: 'Low' | 'Medium' | 'High';
  date: string;
  status: 'Reported' | 'Visited' | 'Resolved';
  adminNotes?: string;
}

export interface ChurchBranch {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  serviceTimes: { day: string; time: string; label: string }[];
  contactPhone: string;
  googleMapsUrl: string;
}

export interface VisitorSubmission {
  name: string;
  email: string;
  phone: string;
  visitDate: string;
  notes?: string;
}

export interface Organization {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Youth' | 'Music' | 'Service' | 'General';
  leaderName: string;
  leaderPhone: string;
  meetingTime: string;
  description?: string;
  announcements: string[];
  imageUrl?: string;
}
