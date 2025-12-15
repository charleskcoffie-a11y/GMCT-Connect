
import { 
  User, Announcement, DailyVerse, Event, SundayService, 
  Devotion, Sermon, Hymn, LiturgicalSeason, PrayerRequest, SickReport, Member, MinisterMessage 
} from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Bro. Alex Parishioner',
  role: 'member',
  email: 'alex@example.com',
  className: 'Class 5',
  classId: 'c5',
  phoneNumber: '0244123456'
};

// Data for Class Leader testing
export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', fullName: 'Kwame Mensah', classId: 'c5', classNumber: '101', phone: '0501234567', status: 'Active' },
  { id: 'm2', fullName: 'Abena Osei', classId: 'c5', classNumber: '102', phone: '0244987654', status: 'Active' },
  { id: 'm3', fullName: 'Kofi Boateng', classId: 'c5', classNumber: '103', phone: '0277112233', status: 'Inactive' },
  { id: 'm4', fullName: 'Ama Serwaa', classId: 'c5', classNumber: '104', phone: '0208889990', status: 'Active' },
  { id: 'm5', fullName: 'Yaw Addo', classId: 'c5', classNumber: '105', phone: '0555444333', status: 'Active' },
  { id: 'm6', fullName: 'Grace Antwi', classId: 'c1', classNumber: '001', phone: '0244000000', status: 'Active' }, // Different class
];

export const MOCK_MESSAGES: MinisterMessage[] = [
  { id: 'msg1', senderName: 'Mama Tess', phone: '0244111222', text: 'Pastor, please we need to discuss the women\'s fellowship anniversary.', date: '2023-11-25T10:00:00', isRead: false },
  { id: 'msg2', senderName: 'Mr. Opoku', phone: '0200000000', text: 'Thank you for the sermon on Sunday. It was very touching.', date: '2023-11-20T14:30:00', isRead: true },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Welcome to the New Church Year',
    category: 'General',
    content: 'We are excited to begin a new liturgical year together. Join us for tea after service.',
    date: '2023-11-20',
    isFeatured: true,
    imageUrl: 'https://picsum.photos/seed/church1/800/400'
  },
  {
    id: 'a2',
    title: 'Choir Rehearsal Update',
    category: 'Audio',
    content: 'Listen to the new arrangement for Sunday.',
    date: '2023-11-22',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'a3',
    title: 'Youth Conference Highlights',
    category: 'Video',
    content: 'Watch the highlights from last weekend.',
    date: '2023-11-23',
    mediaUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
  }
];

export const DAILY_VERSE: DailyVerse = {
  text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.",
  reference: "Psalm 23:1-2",
  version: "NIV",
  imageUrl: "https://picsum.photos/seed/nature/800/600",
  date: new Date().toISOString().split('T')[0]
};

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Mid-week Bible Study',
    date: '2023-11-29T18:00:00',
    time: '6:00 PM',
    location: 'Church Hall',
    description: 'Study of the book of Romans.',
    category: 'Program'
  },
  {
    id: 'e2',
    title: 'Annual Harvest Thanksgiving',
    date: '2023-12-03T09:00:00',
    time: '9:00 AM',
    location: 'Main Sanctuary',
    description: 'Come with your thanksgiving offering.',
    category: 'Service'
  }
];

export const SERVICES: SundayService[] = [
  {
    id: 's1',
    date: '2023-11-26',
    theme: 'The King of Glory',
    preacher: 'Rev. Dr. A. Smith',
    serviceType: 'Matins',
    readings: ['Psalm 24', 'Ephesians 1:15-23', 'Matthew 25:31-46'],
    hymns: ['MHB 1', 'MHB 155'],
    description: 'Christ the King Sunday service.'
  },
  {
    id: 's2',
    date: '2023-12-03',
    theme: 'Hope in Waiting',
    preacher: 'Rev. Jane Doe',
    serviceType: 'Communion',
    readings: ['Isaiah 64:1-9', '1 Corinthians 1:3-9', 'Mark 13:24-37'],
    hymns: ['MHB 242', 'CAN 50'],
    description: 'First Sunday of Advent.'
  }
];

export const DEVOTIONS: Devotion[] = [
  {
    id: 'd1',
    date: new Date().toISOString().split('T')[0],
    title: 'Walking in Light',
    scripture: '1 John 1:7',
    content: 'To walk in the light means to be open, honest, and vulnerable before God. It is not about perfection, but direction.',
    prayer: 'Lord, help me to walk in your light today.'
  },
  {
    id: 'd2',
    date: '2023-11-24',
    title: 'Gratitude',
    scripture: '1 Thessalonians 5:18',
    content: 'In every situation, find a reason to thank God. This changes your perspective.',
    prayer: 'Father, I thank you for your faithfulness.'
  }
];

