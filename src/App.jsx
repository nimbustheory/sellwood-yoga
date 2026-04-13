import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info, ArrowLeft, Tag,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, TreePine, Flower2, CloudRain
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Sellwood Yoga, Portland OR
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "SELLWOOD",
  subtitle: "YOGA",
  tagline: "Welcoming Community. Thoughtful Practice. Real Life Yoga.",
  logoMark: "SY",
  logoImage: null,
  description: "A family-owned studio in the heart of historic Sellwood — passionate instructors, welcoming community, committed to helping you thrive.",
  heroLine1: "PRACTICE",
  heroLine2: "TOGETHER",

  address: { street: "7970 SE 13th Ave", city: "Portland", state: "OR", zip: "97202" },
  phone: "503-575-9982",
  email: "info@sellwoodyoga.com",
  neighborhood: "Sellwood, Portland",
  website: "https://sellwoodyoga.com",
  social: { instagram: "@sellwoodyoga", facebook: "SellwoodYoga" },

  theme: {
    accent:     { h: 155, s: 35, l: 38 },   // Forest green
    accentAlt:  { h: 32,  s: 55, l: 50 },   // Warm cedar
    warning:    { h: 12,  s: 65, l: 48 },    // Clay red
    primary:    { h: 28,  s: 18, l: 14 },    // Dark timber
    surface:    { h: 38,  s: 22, l: 97 },    // Warm linen
    surfaceDim: { h: 34,  s: 16, l: 93 },    // Soft clay
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
  },

  classCapacity: 22,
  specialtyCapacity: 16,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2a2218",
  textMuted: "#78705e",
  textFaint: "#a8a090",
  border: "#e6dfd4",
  borderLight: "#f0ebe2",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  STUDIO IMAGES — from sellwoodyoga.com (review & replace)
