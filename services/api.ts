import * as MockData from './mockData';
import { 
  User, Announcement, DailyVerse, Event, SundayService, 
  Devotion, Sermon, Hymn, LiturgicalSeason, PrayerRequest, SickReport, UserRole, HymnBook, Member, AttendanceRecord, MinisterMessage 
} from '../types';

// --- In-Memory State for Session Persistence ---
let STATE = {
  announcements: [...MockData.ANNOUNCEMENTS],
  events: [...MockData.EVENTS],
  devotions: [...MockData.DEVOTIONS],
  sermons: [...MockData.SERMONS],
  hymns: [...MockData.HYMNS],
  prayerRequests: [...MockData.PRAYER_REQUESTS],
  sickReports: [...MockData.SICK_REPORTS],
  members: [...MockData.MOCK_MEMBERS],
  messages: [...MockData.MOCK_MESSAGES],
  attendance: [] as AttendanceRecord[],
};

export const UserService = {
  getCurrentUser: async (): Promise<User> => {
    return MockData.MOCK_USER;
  },
  updateRole: async (role: UserRole): Promise<User> => {
    const className = role === 'class_leader' || role === 'member' ? 'Class 5' : undefined;
    const classId = role === 'class_leader' || role === 'member' ? 'c5' : undefined;
    
    // Update the mock user for the session
    MockData.MOCK_USER.role = role;
    MockData.MOCK_USER.className = className;
    MockData.MOCK_USER.classId = classId;

    return { ...MockData.MOCK_USER, role, className, classId };
  }
};

export const ContentService = {
  getAnnouncements: async (): Promise<Announcement[]> => STATE.announcements,
  
  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> => {
    const newAnn: Announcement = {
      id: `a_${Date.now()}`,
      date: new Date().toISOString(),
      ...announcement
    };
    STATE.announcements.unshift(newAnn);
    return newAnn;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    STATE.announcements = STATE.announcements.filter(a => a.id !== id);
  },

  getDailyVerse: async (): Promise<DailyVerse> => MockData.DAILY_VERSE,
  getEvents: async (): Promise<Event[]> => STATE.events,
  getServices: async (): Promise<SundayService[]> => MockData.SERVICES,
  getDevotions: async (): Promise<Devotion[]> => STATE.devotions,
  getSermons: async (): Promise<Sermon[]> => STATE.sermons,
  getHymns: async (queryText?: string, book?: string): Promise<Hymn[]> => {
    let filtered = STATE.hymns;
    if (book) filtered = filtered.filter(h => h.book === book);
    if (queryText) {
      const lower = queryText.toLowerCase();
      filtered = filtered.filter(h => h.title.toLowerCase().includes(lower) || h.number.includes(lower));
    }
    return filtered;
  },
  importHymns: async (newHymns: Hymn[]): Promise<void> => {
    STATE.hymns.push(...newHymns);
  },
  getSeasons: async (): Promise<LiturgicalSeason[]> => MockData.SEASONS,
  
  generateDevotion: async (): Promise<Devotion> => {
    const newDevotion: Devotion = {
      id: `d_gen_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: "Generated: Strength in Stillness",
      scripture: "Exodus 14:14",
      content: "Sometimes the hardest thing to do is nothing. The Lord fights for you when you are still. (Generated Content)",
      prayer: "Teach me to be still, O Lord."
    };
    STATE.devotions.unshift(newDevotion);
    return newDevotion;
  }
};

export const AdminService = {
  getPrayerRequests: async (): Promise<PrayerRequest[]> => STATE.prayerRequests,
  
  updatePrayerStatus: async (id: string, status: PrayerRequest['status']): Promise<void> => {
    STATE.prayerRequests = STATE.prayerRequests.map(r => r.id === id ? { ...r, status } : r);
  },

  submitPrayerRequest: async (req: Omit<PrayerRequest, 'id' | 'status' | 'date'>): Promise<void> => {
    const newReq: PrayerRequest = {
        id: `pr_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'New',
        ...req
    };
    STATE.prayerRequests.unshift(newReq);
  },

  getSickReports: async (): Promise<SickReport[]> => STATE.sickReports,

  submitSickReport: async (report: Omit<SickReport, 'id' | 'reportedBy' | 'date' | 'status'>): Promise<void> => {
    STATE.sickReports.unshift({
        id: `sr_${Date.now()}`,
        reportedBy: 'current_user',
        date: new Date().toISOString().split('T')[0],
        status: 'Reported',
        ...report
    });
  },

  // Minister Messages
  getMessages: async (): Promise<MinisterMessage[]> => STATE.messages,
  
  sendMessageToMinister: async (msg: Omit<MinisterMessage, 'id' | 'date' | 'isRead'>): Promise<void> => {
    STATE.messages.unshift({
        id: `msg_${Date.now()}`,
        date: new Date().toISOString(),
        isRead: false,
        ...msg
    });
  },

  markMessageRead: async (id: string): Promise<void> => {
    STATE.messages = STATE.messages.map(m => m.id === id ? { ...m, isRead: true } : m);
  }
};

export const ClassService = {
    getMembers: async (classId: string): Promise<Member[]> => {
        return STATE.members.filter(m => m.classId === classId);
    },
    
    searchMembers: async (classId: string, query: string): Promise<Member[]> => {
        const lower = query.toLowerCase();
        return STATE.members.filter(m => 
            m.classId === classId && 
            (m.fullName.toLowerCase().includes(lower) || m.classNumber.includes(lower))
        );
    },

    importMembers: async (newMembers: Member[]): Promise<void> => {
        // Prevent duplicates based on Class ID + Member Number if possible, 
        // but for now we push all to mock state.
        STATE.members.push(...newMembers);
    },

    submitAttendance: async (record: Omit<AttendanceRecord, 'id'>): Promise<void> => {
        STATE.attendance.push({
            id: `att_${Date.now()}`,
            ...record
        });
    },

    getRecentAttendance: async (classId: string): Promise<AttendanceRecord[]> => {
        return STATE.attendance.filter(a => a.classId === classId).sort((a,b) => b.date.localeCompare(a.date));
    }
};