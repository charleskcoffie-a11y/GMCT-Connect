
import * as MockData from './mockData';
import { db, functions } from './firebase';
import { 
  User, Announcement, DailyVerse, Event, SundayService, 
  Devotion, Sermon, Hymn, LiturgicalSeason, PrayerRequest, SickReport, UserRole, Member, AttendanceRecord, MinisterMessage, LeaderNote, ClassMessage, DayType
} from '../types';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, getDoc, writeBatch, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// --- In-Memory State (Fallback) ---
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
  leaderNotes: [] as LeaderNote[], 
  classMessages: [] as ClassMessage[], // New State for Class Messages
  services: [...MockData.SERVICES] as SundayService[],
};

// Helper to check if we should use Firebase
const useFirebase = () => !!db;

export const UserService = {
  getUserProfile: async (uid: string): Promise<User | null> => {
    if (useFirebase() && db) {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) return { id: uid, ...snap.data() } as User;
      return null;
    }
    return MockData.MOCK_USER; // Fallback
  },
  
  updateRoleMock: async (role: UserRole): Promise<User> => {
    MockData.MOCK_USER.role = role;
    return { ...MockData.MOCK_USER, role };
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
  
  getServices: async (): Promise<SundayService[]> => {
    if (useFirebase() && db) {
        const q = query(collection(db, 'sunday_services'), orderBy('date', 'asc'));
        const snap = await getDocs(q);
        if(!snap.empty) {
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as SundayService));
        }
    }
    // Return sorted services from state
    return STATE.services.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

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
  
  // Updated getSeasons to calculate 'current' based on today's date
  getSeasons: async (): Promise<LiturgicalSeason[]> => {
    const seasons = MockData.SEASONS;
    const now = new Date();
    // Reset time for accurate date-only comparison
    now.setHours(0,0,0,0);

    return seasons.map(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        // Ensure comparison covers the end of the end date
        end.setHours(23, 59, 59, 999);
        
        return {
            ...s,
            current: now >= start && now <= end
        };
    });
  },
  
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
  },

  getLeaderNotes: async (): Promise<LeaderNote[]> => {
    if (useFirebase() && db) {
        const q = query(collection(db, 'leaderNotes'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as LeaderNote));
    }
    return STATE.leaderNotes;
  },

  markLeaderNoteRead: async (id: string): Promise<void> => {
    if (useFirebase() && db) {
        await updateDoc(doc(db, 'leaderNotes', id), { isRead: true });
        return;
    }
    STATE.leaderNotes = STATE.leaderNotes.map(n => n.id === id ? { ...n, isRead: true } : n);
  },

  saveServices: async (services: SundayService[]): Promise<void> => {
    if (useFirebase() && db) {
        const batch = writeBatch(db);
        services.forEach(service => {
            const ref = doc(db, 'sunday_services', service.id);
            batch.set(ref, service);
        });
        await batch.commit();
        return;
    }
    const newIds = new Set(services.map(s => s.id));
    STATE.services = [
        ...STATE.services.filter(s => !newIds.has(s.id)),
        ...services
    ];
  }
};