export const SERMONS: Sermon[] = [
  {
    id: 'ser1',
    title: 'Faith that Moves Mountains',
    preacher: 'Rev. Dr. A. Smith',
    date: '2023-11-19',
    tags: ['Faith', 'Miracles'],
    summary: 'Understanding the dynamics of faith in challenging times.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'ser2',
    title: 'The Grace of Giving',
    preacher: 'Rev. Jane Doe',
    date: '2023-11-12',
    tags: ['Giving', 'Grace'],
    summary: 'Exploring 2 Corinthians 8 and the joy of generosity.'
  }
];

export const HYMNS: Hymn[] = [
  {
    id: 'h1',
    book: 'MHB',
    number: '1',
    title: 'O For a Thousand Tongues to Sing',
    lyrics: "1. O for a thousand tongues to sing\nMy great Redeemer's praise,\nThe glories of my God and King,\nThe triumphs of His grace!\n\n2. My gracious Master and my God,\nAssist me to proclaim,\nTo spread through all the earth abroad\nThe honors of Thy name."
  },
  {
    id: 'h2',
    book: 'CAN',
    number: '50',
    title: 'Come Thou Long Expected Jesus',
    lyrics: "1. Come, Thou long expected Jesus\nBorn to set Thy people free;\nFrom our fears and sins release us,\nLet us find our rest in Thee."
  },
  {
    id: 'h3',
    book: 'Canticles',
    number: '3',
    title: 'Venite',
    lyrics: "O come, let us sing unto the Lord; let us heartily rejoice in the strength of our salvation..."
  }
];

const THIS_YEAR = new Date().getFullYear();

export const SEASONS: LiturgicalSeason[] = [
  {
    id: 'sea_christmas_start',
    name: 'Christmas',
    color: 'White',
    startDate: `${THIS_YEAR}-01-01`,
    endDate: `${THIS_YEAR}-01-05`,
    description: 'Celebrating the birth of Jesus.',
    current: false
  },
  {
    id: 'sea_epiphany',
    name: 'Epiphany',
    color: 'Green',
    startDate: `${THIS_YEAR}-01-06`,
    endDate: `${THIS_YEAR}-02-13`,
    description: 'The manifestation of Christ to the Gentiles.',
    current: false
  },
  {
    id: 'sea_lent',
    name: 'Lent',
    color: 'Purple',
    startDate: `${THIS_YEAR}-02-14`,
    endDate: `${THIS_YEAR}-03-30`,
    description: 'A season of reflection and preparation before Easter.',
    current: false
  },
  {
    id: 'sea_easter',
    name: 'Easter',
    color: 'White',
    startDate: `${THIS_YEAR}-03-31`,
    endDate: `${THIS_YEAR}-05-18`,
    description: 'Celebrating the resurrection of Jesus Christ.',
    current: false
  },
  {
    id: 'sea_pentecost',
    name: 'Pentecost',
    color: 'Red',
    startDate: `${THIS_YEAR}-05-19`,
    endDate: `${THIS_YEAR}-08-30`,
    description: 'Celebrating the descent of the Holy Spirit.',
    current: false
  },
  {
    id: 'sea_kingdom',
    name: 'Kingdomtide',
    color: 'Green',
    startDate: `${THIS_YEAR}-08-31`,
    endDate: `${THIS_YEAR}-12-02`,
    description: 'A season focusing on the Kingdom of God and our growth in discipleship.',
    current: false
  },
  {
    id: 'sea_advent',
    name: 'Advent',
    color: 'Purple',
    startDate: `${THIS_YEAR}-12-03`,
    endDate: `${THIS_YEAR}-12-24`,
    description: 'Preparation for the coming of Christ.',
    current: false
  },
  {
    id: 'sea_christmas',
    name: 'Christmas',
    color: 'White',
    startDate: `${THIS_YEAR}-12-25`,
    endDate: `${THIS_YEAR}-12-31`,
    description: 'Celebrating the birth of Jesus.',
    current: false
  }
];

export const PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'pr1',
    requesterName: 'Sarah Jones',
    phone: '0241234567',
    content: 'Pray for my surgery on Tuesday.',
    date: '2023-11-25',
    status: 'New',
    isAnonymous: false
  },
  {
    id: 'pr2',
    requesterName: 'Anonymous',
    phone: '0207654321',
    content: 'Family restoration.',
    date: '2023-11-20',
    status: 'In-Progress',
    ministerNotes: ['Called on 21st. Scheduled counseling.'],
    isAnonymous: true
  }
];

export const SICK_REPORTS: SickReport[] = [
  {
    id: 'sr1',
    reportedBy: 'u2',
    memberName: 'Elder Kofi',
    condition: 'Flu and Fever',
    urgency: 'Medium',
    date: '2023-11-24',
    status: 'Reported'
  }
];
