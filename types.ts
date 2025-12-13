export type UserRole = 'rev_minister' | 'class_leader' | 'society_steward' | 'member';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  className?: string; // e.g. "Class 1"
  classId?: string;   // e.g. "c1"
  email: string;
  phoneNumber?: string;
}

export interface Member {
  id: string;
  fullName: string;
  classId: string;
  classNumber: string; // e.g. "001"
  phone: string;
  status: 'Active' | 'Inactive';
}

export interface Announcement {
  id: string;
  title: string;
  category: 'General' | 'Audio' | 'Video';
  content: string;
  date: string;
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
  readings: string[];
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

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  leaderId: string;
  attendees: {
    memberId: string;
    present: boolean;
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