// ═══════════════════════════════════════════════════════════════
const STUDIO_IMAGES = {
  // Homepage hero / banners
  heroMain:    "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-homepage-legs-up-the-wall.jpeg",
  // Section banners
  headerTexture: "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-header-texture.png",
  workshops:   "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-homepage-workshops.jpg",
  retreats:    "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-align-retreats.jpeg",
  programs:    "https://sellwoodyoga.com/wp-content/uploads/2023/08/SellwoodYoga_33.png",
  // About page images
  aboutStudio1:"https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-about-us-1.png",
  aboutStudio2:"https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-studio-portland-oregon-about-us-2.png",
  aboutStudio3:"https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-studio-portland-oregon-about-us-3.png",
  // Classes page images
  classesDeck: "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-classes-outside-deck.jpg",
  classesInside:"https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-portland-oregon-classes-inside-studio.png",
  // Founders
  founders:    "https://sellwoodyoga.com/wp-content/uploads/2025/12/sellwood-yoga-studio-portland-oregon-savonn-wyland-bill-wyland.png",
  // Logos
  logoFull:    "https://sellwoodyoga.com/wp-content/uploads/2020/06/sellwood-yoga-logo-400x83.png",
  // Teacher headshots
  teachers: {
    savonnWyland:      "https://sellwoodyoga.com/wp-content/uploads/2025/12/savonn-wyland-sellwood-yoga-align-retreats.png",
    billWyland:        "https://sellwoodyoga.com/wp-content/uploads/2025/12/bill-wyland-sellwood-yoga.png",
    annieKobliska:     "https://sellwoodyoga.com/wp-content/uploads/2025/12/annie-kobliska-becker-sellwood-yoga.png",
    kariKemper:        "https://sellwoodyoga.com/wp-content/uploads/2025/12/kari-kemper-sellwood-yoga.png",
    lanaVilches:       "https://sellwoodyoga.com/wp-content/uploads/2025/12/lana-vilches-sellwood-yoga.png",
    margaretTownsend:  "https://sellwoodyoga.com/wp-content/uploads/2025/12/margaret-townsend-sellwood-yoga.png",
    rebeccaMendez:     "https://sellwoodyoga.com/wp-content/uploads/2025/12/rebecca-mendez-sellwood-yoga.png",
    lizWarrens:        "https://sellwoodyoga.com/wp-content/uploads/2025/12/liz-warrens-sellwood-yoga.png",
    lauraLiFongYee:    "https://sellwoodyoga.com/wp-content/uploads/2025/12/laura-li-fong-yee-sellwood-yoga.png",
    nicoleCranstonCrow:"https://sellwoodyoga.com/wp-content/uploads/2025/12/nicole-cranston-crow-sellwood-yoga.png",
    sallyShuey:        "https://sellwoodyoga.com/wp-content/uploads/2025/12/sally-shuey-sellwood-yoga.png",
    roseyWyland:       "https://sellwoodyoga.com/wp-content/uploads/2025/12/rosey-wyland-sellwood-yoga.png",
    quinnShuff:        "https://sellwoodyoga.com/wp-content/uploads/2025/12/quinn-shuff-sellwood-yoga.png",
    monikaGold:        "https://sellwoodyoga.com/wp-content/uploads/2026/01/Monika-Gold-Headshot.png",
    victoriaPustynsky: "https://sellwoodyoga.com/wp-content/uploads/2026/01/Victoria-Pustynsky.png",
    ashleyFullman:     "https://sellwoodyoga.com/wp-content/uploads/2025/12/ashley-fullman-sajadi-sellwood-yoga.png",
    courtneyHans:      "https://sellwoodyoga.com/wp-content/uploads/2026/03/Courtney-Hans.png",
    crystalCombs:      "https://sellwoodyoga.com/wp-content/uploads/2026/03/Crystal-Coombs.png",
  },
};

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Sellwood Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Savonn", lastName: "Wyland", photo: STUDIO_IMAGES.teachers.savonnWyland, role: "Co-Founder & Instructor", certs: ["E-RYT-500", "YACEP"], specialties: ["Vinyasa Flow", "Restorative", "Teacher Training"], yearsTeaching: 15, bio: "Savonn co-founded Sellwood Yoga with her husband Bill to create a welcoming, community-centered space. She leads teacher trainings, retreats, and the Pause menopause wellness programs — blending movement, mindfulness, and real-life wisdom." },
  { id: "t2", firstName: "Bill", lastName: "Wyland", photo: STUDIO_IMAGES.teachers.billWyland, role: "Co-Founder & Instructor", certs: ["RYT-200", "Functional Movement"], specialties: ["Functional Strength & Yoga", "Hatha", "Stretch & Strengthen"], yearsTeaching: 12, bio: "Bill brings a functional fitness perspective to yoga, teaching classes that build muscular strength, endurance, and mobility. His clear, precise guidance helps students refine form and find their optimal alignment." },
  { id: "t3", firstName: "Kari", lastName: "Kemper", photo: STUDIO_IMAGES.teachers.kariKemper, role: "Instructor", certs: ["RYT-500", "Vinyasa Specialist"], specialties: ["Vinyasa Flow", "Meditation", "Extended Practice"], yearsTeaching: 10, bio: "Kari's extended practice sessions weave Vinyasa flow, guided meditation, and restorative yoga into a complete two-hour experience. She creates space for students to feel clear, grounded, and deeply nourished." },
  { id: "t4", firstName: "Lana", lastName: "Vilches", photo: STUDIO_IMAGES.teachers.lanaVilches, role: "Instructor", certs: ["RYT-200", "Yin Yoga Certified"], specialties: ["Vinyasa to Yin", "Restorative", "Sound Healing"], yearsTeaching: 6, bio: "Lana's Vinyasa to Yin classes offer a creative blend of dynamic movement followed by grounding yin poses. She emphasizes breath, spinal mobility, and often incorporates sound healing with live cello performances." },
  { id: "t5", firstName: "Margaret", lastName: "Townsend", photo: STUDIO_IMAGES.teachers.margaretTownsend, role: "Instructor", certs: ["E-RYT-500", "Pranayama Specialist"], specialties: ["Breathwork", "Meditation", "Hatha"], yearsTeaching: 18, bio: "Margaret is a longtime Portland breathwork teacher and author of The Breathwork Companion. Her Community Breathe workshops help students shift their nervous system from stressed to steady through simple guided breathing." },
  { id: "t6", firstName: "Rebecca", lastName: "Mendez", photo: STUDIO_IMAGES.teachers.rebeccaMendez, role: "Instructor", certs: ["RYT-200", "Grief & Trauma Informed"], specialties: ["Restorative", "Yoga for Grief", "Gentle Yoga"], yearsTeaching: 8, bio: "Rebecca leads the monthly Yoga for Grief Relief workshops, creating a safe and compassionate space for students to explore gentle yoga, meditation, and breath awareness as tools for healing." },
  { id: "t7", firstName: "Liz", lastName: "Warrens", photo: STUDIO_IMAGES.teachers.lizWarrens, role: "Instructor", certs: ["RYT-200", "Vinyasa Flow"], specialties: ["Vinyasa Flow", "Morning Yoga", "River Rituals"], yearsTeaching: 7, bio: "Liz brings energy and warmth to her morning classes, blending mobility, balancing, and strengthening movements with Vinyasa-inspired sequencing. She also leads the River Ritual yoga + sauna experiences at Sellwood Riverfront Park." },
  { id: "t8", firstName: "Annie", lastName: "Kobliska-Becker", photo: STUDIO_IMAGES.teachers.annieKobliska, role: "Instructor", certs: ["RYT-500", "Iyengar Influenced"], specialties: ["Hatha", "Yoga Basics", "Healthy Spine"], yearsTeaching: 14, bio: "Annie draws from Iyengar, Vinyasa, and classical Hatha yoga principles. Her Yoga for a Healthy Spine class helps students relieve tension, strengthen their core, and develop preventative practices for long-term back health." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Morning Vinyasa Flow", type: "VINYASA",
  style: "Vinyasa Flow", temp: "Room Temp", duration: 60,
  description: "An ever-evolving, creative practice that integrates breath and movement, awareness and alignment. Linking postures in a mindful sequence influenced by Hatha traditions.",
  intention: "Move with your breath. Let each transition be as intentional as each pose.",
  teacherTip: "Honor where your body is today — there's no destination, only the practice itself.",
  playlist: "Pacific Morning — Kari's Spotify",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Functional Strength & Yoga", type: "STRENGTH", style: "Functional", temp: "Room Temp", duration: 60, description: "A dynamic mixed-level class incorporating mindful progressions to build muscular strength, endurance, flexibility, and focus.", intention: "Find your edge between effort and ease.", teacherTip: "Clear form is more important than heavy weight. Quality over quantity." },
  { id: "p-y2", date: offsetDate(-2), name: "Morning Yin", type: "YIN", style: "Yin", temp: "Room Temp", duration: 75, description: "Seated and lying-down passive stretches held for 3–5 minutes. Reaching deeper tissues — fascia, ligaments, and joints.", intention: "Surrender is not giving up — it's letting in.", teacherTip: "Let gravity do the work. Find your edge, then breathe." },
  { id: "p-y3", date: offsetDate(-3), name: "Slow Flow", type: "FLOW", style: "Slow Flow", temp: "Room Temp", duration: 60, description: "A gentler, more relaxed pace with time to settle into each pose, focus on breath, and explore what feels right in your body.", intention: "Through slowness, we find depth." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Restorative Yoga", type: "RESTORATIVE", style: "Restorative", temp: "Room Temp", duration: 75, description: "A restful, prop-supported practice using blankets, bolsters, sandbags, and blocks. Passive poses held for 5–10 minutes with minimal movement.", intention: "Rest is not a reward — it's a practice.", teacherTip: "Bring an extra layer. You'll cool down as you settle in." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:30", type: "Morning Yoga", coach: "Liz Warrens", capacity: 22, registered: 18, waitlist: 0 },
  { id: "cl2", time: "08:00", type: "Vinyasa Flow", coach: "Kari Kemper", capacity: 22, registered: 22, waitlist: 2 },
  { id: "cl3", time: "09:30", type: "Hatha Yoga", coach: "Annie Kobliska-Becker", capacity: 22, registered: 16, waitlist: 0 },
  { id: "cl4", time: "10:45", type: "Morning Yin", coach: "Lana Vilches", capacity: 18, registered: 12, waitlist: 0 },
  { id: "cl5", time: "12:00", type: "Functional Strength & Yoga", coach: "Bill Wyland", capacity: 22, registered: 20, waitlist: 0 },
  { id: "cl6", time: "16:30", type: "Yoga Basics", coach: "Annie Kobliska-Becker", capacity: 22, registered: 14, waitlist: 0 },
  { id: "cl7", time: "17:45", type: "Vinyasa Flow", coach: "Savonn Wyland", capacity: 22, registered: 22, waitlist: 3 },
  { id: "cl8", time: "19:00", type: "Slow Flow", coach: "Lana Vilches", capacity: 18, registered: 15, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:30", type: "Morning Yoga", coach: "Liz" }, { time: "08:00", type: "Vinyasa Flow", coach: "Kari" }, { time: "09:30", type: "Hatha Yoga", coach: "Annie" }, { time: "10:45", type: "Morning Yin", coach: "Lana" }, { time: "12:00", type: "Stretch & Strengthen", coach: "Bill" }, { time: "16:30", type: "Yoga Basics", coach: "Annie" }, { time: "17:45", type: "Vinyasa Flow", coach: "Savonn" }] },
  { day: "Tuesday", classes: [{ time: "06:30", type: "Morning Yoga", coach: "Liz" }, { time: "08:00", type: "Functional Strength", coach: "Bill" }, { time: "09:30", type: "Vinyasa Flow", coach: "Savonn" }, { time: "12:00", type: "Yoga for Healthy Spine", coach: "Annie" }, { time: "16:30", type: "Hatha Yoga", coach: "Kari" }, { time: "17:45", type: "Vinyasa to Yin", coach: "Lana" }] },
  { day: "Wednesday", classes: [{ time: "06:30", type: "Morning Yoga", coach: "Liz" }, { time: "08:00", type: "Vinyasa Flow", coach: "Kari" }, { time: "09:30", type: "Restorative", coach: "Rebecca" }, { time: "12:00", type: "Stretch & Strengthen", coach: "Bill" }, { time: "16:30", type: "Slow Flow", coach: "Lana" }, { time: "17:45", type: "Vinyasa Flow", coach: "Savonn" }] },
  { day: "Thursday", classes: [{ time: "06:30", type: "Morning Yoga", coach: "Liz" }, { time: "08:00", type: "Functional Strength", coach: "Bill" }, { time: "09:30", type: "Hatha Yoga", coach: "Annie" }, { time: "10:45", type: "Yoga for Healthy Aging", coach: "Margaret" }, { time: "12:00", type: "Vinyasa Flow", coach: "Kari" }, { time: "17:45", type: "Vinyasa to Yin", coach: "Lana" }] },
  { day: "Friday", classes: [{ time: "06:30", type: "Morning Yoga", coach: "Liz" }, { time: "08:00", type: "Vinyasa Flow", coach: "Savonn" }, { time: "09:30", type: "Morning Yin", coach: "Lana" }, { time: "12:00", type: "Yoga Basics", coach: "Annie" }, { time: "17:30", type: "Happy Hour Vinyasa", coach: "Kari" }] },
  { day: "Saturday", classes: [{ time: "08:00", type: "Saturday Yoga", coach: "Bill" }, { time: "09:30", type: "Vinyasa Flow", coach: "Savonn" }, { time: "11:00", type: "Restorative", coach: "Rebecca" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Vinyasa Flow", coach: "Kari" }, { time: "10:00", type: "Slow Flow", coach: "Lana" }, { time: "17:00", type: "Yoga for Healthy Spine", coach: "Annie" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Jen R.", milestone: "200 Classes", message: "Two hundred classes at Sellwood Yoga. This studio truly feels like home. Grateful for this community.", date: today, celebrations: 37 },
  { id: "cf2", user: "Marcus T.", milestone: "30-Day Streak", message: "30 days on the mat! Morning Yin with Lana changed my entire relationship with rest.", date: today, celebrations: 22 },
  { id: "cf3", user: "Sophie K.", milestone: "First Crow Pose!", message: "Finally held crow today in Kari's class! The outdoor deck made it feel magical.", date: offsetDate(-1), celebrations: 28 },
  { id: "cf4", user: "David L.", milestone: "1 Year Member", message: "One year as a member. Bill's Functional Strength class has genuinely transformed my mobility.", date: offsetDate(-1), celebrations: 45 },
  { id: "cf5", user: "Anna M.", milestone: "First Class", message: "Just took my first ever yoga class at Sellwood Yoga. Savonn was so welcoming. Already signed up for tomorrow!", date: offsetDate(-2), celebrations: 19 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: TreePine, color: T.accent },
  "100 Classes": { icon: Mountain, color: T.success },
  "200 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Crow Pose": { icon: Star, color: "#6366f1" },
  "Outdoor Deck Class": { icon: Flower2, color: "#0ea5e9" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Community Breathe with Margaret Townsend", date: "2026-03-28", startTime: "15:30", type: "Workshop", description: "Discover how simple, guided breathing can shift your nervous system from stressed to steady. Margaret leads a nourishing, all-levels session designed to settle the mind and soften tension.", fee: 40, maxParticipants: 20, registered: 14, status: "Open" },
  { id: "ev2", name: "Gong Sound Bath with Laura Li Fong Yee", date: "2026-04-16", startTime: "19:00", type: "Sound Bath", description: "A healing sound bath with crystal bowls, chimes, and deep vibrational healing. Rest comfortably on yoga props as sound washes over you — a perfect reset.", fee: 40, maxParticipants: 20, registered: 16, status: "Open" },
  { id: "ev3", name: "Restorative Yoga with Live Cello", date: "2026-05-10", startTime: "16:00", type: "Special Event", description: "An immersive blend of restorative yoga and live cello with Lana Vilches and cellist Elizabeth Byrd. Combining soothing sound, mindful rest, and deep relaxation.", fee: 40, maxParticipants: 22, registered: 11, status: "Registration Open" },
  { id: "ev4", name: "River Ritual: Yoga & Sauna + River Plunge", date: "2026-05-02", startTime: "13:00", type: "Adventure", description: "Starts at Sellwood Yoga with a Vinyasa Flow practice, then moves to a private group sauna and river plunging at Sellwood Riverfront Park.", fee: 60, maxParticipants: 16, registered: 12, status: "Registration Open" },
  { id: "ev5", name: "Extended Practice: Flow, Meditate, Restore", date: "2026-04-26", startTime: "16:00", type: "Workshop", description: "Take two hours to flow with Vinyasa Yoga, pause in seated meditation, and restore with Restorative Yoga. Leave feeling clear, grounded, and deeply nourished.", fee: 45, maxParticipants: 22, registered: 8, status: "Registration Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Single Class", type: "drop-in", price: 25, period: "per class", features: ["1 class credit", "Valid for 1 month", "Studio + Livestream access"], popular: false },
  { id: "m2", name: "5 Class Pass", type: "pack", price: 115, period: "5 classes", features: ["5 class credits", "Valid for 2 months", "Studio + Livestream access", "Great for explorers"], popular: false },
  { id: "m3", name: "10 Class Pass", type: "pack", price: 225, period: "10 classes", features: ["10 class credits", "Valid for 6 months", "Studio + Livestream access", "Best value per class"], popular: false },
  { id: "m4", name: "Monthly Unlimited", type: "unlimited", price: 145, period: "/month", features: ["Unlimited classes", "Studio + Livestream access", "Member workshop discounts", "3 month min commitment", "14-day cancellation notice"], popular: true },
  { id: "m5", name: "6 Classes/Month", type: "limited", price: 105, period: "/month", features: ["6 classes per month", "Studio + Livestream access", "Member workshop discounts", "3 month min commitment", "14-day cancellation notice"], popular: false },
  { id: "m6", name: "1 Month Unlimited", type: "pass", price: 175, period: "one month", features: ["Unlimited for 30 days", "No commitment", "Studio + Livestream access", "Perfect to try us out"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Outdoor Deck is Open!", message: "Weather permitting, many classes now offer indoor + outdoor options on our beautiful wooden yoga deck. Reserve your spot on the deck!", type: "celebration", pinned: true },
  { id: "a2", title: "Pause & Pause Plus Programs", message: "Our menopause wellness programs with Savonn Wyland and Dr. Marsha Hamilton are now enrolling. Perimenopause and postmenopause tracks available.", type: "info", pinned: false },
  { id: "a3", title: "Happy Hour Vinyasa — Fridays!", message: "Shake off the workweek and flow into the weekend. Come solo or bring a friend. Special $20 drop-in rate.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Jen Richardson", email: "jen@email.com", membership: "Monthly Unlimited", status: "active", joined: "2022-04-10", checkIns: 412, lastVisit: today },
  { id: "mem2", name: "Marcus Torres", email: "marcus@email.com", membership: "Monthly Unlimited", status: "active", joined: "2023-09-01", checkIns: 287, lastVisit: today },
  { id: "mem3", name: "Sophie Kim", email: "sophie@email.com", membership: "Monthly Unlimited", status: "active", joined: "2024-01-15", checkIns: 156, lastVisit: offsetDate(-1) },
  { id: "mem4", name: "David Lee", email: "david@email.com", membership: "Monthly Unlimited", status: "active", joined: "2025-03-24", checkIns: 98, lastVisit: today },
  { id: "mem5", name: "Anna Morales", email: "anna@email.com", membership: "10 Class Pass", status: "active", joined: "2026-01-10", checkIns: 7, lastVisit: offsetDate(-2) },
  { id: "mem6", name: "Chris Berg", email: "chris@email.com", membership: "6 Classes/Month", status: "active", joined: "2025-06-01", checkIns: 52, lastVisit: offsetDate(-3) },
  { id: "mem7", name: "Priya Patel", email: "priya@email.com", membership: "Monthly Unlimited", status: "frozen", joined: "2024-05-01", checkIns: 134, lastVisit: offsetDate(-28) },
  { id: "mem8", name: "Rachel Nguyen", email: "rachel@email.com", membership: "5 Class Pass", status: "active", joined: "2026-02-15", checkIns: 3, lastVisit: offsetDate(-6) },
];

const ADMIN_METRICS = {
  activeMembers: 168, memberChange: 9,
  todayCheckIns: 62, weekCheckIns: 378,
  monthlyRevenue: 24350, revenueChange: 7.8,
  renewalRate: 89.2, workshopRevenue: 3100,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 72, avg: 10 }, { day: "Tue", total: 58, avg: 10 },
    { day: "Wed", total: 65, avg: 11 }, { day: "Thu", total: 60, avg: 10 },
    { day: "Fri", total: 52, avg: 10 }, { day: "Sat", total: 48, avg: 16 },
    { day: "Sun", total: 38, avg: 13 },
  ],
  revenue: [
    { month: "Sep", revenue: 19200 }, { month: "Oct", revenue: 20100 },
    { month: "Nov", revenue: 21500 }, { month: "Dec", revenue: 20800 },
    { month: "Jan", revenue: 22400 }, { month: "Feb", revenue: 23600 },
    { month: "Mar", revenue: 24350 },
  ],
  classPopularity: [
    { name: "6:30 AM", pct: 82 }, { name: "8:00 AM", pct: 96 },
    { name: "9:30 AM", pct: 74 }, { name: "10:45 AM", pct: 68 },
    { name: "12:00 PM", pct: 90 }, { name: "4:30 PM", pct: 65 },
    { name: "5:45 PM", pct: 98 }, { name: "7:00 PM", pct: 82 },
  ],
  membershipBreakdown: [
    { name: "Monthly Unlimited", value: 78, color: T.accent },
    { name: "6 Classes/Month", value: 34, color: T.success },
    { name: "Class Passes", value: 42, color: T.warning },
    { name: "Drop-In", value: 14, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  PAGE HERO — Reusable hero banner with background image
// ═══════════════════════════════════════════════════════════════
function PageHero({ title, subtitle, image }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", height: 208 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)", willChange: "transform" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, ${T.bgDim} 100%)` }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 20px 18px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, margin: 0, color: "#fff" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ background: `linear-gradient(165deg, ${T.bg} 0%, hsl(28,22%,18%) 100%)`, color: "#fff", padding: "32px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.heroMain})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,.3) 0%, transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 50, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#b8a898", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#6b6050", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b6050", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap" }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image={STUDIO_IMAGES.classesInside} />
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allPractices.map(p => (
            <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div>
      <PageHero title="Schedule" subtitle="Reserve your spot — classes fill up fast" image={STUDIO_IMAGES.classesDeck} />
      <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Restorative") || cls.type.includes("Sound") || cls.type.includes("Happy");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 10, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => {
    setSaved("log");
    setTimeout(() => setSaved(null), 2000);
    setReflection({ energy: 4, focus: 4, notes: "" });
  };

  const streakDays = 14;
  const totalClasses = 98;

  return (
    <div>
      <PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image={STUDIO_IMAGES.aboutStudio3} />
      <div style={{ padding: "16px 16px 0" }}>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>7</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reflection Form */}
      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <CloudRain size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, { icon: Icon, color }], i) => {
            const earned = i < 7;
            return (
              <div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : T.borderLight}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.5 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: earned ? `${color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <Icon size={22} color={earned ? color : T.textFaint} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: T.text, margin: 0 }}>{name}</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{earned ? "Earned" : "Locked"}</p>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div>
      <PageHero title="Community" subtitle="Celebrate each other's milestones and growth" image={STUDIO_IMAGES.workshops} />
      <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4a4030", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  return (
    <div>
      <PageHero title="Teachers" subtitle="Meet the Sellwood Yoga teaching team" image={STUDIO_IMAGES.aboutStudio2} />
      <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.firstName} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#5a5040", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div>
      <PageHero title="Membership" subtitle="Find your path to practice" image={STUDIO_IMAGES.headerTexture} />
      <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Popular
              </div>
            )}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a5040" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div>
      <PageHero title="Events" subtitle="Workshops, sound baths, and special offerings" image={STUDIO_IMAGES.workshops} />
      <div style={{ padding: "16px 16px 0" }}>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(28,22%,18%))`, padding: "20px 18px", color: "#fff" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#b8a898" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#5a5040", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={`$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              Register Now
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+9 registrations", positive: true, icon: Award, color: "#6366f1" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3528" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2218", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3528" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2218", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2218", border: "1px solid #3a3528", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Time Popularity">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ADMIN_CHARTS.classPopularity.map((slot, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", width: 64, textAlign: "right" }}>{slot.name}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#3a3528", overflow: "hidden" }}>
                  <div style={{ width: `${slot.pct}%`, height: "100%", borderRadius: 4, background: slot.pct >= 90 ? T.warning : T.accent }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: slot.pct >= 90 ? T.warning : T.accent, width: 36 }}>{slot.pct}%</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => {
    if (filter !== "all" && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1f2218", border: "1px solid #3a3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1f2218", color: filter === f ? "#fff" : "#9ca3af" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3a3528" }}>
              {["Member", "Membership", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #3a3528" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #3a3528" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #3a3528" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#3a3528", color: "#9ca3af" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>{formatDateShort(ev.date)} · {ev.type} · ${ev.fee}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#151210", border: "1px solid #3a3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#151210", border: "1px solid #3a3528", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "members", "class cards", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#3a3528", color: audience === a ? "#fff" : "#9ca3af" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Sent Broadcasts</h3>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 10, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "#fff", margin: 0, fontSize: 14, fontWeight: 600 }}>{a.title}</h4>
              {a.pinned && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>PINNED</span>}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Pricing & Plans</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> Add Plan
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#1f2218", border: `1px solid ${tier.popular ? T.accent : "#3a3528"}`, borderRadius: 12, padding: 18, position: "relative" }}>
            {tier.popular && (
              <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>POPULAR</span>
            )}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", fontSize: 12, color: "#d1d5db" }}>
                  <CircleCheck size={12} color={T.accent} style={{ flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #3a3528", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Disable</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice: p, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isToday = p.date === today;
  const typeColors = { VINYASA: T.accent, STRENGTH: T.success, YIN: "#6366f1", FLOW: T.success, RESTORATIVE: "#0ea5e9", SPECIAL: T.warning };
  const typeColor = typeColors[p.type] || T.accent;

  return (
    <div onClick={onToggle} style={{ background: isFeatured ? `linear-gradient(135deg, ${T.bg}, hsl(28,22%,18%))` : T.bgCard, border: isFeatured ? "none" : `1px solid ${T.border}`, borderRadius: 14, padding: isFeatured ? "20px 18px" : "16px 18px", cursor: onToggle ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 4, background: `${typeColor}20`, color: typeColor }}>{p.type}</span>
        {p.style && <span style={{ fontSize: 11, color: isFeatured ? "#b8a898" : T.textMuted }}>{p.style}</span>}
        {isToday && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginLeft: "auto" }}>Today</span>}
        {!isToday && <span style={{ fontSize: 11, color: isFeatured ? "#71717a" : T.textFaint, marginLeft: "auto" }}>{formatDateShort(p.date)}</span>}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isFeatured ? 26 : 20, margin: "0 0 6px", color: isFeatured ? "#fff" : T.text, fontWeight: 600 }}>{p.name}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: isFeatured ? "#9ca3af" : T.textMuted, marginBottom: 10 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {p.duration} min</span>
        {p.temp && <span>{p.temp}</span>}
      </div>
      <p style={{ fontSize: 13, color: isFeatured ? "#b8a898" : "#6b6050", lineHeight: 1.6, margin: 0 }}>{p.description}</p>
      {(isFeatured || expanded) && p.intention && (
        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: isFeatured ? "rgba(255,255,255,.05)" : T.bgDim, borderLeft: `3px solid ${T.accent}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.accent, margin: "0 0 4px" }}>Intention</p>
          <p style={{ fontSize: 13, color: isFeatured ? "#d1c8b8" : T.text, margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>{p.intention}</p>
        </div>
      )}
      {(isFeatured || expanded) && p.teacherTip && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: isFeatured ? "rgba(255,255,255,.03)" : T.bgDim }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.success, margin: "0 0 4px" }}>Teacher Tip</p>
          <p style={{ fontSize: 13, color: isFeatured ? "#b8a898" : "#6b6050", margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p>
        </div>
      )}
      {isFeatured && p.playlist && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 12, color: "#71717a" }}>
          <Music size={14} /> {p.playlist}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 12px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={36} color={T.textFaint} style={{ margin: "0 auto 8px" }} />
      <p style={{ color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 13, color: T.accent, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, margin: 0, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ background: `linear-gradient(165deg, ${T.bg}, hsl(28,22%,18%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, background: "radial-gradient(circle at 80% 30%, rgba(255,255,255,.4) 0%, transparent 50%)" }} />
      <div style={{ position: "relative" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600 }}>New to Sellwood Yoga?</h3>
        <p style={{ fontSize: 13, color: "#b8a898", margin: "0 0 16px", lineHeight: 1.5 }}>A family-owned studio in Portland's Sellwood neighborhood. Passionate instructors and a welcoming community. Come practice with us.</p>
        <button onClick={() => setPage("membership")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, cursor: "pointer" }}>
          View Memberships <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1f2218", border: "1px solid #3a3528", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>JR</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Jen Richardson</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Monthly Unlimited · Since Apr 2022</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Workshops", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Practice Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Studio</h3>
          <div style={{ fontSize: 13, color: T.textMuted }}>
            <p style={{ margin: "0 0 4px" }}>{STUDIO_CONFIG.address.street}</p>
            <p style={{ margin: "0 0 4px" }}>{STUDIO_CONFIG.address.city}, {STUDIO_CONFIG.address.state} {STUDIO_CONFIG.address.zip}</p>
            <p style={{ margin: "0 0 4px" }}>{STUDIO_CONFIG.phone}</p>
            <p style={{ margin: "0 0 8px" }}>{STUDIO_CONFIG.email}</p>
          </div>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "8px 0 0" }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", title: "Class Confirmed", message: "You're registered for Morning Vinyasa Flow at 8:00 AM tomorrow with Kari.", time: "2h ago", read: false },
    { id: "n2", title: "Community Celebration", message: "Marcus T. hit a 30-Day Streak! Send some love.", time: "5h ago", read: false },
    { id: "n3", title: "Workshop Reminder", message: "Community Breathe with Margaret is this Saturday. Don't forget to register!", time: "1d ago", read: true },
    { id: "n4", title: "Milestone Unlocked!", message: "You've earned the 50 Classes badge. Keep growing!", time: "3d ago", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ padding: "14px 16px", borderRadius: 12, background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.borderLight : T.accentBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: T.text }}>{n.title}</h4>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />}
              </div>
              <p style={{ fontSize: 13, color: "#6b6050", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p>
              <p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    onConfirm(classData);
    setConfirmed(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: 20, width: "90%", maxWidth: 360, padding: "28px 24px", textAlign: "center" }}>
        {confirmed ? (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Check size={28} color={T.accent} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 6px" }}>You're In!</h3>
            <p style={{ fontSize: 13, color: T.textMuted }}>See you on the mat.</p>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px" }}>Confirm Reservation</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 20px" }}>Reserve your spot</p>
            <div style={{ background: T.bgDim, borderRadius: 12, padding: 16, textAlign: "left", marginBottom: 20 }}>
              <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 4px" }}>{classData.type}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 2px" }}>with {classData.coach}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>
                {classData.dayLabel || formatDateShort(classData.date || today)} · {fmtTime(classData.time)}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.textMuted, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Playfair Display', serif" }}>Reserve</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function App({ onAdminChange, initialAdmin = false }) {
  const [page, setPage] = useState(initialAdmin ? "admin-dashboard" : "home");
  const [isAdmin, setIsAdmin] = useState(initialAdmin);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [page]);
  const [feedCelebrations, setFeedCelebrations] = useState({});

  const registerForClass = useCallback((classData) => {
    setClassRegistrations(prev => ({ ...prev, [classData.id]: (prev[classData.id] || 0) + 1 }));
  }, []);

  const openReservation = useCallback((classData) => {
    setReservationClass(classData);
  }, []);

  const celebrateFeed = useCallback((id) => {
    setFeedCelebrations(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Classes", icon: CalendarDays },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "community", label: "Community", icon: Heart },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "events", label: "Events", icon: PartyPopper },
    { id: "membership", label: "Membership", icon: CreditCard },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-members", label: "Members", icon: UserCheck },
    { id: "admin-teachers", label: "Teachers", icon: Users },
    { id: "admin-events", label: "Events", icon: PartyPopper },
    { id: "admin-pricing", label: "Pricing", icon: Tag },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
  ];

  const isMoreActive = moreItems.some(item => page === item.id);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "events": return <EventsPage />;
      case "membership": return <MembershipPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#151210", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff" }}>
          {/* Admin Top Bar */}
          <div style={{ flexShrink: 0, background: `linear-gradient(135deg, ${T.bg}, hsl(28,22%,18%))`, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #3a3528" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); onAdminChange?.(false); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <ArrowLeft size={16} /> Back to LUMI
              </button>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", color: "#fff" }}>Sellwood Yoga Demo</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center", flex: 1, margin: "0 24px", lineHeight: 1.4 }}>
              Live interactive demo built for <strong style={{ color: "#fff" }}>Sellwood Yoga</strong>. This link is not publicly listed. This prototype includes copyrighted images that are not intended for publication. They will be replaced with media chosen by the client and nothing will be published without expressed permission from rights holders.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Sparkles size={16} color="#fff" />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700, letterSpacing: "0.05em" }}>LUMI</span>
            </div>
          </div>
          {/* Admin Body */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <aside style={{ width: 240, background: "#1a1714", borderRight: "1px solid #3a3528", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "16px 14px", borderBottom: "1px solid #3a3528" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
                    <span style={{ display: "block", fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Portal</span>
                  </div>
                </div>
              </div>
              <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
                {adminTabs.map(tab => {
                  const active = page === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                      <tab.icon size={18} />
                      <span>{tab.label}</span>
                      {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                    </button>
                  );
                })}
              </nav>
              <div style={{ borderTop: "1px solid #3a3528", padding: "10px 8px" }}>
                <button onClick={() => { setIsAdmin(false); setPage("home"); onAdminChange?.(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  <LogOut size={18} />
                  <span>Exit Admin</span>
                </button>
              </div>
            </aside>
            <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
              {renderPage()}
            </main>
          </div>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ maxWidth: 390, margin: "0 auto", height: "100%", minHeight: "100vh", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <header style={{ flexShrink: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); onAdminChange?.(true); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
              <Shield size={20} />
            </button>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto" }}>
          {renderPage()}
        </main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ flexShrink: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
