
import { 
  User, Announcement, DailyVerse, Event, SundayService, 
  Devotion, Sermon, Hymn, LiturgicalSeason, PrayerRequest, SickReport, Member, MinisterMessage, ChurchBranch, Organization
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

// Fallback Verse (ASV)
export const DAILY_VERSE: DailyVerse = {
  text: "Jehovah is my shepherd; I shall not want. He maketh me to lie down in green pastures.",
  reference: "Psalm 23:1-2",
  version: "ASV",
  imageUrl: "https://picsum.photos/seed/nature/800/600",
  date: new Date().toISOString().split('T')[0]
};

// Verse Bank (Rotation System) - American Standard Version
export const VERSE_BANK: Omit<DailyVerse, 'date'>[] = [
  {
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.",
    reference: "John 3:16",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/john316/800/600"
  },
  {
    text: "Trust in Jehovah with all thy heart, And lean not upon thine own understanding.",
    reference: "Proverbs 3:5",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/prov35/800/600"
  },
  {
    text: "In all thy ways acknowledge him, And he will direct thy paths.",
    reference: "Proverbs 3:6",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/prov36/800/600"
  },
  {
    text: "I can do all things in him that strengtheneth me.",
    reference: "Philippians 4:13",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/phil413/800/600"
  },
  {
    text: "And we know that to them that love God all things work together for good, even to them that are called according to his purpose.",
    reference: "Romans 8:28",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/rom828/800/600"
  },
  {
    text: "But seek ye first his kingdom, and his righteousness; and all these things shall be added unto you.",
    reference: "Matthew 6:33",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/matt633/800/600"
  },
  {
    text: "Come unto me, all ye that labor and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/matt1128/800/600"
  },
  {
    text: "Fear thou not, for I am with thee; be not dismayed, for I am thy God; I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    reference: "Isaiah 41:10",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/isa4110/800/600"
  },
  {
    text: "But they that wait for Jehovah shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; they shall walk, and not faint.",
    reference: "Isaiah 40:31",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/isa4031/800/600"
  },
  {
    text: "For I know the thoughts that I think toward you, saith Jehovah, thoughts of peace, and not of evil, to give you hope in your latter end.",
    reference: "Jeremiah 29:11",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/jer2911/800/600"
  },
  {
    text: "Rejoice in the Lord always: again I will say, Rejoice.",
    reference: "Philippians 4:4",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/phil44/800/600"
  },
  {
    text: "Be not anxious for anything, but in everything by prayer and supplication with thanksgiving let your requests be made known unto God.",
    reference: "Philippians 4:6",
    version: "ASV",
    imageUrl: "https://picsum.photos/seed/phil46/800/600"
  }
];

// Date-Specific Overrides (Priority)
export const VERSE_OVERRIDES: DailyVerse[] = [
    {
        date: "2024-12-25",
        text: "For unto us a child is born, unto us a son is given; and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, Mighty God, Everlasting Father, Prince of Peace.",
        reference: "Isaiah 9:6",
        version: "ASV",
        imageUrl: "https://picsum.photos/seed/christmas/800/600"
    },
    {
        date: "2024-01-01",
        text: "In the beginning God created the heavens and the earth.",
        reference: "Genesis 1:1",
        version: "ASV",
        imageUrl: "https://picsum.photos/seed/genesis/800/600"
    }
];

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

export const CHURCH_BRANCHES: ChurchBranch[] = [
  {
    id: 'to_main',
    name: 'GMCT Main Sanctuary',
    address: '69 Milvan Drive, North York, Ontario, Canada',
    imageUrl: 'https://picsum.photos/seed/churchB1/800/400',
    serviceTimes: [
      { day: 'Sunday', time: '10:00 AM - 1:00 PM', label: 'Main Service' },
      { day: 'Tuesday', time: '8:00 PM', label: 'Bible Study (Zoom)' },
      { day: 'Friday', time: '8:00 PM - 9:30 PM', label: 'Prayer Meeting' }
    ],
    contactPhone: '416 743 4555',
    googleMapsUrl: 'https://maps.google.com/?q=69+Milvan+Drive,North+York,Ontario,Canada'
  },
  {
    id: 'to_north',
    name: 'North York Fellowship',
    address: '456 Sheppard Ave E, North York, ON M2N 3B3',
    imageUrl: 'https://picsum.photos/seed/churchB2/800/400',
    serviceTimes: [
      { day: 'Sunday', time: '10:30 AM', label: 'Worship Service' },
      { day: 'Friday', time: '7:00 PM', label: 'Prayer Meeting' }
    ],
    contactPhone: '(416) 555-0102',
    googleMapsUrl: 'https://maps.google.com/?q=North+York+City+Centre'
  },
  { id: 'ottawa', name: 'Ottawa Society', address: 'Ottawa, ON', imageUrl: 'https://picsum.photos/seed/ottawa/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Ottawa,ON' },
  { id: 'montreal', name: 'Montreal Society', address: 'Montreal, QC', imageUrl: 'https://picsum.photos/seed/montreal/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Montreal,QC' },
  { id: 'brampton', name: 'Brampton Society', address: 'Brampton, ON', imageUrl: 'https://picsum.photos/seed/brampton/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Brampton,ON' },
  { id: 'hamilton', name: 'Hamilton Society', address: 'Hamilton, ON', imageUrl: 'https://picsum.photos/seed/hamilton/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Hamilton,ON' },
  { id: 'london', name: 'London Society', address: 'London, ON', imageUrl: 'https://picsum.photos/seed/london/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=London,ON' },
  { id: 'calgary', name: 'Calgary Society', address: 'Calgary, AB', imageUrl: 'https://picsum.photos/seed/calgary/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Calgary,AB' },
  { id: 'edmonton', name: 'Edmonton Society', address: 'Edmonton, AB', imageUrl: 'https://picsum.photos/seed/edmonton/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Edmonton,AB' },
  { id: 'vancouver', name: 'Vancouver Society', address: 'Vancouver, BC', imageUrl: 'https://picsum.photos/seed/vancouver/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Vancouver,BC' },
  { id: 'thunder_bay', name: 'Thunder Bay Society', address: 'Thunder Bay, ON', imageUrl: 'https://picsum.photos/seed/thunderbay/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: 'https://maps.google.com/?q=Thunder+Bay,ON' },
  { id: 'st_johns', name: "St. John's Society", address: "St. John's, NL", imageUrl: 'https://picsum.photos/seed/stjohns/800/400', serviceTimes: [], contactPhone: 'Contact via Main Office: 416 743 4555', googleMapsUrl: "https://maps.google.com/?q=St.+John's,NL" }
];

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org1',
    name: "Men's Fellowship",
    category: 'Men',
    leaderName: 'Bro. Emmanuel Mensah',
    leaderPhone: '024 111 2222',
    meetingTime: 'Mondays @ 7:00 PM',
    description: 'A fellowship of Methodist men committed to spiritual growth, family leadership, accountability, and practical service. Aims include Bible study and prayer, mentoring, supporting church projects, and community outreach.',
    announcements: ['Annual Retreat is set for next month.', 'Dues collection this Sunday.']
  },
  {
    id: 'org2',
    name: "Christ's Little Band",
    category: 'General',
    leaderName: 'Sis. Grace Osei',
    leaderPhone: '050 333 4444',
    meetingTime: 'Wednesdays @ 6:00 PM',
    description: 'An evangelism and prayer movement focusing on intercession, witnessing, visitation, and gospel proclamation. Objectives include tract distribution, support for revival services, and testifying through song and prayer.',
    announcements: ['Prayer warriors meeting on Friday.', 'New members orientation next week.']
  },
  {
    id: 'org3',
    name: "AMB (Association of Methodist Brigades)",
    category: 'AMB',
    leaderName: 'Capt. John Doe',
    leaderPhone: '027 555 6666',
    meetingTime: 'Saturdays @ 3:00 PM',
    description: 'A uniformed youth organization that promotes discipline, leadership, citizenship, and Christian service. Aims include training in drill and order, character formation, and serving church and community.',
    announcements: ['Parade rehearsal this Saturday.', 'Uniform inspection on Sunday.']
  },
  {
    id: 'org4',
    name: "Women's Fellowship",
    category: 'Women',
    leaderName: 'Sis. Mary Boateng',
    leaderPhone: '024 777 8888',
    meetingTime: 'Thursdays @ 6:30 PM',
    description: 'A ministry nurturing women in prayer, discipleship, and service. Objectives include strengthening homes, mentoring younger women, charitable works, and wholehearted support of the church’s mission.',
    announcements: ['Visiting the orphanage next week.', 'Anniversary cloth is available.']
  },
  {
    id: 'org5',
    name: "Guild",
    category: 'Women',
    leaderName: 'Sis. Sarah Appiah',
    leaderPhone: '020 999 0000',
    meetingTime: 'Tuesdays @ 7:00 PM',
    description: 'A fellowship for young women and mothers devoted to Christian formation, mutual support, and practical service. Aims include discipleship, skills development, and community care.',
    announcements: ['Cooking competition next month.', 'Bible study on Ruth chapter 1.']
  },
  {
    id: 'org6',
    name: "Singing Band",
    category: 'Music',
    leaderName: 'Bro. Peter Antwi',
    leaderPhone: '054 123 1234',
    meetingTime: 'Fridays @ 7:00 PM',
    description: 'Ministers through Methodist hymns and indigenous songs, encouraging congregational singing and evangelism. Objectives include preserving hymnody, training singers, and supporting outreach services.',
    announcements: ['Recording session scheduled.', 'Joint practice with Choir.']
  },
  {
    id: 'org7',
    name: "Children's Ministry",
    category: 'Children',
    leaderName: 'Sis. Abigail Mensah',
    leaderPhone: '026 456 7890',
    meetingTime: 'Sundays @ 8:00 AM',
    description: 'Catechesis and nurture of children in Scripture, prayer, and worship. Aims include teaching the faith, forming habits of devotion, partnering with parents, and ensuring a safe, welcoming environment.',
    announcements: ["Children's day performance practice."]
  },
  {
    id: 'org7b',
    name: 'MYF (Methodist Youth Fellowship)',
    category: 'MYF',
    leaderName: 'Bro. David Ofori',
    leaderPhone: '026 456 7890',
    meetingTime: 'Fridays @ 7:00 PM',
    description: 'Discipleship and leadership formation for youth and young adults. Objectives include Bible study, holy living, mission and service projects, and training for responsible citizenship.',
    announcements: ['Youth camp registration is open.']
  },
  {
    id: 'org8',
    name: "Church Choir",
    category: 'Music',
    leaderName: 'Choirmaster James',
    leaderPhone: '024 321 4321',
    meetingTime: 'Saturdays @ 5:00 PM',
    description: 'Leads the congregation in worship with hymns and anthems, upholding musical excellence. Aims include rehearsing liturgical music, nurturing musicianship, and supporting the church’s seasonal observances.',
    announcements: ['Robes to be washed before Easter.', 'New anthem sheets available.']
  },
  {
    id: 'org9',
    name: "Ushers",
    category: 'Service',
    leaderName: 'Sis. Elizabeth',
    leaderPhone: '050 987 6543',
    meetingTime: 'Last Saturday of Month @ 4:00 PM',
    description: 'A ministry of hospitality and order. Objectives include welcoming and seating congregants, ensuring safety and reverence, assisting with offerings, and facilitating smooth, worshipful services.',
    announcements: ['Roster for next month is out.', 'Training for new ushers on Saturday.']
  },
  {
    id: 'org10',
    name: "Wesley Praise",
    category: 'Music',
    leaderName: 'Bro. Michael',
    leaderPhone: '027 112 2334',
    meetingTime: 'Saturdays @ 6:30 PM',
    description: 'A contemporary praise team that leads the church in joyful, Spirit-led worship. Aims include cultivating excellence and spiritual maturity, composing and arranging songs, and supporting outreach events.',
    announcements: ['New instruments arrived.', 'Worship night coming up.']
  }
];
