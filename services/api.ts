
import * as MockData from './mockData';
import { db, functions } from './firebase';
import { 
  User, Announcement, DailyVerse, Event, SundayService, 
  Devotion, Sermon, Hymn, LiturgicalSeason, PrayerRequest, SickReport, UserRole, Member, AttendanceRecord, MinisterMessage, LeaderNote, ClassMessage, DayType, ChurchBranch, VisitorSubmission, Organization
} from '../types';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, getDoc, writeBatch, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// --- In-Memory State (Fallback) ---
// Initialize announcements with default visible dates for backward compatibility
const today = new Date();
const nextMonth = new Date();
nextMonth.setDate(today.getDate() + 30);

let STATE = {
  announcements: MockData.ANNOUNCEMENTS.map(a => ({
      ...a,
      startDate: a.date, // Active from creation
      endDate: nextMonth.toISOString() // Active for a month by default
  })) as Announcement[],
  events: [...MockData.EVENTS],
  devotions: [...MockData.DEVOTIONS],
  sermons: [...MockData.SERMONS],
  hymns: [...MockData.HYMNS],
  prayerRequests: [...MockData.PRAYER_REQUESTS],
  sickReports: [...MockData.SICK_REPORTS],
  members: [...MockData.MOCK_MEMBERS],
  messages: [...MockData.MOCK_MESSAGES],
  stewardMessages: [] as MinisterMessage[],
  attendance: [] as AttendanceRecord[],
  leaderNotes: [] as LeaderNote[], 
  classMessages: [] as ClassMessage[], 
  services: [...MockData.SERVICES] as SundayService[],
  organizations: [...MockData.ORGANIZATIONS] as Organization[]
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

  getDailyVerse: async (): Promise<DailyVerse> => {
    // 1. Try Firebase if available
    if (useFirebase() && db) {
        // Implementation for future Firestore fetching
    }
    
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];

    // 2. Check Overrides (Date Specific)
    const override = MockData.VERSE_OVERRIDES.find(v => v.date === todayStr);
    if (override) return override;

    // 3. Verse Bank Rotation (Day of Year)
    const start = new Date(todayObj.getFullYear(), 0, 0);
    const diff = todayObj.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const bank = MockData.VERSE_BANK;
    if (bank && bank.length > 0) {
        // 0-based index from 1-based day of year
        const index = (dayOfYear - 1) % bank.length;
        const verse = bank[Math.max(0, index)]; 

        return {
            ...verse,
            date: todayStr
        };
    }

    // 4. Fallback to default
    return MockData.DAILY_VERSE;
  },

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

  getDevotions: async (): Promise<Devotion[]> => {
    const todayStr = new Date().toISOString().split('T')[0];

    const hasToday = STATE.devotions.some(d => d.date === todayStr);
    if (!hasToday) {
      // Auto-generate a devotion for the day so members always see one
      const auto = await ContentService.generateDevotion();
      // Ensure the newest remains first
      STATE.devotions = [auto, ...STATE.devotions];
    }

    return STATE.devotions;
  },
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
  
  getSeasons: async (): Promise<LiturgicalSeason[]> => {
    const seasons = MockData.SEASONS;
    const now = new Date();
    now.setHours(0,0,0,0);

    return seasons.map(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
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
  },

  getOrganizations: async (): Promise<Organization[]> => STATE.organizations
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

  getStewardMessages: async (): Promise<MinisterMessage[]> => STATE.stewardMessages,

  sendMessageToStewards: async (msg: Omit<MinisterMessage, 'id' | 'date' | 'isRead'>): Promise<void> => {
    STATE.stewardMessages.unshift({
        id: `stm_${Date.now()}`,
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
    
    submitAttendance: async (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'markedByUid'> & { markedByUid: string }): Promise<void> => {
        const docId = `${record.classId}_${record.date}_${record.dayType}`;
        const finalRecord: AttendanceRecord = {
            id: docId,
            createdAt: new Date().toISOString(),
            ...record
        };

        if (useFirebase() && db) {
            await setDoc(doc(db, 'attendance', docId), finalRecord, { merge: true });
        } else {
            const existingIndex = STATE.attendance.findIndex(a => a.id === docId);
            if (existingIndex !== -1) {
                STATE.attendance[existingIndex] = finalRecord;
            } else {
                STATE.attendance.push(finalRecord);
            }
        }
        
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

    getAttendanceHistory: async (classId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
        if (useFirebase() && db) {
            let q = query(
                collection(db, 'attendance'), 
                where('classId', '==', classId),
                orderBy('date', 'desc')
            );
            
            if (startDate) {
                q = query(q, where('date', '>=', startDate));
            }
            if (endDate) {
                q = query(q, where('date', '<=', endDate));
            }
            
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data() as AttendanceRecord);
        }

        return STATE.attendance.filter(a => {
            const matchClass = a.classId === classId;
            const matchStart = startDate ? a.date >= startDate : true;
            const matchEnd = endDate ? a.date <= endDate : true;
            return matchClass && matchStart && matchEnd;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    getFollowUpMembers: async (classId: string): Promise<Member[]> => {
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        const fourWeeksIso = fourWeeksAgo.toISOString().split('T')[0];

        const classMembers = STATE.members.filter(m => m.classId === classId);
        
        return classMembers.filter(member => {
            if (!member.lastAttended) return true; 
            return member.lastAttended < fourWeeksIso;
        });
    },

    resolveFollowUp: async (memberId: string, resolution: 'Sick' | 'Travelled' | 'Resolved'): Promise<void> => {
        const memberIndex = STATE.members.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
            STATE.members[memberIndex] = {
                ...STATE.members[memberIndex],
                lastAttended: new Date().toISOString().split('T')[0]
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
        STATE.classMessages.unshift({
            id: `cm_${Date.now()}`,
            date: new Date().toISOString(),
            isRead: false,
            ...msg
        });
    },

    getClassMessages: async (classId: string): Promise<ClassMessage[]> => {
        return STATE.classMessages.filter(m => m.classId === classId);
    },
    
    markClassMessageRead: async (id: string): Promise<void> => {
        STATE.classMessages = STATE.classMessages.map(m => m.id === id ? { ...m, isRead: true } : m);
    }
};

export const OutreachService = {
  getBranches: async (): Promise<ChurchBranch[]> => {
    return MockData.CHURCH_BRANCHES;
  },

  submitVisitorForm: async (form: VisitorSubmission): Promise<void> => {
    if (useFirebase() && db) {
      await addDoc(collection(db, 'visitors'), {
        ...form,
        createdAt: new Date().toISOString()
      });
      return;
    }
    // Mock success
    console.log("Visitor Submitted:", form);
  },

  submitContactForm: async (data: { name: string; email: string; message: string }): Promise<void> => {
     if (useFirebase() && db) {
      await addDoc(collection(db, 'contact_inquiries'), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return;
    }
    console.log("Contact Msg:", data);
  }
};