export const ClassService = {
    verifyClassAccess: async (classId: string, accessCode: string): Promise<{ success: boolean; message: string }> => {
        if (useFirebase() && functions) {
            try {
                const verifyFn = httpsCallable(functions, 'verifyClassCode');
                const result = await verifyFn({ classId, accessCode });
                return result.data as { success: boolean; message: string };
            } catch (e: any) {
                console.error("Verification failed", e);
                return { success: false, message: e.message || "Verification failed" };
            }
        }
        if (accessCode === '1234') return { success: true, message: "Success" };
        return { success: false, message: "Invalid access code (Mock: use 1234)" };
    },

    getMembers: async (classId: string): Promise<Member[]> => {
        return STATE.members.filter(m => m.classId === classId);
    },
    
    // --- UPDATED: Save Attendance to Firestore ---
    submitAttendance: async (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'markedByUid'> & { markedByUid: string }): Promise<void> => {
        const docId = `${record.classId}_${record.date}_${record.dayType}`;
        const finalRecord: AttendanceRecord = {
            id: docId,
            createdAt: new Date().toISOString(),
            ...record
        };

        if (useFirebase() && db) {
            // Upsert the record (overwrite if exists for same day/class)
            await setDoc(doc(db, 'attendance', docId), finalRecord, { merge: true });
        } else {
            // Mock Fallback
            const existingIndex = STATE.attendance.findIndex(a => a.id === docId);
            if (existingIndex !== -1) {
                STATE.attendance[existingIndex] = finalRecord;
            } else {
                STATE.attendance.push(finalRecord);
            }
        }
        
        // Update local member "lastAttended" state (Mock only, real app would rely on query)
        if (!useFirebase()) {
            record.records.forEach(r => {
                if (r.status === 'Present') {
                    const memberIndex = STATE.members.findIndex(m => m.id === r.memberId);
                    if (memberIndex !== -1) {
                        STATE.members[memberIndex] = {
                            ...STATE.members[memberIndex],
                            lastAttended: record.date
                        };
                    }
                }
            });
        }
    },

    // --- NEW: Fetch Single Attendance Record (For Editing) ---
    getAttendanceForDate: async (classId: string, date: string, dayType: DayType): Promise<AttendanceRecord | null> => {
        const docId = `${classId}_${date}_${dayType}`;
        
        if (useFirebase() && db) {
            const snap = await getDoc(doc(db, 'attendance', docId));
            if (snap.exists()) {
                return snap.data() as AttendanceRecord;
            }
            return null;
        }
        return STATE.attendance.find(a => a.id === docId) || null;
    },

    // --- NEW: Fetch Attendance History (For Analytics/Grid) ---
    getAttendanceHistory: async (classId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
        if (useFirebase() && db) {
            let q = query(
                collection(db, 'attendance'), 
                where('classId', '==', classId),
                orderBy('date', 'desc')
            );
            
            // Note: Compound queries with range filters often need composite indexes in Firestore.
            // For simplicity, we filter dates client-side if indexes fail or are complex to setup here.
            // But we will attempt date filtering if provided.
            if (startDate) {
                q = query(q, where('date', '>=', startDate));
            }
            if (endDate) {
                q = query(q, where('date', '<=', endDate));
            }
            
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data() as AttendanceRecord);
        }

        // Mock
        return STATE.attendance.filter(a => {
            const matchClass = a.classId === classId;
            const matchStart = startDate ? a.date >= startDate : true;
            const matchEnd = endDate ? a.date <= endDate : true;
            return matchClass && matchStart && matchEnd;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    getFollowUpMembers: async (classId: string): Promise<Member[]> => {
        // Mock Logic: Return members of this class who haven't attended in the last 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        const fourWeeksIso = fourWeeksAgo.toISOString().split('T')[0];

        // In Real Firebase, we would query attendance history. 
        // For now, in mock, we use the `lastAttended` field on Member.
        // In real app, `lastAttended` should be a field on the Member document updated via Cloud Function triggers.
        
        const classMembers = STATE.members.filter(m => m.classId === classId);
        
        return classMembers.filter(member => {
            if (!member.lastAttended) return true; 
            return member.lastAttended < fourWeeksIso;
        });
    },

    resolveFollowUp: async (memberId: string, resolution: 'Sick' | 'Travelled' | 'Resolved'): Promise<void> => {
        // Mock Implementation
        const memberIndex = STATE.members.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
            STATE.members[memberIndex] = {
                ...STATE.members[memberIndex],
                lastAttended: new Date().toISOString().split('T')[0] // 'Touch' the record
            };
        }
    },

    submitLeaderNote: async (note: Omit<LeaderNote, 'id' | 'createdAt' | 'isRead'>): Promise<void> => {
        if (useFirebase() && db) {
            await addDoc(collection(db, 'leaderNotes'), {
                ...note,
                createdAt: new Date().toISOString(),
                isRead: false
            });
            return;
        }
        STATE.leaderNotes.unshift({
            id: `ln_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
            ...note
        });
    },

    sendMessageToLeader: async (msg: Omit<ClassMessage, 'id' | 'date' | 'isRead'>): Promise<void> => {
        // Mock Implementation
        STATE.classMessages.unshift({
            id: `cm_${Date.now()}`,
            date: new Date().toISOString(),
            isRead: false,
            ...msg
        });
    },

    getClassMessages: async (classId: string): Promise<ClassMessage[]> => {
        // Mock Implementation
        return STATE.classMessages.filter(m => m.classId === classId);
    },
    
    markClassMessageRead: async (id: string): Promise<void> => {
        STATE.classMessages = STATE.classMessages.map(m => m.id === id ? { ...m, isRead: true } : m);
    }
};
