export type LangCode = "th" | "en";

type Dictionary = Record<string, string>;

export const languages: { code: LangCode; label: string; flag: string }[] = [
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const en: Dictionary = {
  "common.askAI": "Ask AI", "common.back": "Back", "common.openMap": "Open map", "common.send": "Send",
  "chat.placeholder": "Ask about an event or race weekend…",
  "feed.title": "Feed", "feed.nav.calendar": "Calendar", "feed.tab.feed": "Feed", "feed.tab.rank": "Ranking",
  "feed.addPhoto": "Add photo", "feed.checkedInAt": "checked in at", "feed.composer": "Share an update", "feed.daysAgo": "days ago", "feed.demo": "Demo", "feed.editName": "Edit display name", "feed.hoursAgo": "hours ago", "feed.imageTooLarge": "Image must be smaller than 5 MB", "feed.justNow": "Just now", "feed.kudos": "Kudos", "feed.post": "Post", "feed.rankSub": "Points from event check-ins", "feed.rankTitle": "Leaderboard", "feed.removePhoto": "Remove photo", "feed.sharedToFeed": "Shared to the feed", "feed.uploading": "Uploading…", "feed.viewFeed": "View feed", "feed.you": "You",
  "footer.ai": "Sport Buddy", "footer.assistance": "Assistance", "footer.calendar": "Calendar", "footer.description": "Nan Game On keeps sports festivals, race weekends, and community updates together.", "footer.fax": "Fax", "footer.home": "Home", "footer.links": "Quick links", "footer.organization": "Nan Provincial Sports", "footer.passport": "Passport", "footer.phone": "Phone", "footer.rewards": "Rewards", "footer.safetyNote": "Check official event notices before travelling or competing.", "footer.safetyTitle": "Race-day note",
  "plan.aiFallback": "Local race-weekend plan", "sport.aiPlan": "AI race-weekend plan",
  "rewards.close": "Close", "rewards.codeHint": "Show this code to the partner during the event.", "rewards.codeTitle": "Reward code", "rewards.cost": "points", "rewards.demoNote": "Reward redemption is a prototype.", "rewards.need": "Need", "rewards.open": "Open rewards", "rewards.redeem": "Redeem", "rewards.redeemed": "Redeemed", "rewards.sub": "Redeem points earned from verified check-ins.", "rewards.title": "Rewards", "rewards.yourPoints": "Your points",
  "sport.badges": "Badges", "sport.botHelp": "Game On Help", "sport.botSport": "Sport Buddy", "sport.calendar": "Calendar", "sport.chatGreeting": "Ask about a festival, race preparation, or nearby race-weekend stops.", "sport.chatSuggest1": "What races are coming up?", "sport.chatSuggest2": "How should I prepare for rain?", "sport.chatSuggest3": "Recommend stops near an event", "sport.checkedIn": "Checked in", "sport.checkin": "Check in", "sport.checkinAntiFake": "Check in only at the event venue.", "sport.days": "days", "sport.daysLeft": "days left", "sport.helpGreeting": "Ask how to use your Game On passport, calendar, check-ins, and rewards.", "sport.helpSuggest1": "How do check-ins work?", "sport.helpSuggest2": "How are badges earned?", "sport.helpSuggest3": "How do points work?", "sport.liveNow": "Live now", "sport.nextEvent": "Next event", "sport.passport": "Passport", "sport.pastEvent": "Past event", "sport.planning": "Planning…", "sport.planTrip": "Plan a race weekend", "sport.points": "Points", "sport.raceDay": "Race day", "sport.rewards": "Rewards", "sport.tagline": "Play Nan all year", "sport.today": "Today", "sport.tripAround": "Racecation plan", "sport.unverified": "Dates and details may change; confirm with the organizer.", "sport.venue": "Venue", "sport.viewEvent": "View event", "sport.when": "When", "sport.road": "Road", "sport.trail": "Trail", "sport.cycling": "Cycling", "sport.longboat": "Longboat", "sport.compete": "Compete", "sport.spectate": "Spectate", "weather.rainChance": "Rain chance",
  // Demo login / role picker
  "login.badge": "Demo", "login.title": "Select your role", "login.subtitle": "Choose a role to continue — no sign-up required.", "login.choose": "Choose",
  "role.demoRole": "Role", "role.changeRole": "Change role", "role.logout": "Log out",
  "role.user.name": "User", "role.user.desc": "Follow events, collect passport stamps, and earn rewards.",
  "role.organizer.name": "Organizer", "role.organizer.desc": "Manage your events and event check-ins.",
  "role.admin.name": "Admin", "role.admin.desc": "Review events, organizers, and users.",
  // Management shell (organizer + admin)
  "mgmt.organizer.workspace": "Organizer workspace", "mgmt.admin.workspace": "Administrator workspace", "mgmt.demoPreview": "Demo preview",
  "mgmt.demoBadge": "Demo management preview", "mgmt.adminDemoBadge": "Administrator demo preview",
  "mgmt.nav.overview": "Overview", "mgmt.nav.myEvents": "My events", "mgmt.nav.createEvent": "Create event", "mgmt.nav.checkins": "Event check-ins", "mgmt.nav.allEvents": "All events", "mgmt.nav.users": "Organizers & users",
  "season.green.short": "Green season", "season.cool.short": "Cool season", "season.hot.short": "Hot season",
  // Organizer overview
  "org.title": "Run your event workspace", "org.intro": "All event data comes from the published Nan Game On sport schedule. Manage events, check-ins, and their status from here.", "org.createCta": "Create new event",
  "org.metric.published": "Published event records", "org.metric.competitionReady": "Competition-ready", "org.metric.needsReview": "Needs review",
  "org.queue.title": "My event queue", "org.queue.sub": "Competition-capable entries from the existing sport schedule.", "org.viewAll": "View all", "org.readonly": "Read-only demo",
  // Organizer events list
  "org.events.sub": "Competition events from the current sport schedule.", "org.events.editNote": "Management edits are demo preview only", "org.verified": "Verified", "org.awaitingReview": "Awaiting review",
  // Organizer create event
  "org.new.title": "Create new event", "org.new.intro": "Fill in the event details below.", "org.new.eventTitle": "Event title", "org.new.sportType": "Sport type", "org.new.season": "Season", "org.new.startDate": "Start date", "org.new.endDate": "End date", "org.new.location": "Location / venue", "org.new.district": "District", "org.new.description": "Event details", "org.new.image": "Event image", "org.new.chooseFilePrompt": "Select an image file", "org.new.chooseFile": "Choose file", "org.new.save": "Save event", "org.new.optional": "optional", "org.new.titleRequired": "Please enter an event title.", "org.new.added": "Event added", "org.new.createdHeading": "Events you added",
  // Organizer check-ins
  "org.checkins.sub": "Check-in stations for each competition event.", "org.checkins.close": "Close", "org.checkins.view": "View check-ins", "org.checkins.note": "No check-ins recorded for this event yet.",
  // Admin overview
  "adm.title": "Event operations overview", "adm.intro": "Aggregate operations metrics across all Nan Game On sport events.", "adm.metric.allRecords": "All event records", "adm.metric.competition": "Competition mode", "adm.metric.spectator": "Spectator mode", "adm.review.title": "Review list", "adm.review.sub": "Upcoming and recent events from the shared schedule.", "adm.reviewDemo": "Review demo",
  // Admin events
  "adm.events.subSuffix": "published sport-event records.", "adm.events.colEvent": "Event", "adm.events.colSeason": "Season", "adm.events.colReview": "Review", "adm.demoReview": "Demo review",
  // Admin users
  "adm.users.intro": "Organizers and audience groups summarized from published sport events.", "adm.users.metric.queues": "Organizer review queues", "adm.users.metric.audienceModes": "Event audience modes", "adm.users.metric.districts": "Venue districts", "adm.users.queues.sub": "Grouped by sport type from published event records.", "adm.users.demo": "Demo", "adm.users.linkedOne": "linked event record", "adm.users.linkedMany": "linked event records", "adm.users.audience.title": "User audience review", "adm.users.audience.sub": "Audience indicators are inferred from event modes, not user profiles.", "adm.users.row.spectator": "Spectator-enabled events", "adm.users.row.competition": "Competition-enabled events", "adm.users.row.noProfiles": "No stored user profiles",
};

const th: Dictionary = {
  ...en,
  "common.askAI": "ถาม AI", "common.back": "กลับ", "common.openMap": "เปิดแผนที่", "common.send": "ส่ง",
  "chat.placeholder": "ถามเรื่องงานกีฬา หรือแผนรอบสนามแข่ง…",
  "feed.title": "ฟีด", "feed.nav.calendar": "ปฏิทิน", "feed.tab.feed": "ฟีด", "feed.tab.rank": "อันดับ",
  "feed.addPhoto": "เพิ่มรูป", "feed.checkedInAt": "เช็กอินที่", "feed.composer": "แชร์ความเคลื่อนไหว", "feed.daysAgo": "วันที่แล้ว", "feed.demo": "ตัวอย่าง", "feed.editName": "แก้ไขชื่อ", "feed.hoursAgo": "ชั่วโมงที่แล้ว", "feed.imageTooLarge": "รูปต้องมีขนาดไม่เกิน 5 MB", "feed.justNow": "เมื่อสักครู่", "feed.kudos": "ส่งกำลังใจ", "feed.post": "โพสต์", "feed.rankSub": "คะแนนจากการเช็กอินงานกีฬา", "feed.rankTitle": "อันดับ", "feed.removePhoto": "ลบรูป", "feed.sharedToFeed": "แชร์ลงฟีดแล้ว", "feed.uploading": "กำลังอัปโหลด…", "feed.viewFeed": "ดูฟีด", "feed.you": "คุณ",
  "footer.ai": "ผู้ช่วยกีฬา", "footer.assistance": "ติดต่อสอบถาม", "footer.calendar": "ปฏิทิน", "footer.description": "Nan Game On รวมงานกีฬา แผนรอบสนามแข่ง และความเคลื่อนไหวของชุมชนไว้ด้วยกัน", "footer.home": "หน้าแรก", "footer.links": "ลิงก์ด่วน", "footer.passport": "พาสปอร์ต", "footer.rewards": "รางวัล", "footer.phone": "โทรศัพท์", "footer.safetyNote": "ตรวจสอบประกาศของผู้จัดก่อนเดินทางหรือร่วมแข่งขัน", "footer.safetyTitle": "หมายเหตุวันแข่ง",
  "plan.aiFallback": "แผนรอบสนามแข่งจากข้อมูลในเครื่อง", "sport.aiPlan": "แผนรอบสนามแข่งจาก AI",
  "rewards.close": "ปิด", "rewards.codeHint": "แสดงรหัสนี้กับพาร์ตเนอร์ในวันงาน", "rewards.codeTitle": "รหัสรับรางวัล", "rewards.cost": "คะแนน", "rewards.demoNote": "การแลกรางวัลเป็นต้นแบบ", "rewards.need": "ต้องการอีก", "rewards.open": "ดูรางวัล", "rewards.redeem": "แลก", "rewards.redeemed": "แลกแล้ว", "rewards.sub": "แลกคะแนนจากการเช็กอินที่ยืนยันแล้ว", "rewards.title": "รางวัล", "rewards.yourPoints": "คะแนนของคุณ",
  "sport.badges": "แบดจ์", "sport.botHelp": "ช่วยเหลือ Game On", "sport.botSport": "ผู้ช่วยกีฬา", "sport.calendar": "ปฏิทิน", "sport.chatGreeting": "ถามเรื่องงานกีฬา การเตรียมตัว หรือจุดแวะใกล้สนามแข่งได้เลย", "sport.chatSuggest1": "มีงานแข่งอะไรบ้าง?", "sport.chatSuggest2": "เตรียมตัววันฝนตกอย่างไร?", "sport.chatSuggest3": "แนะนำจุดแวะใกล้งานแข่ง", "sport.checkedIn": "เช็กอินแล้ว", "sport.checkin": "เช็กอิน", "sport.checkinAntiFake": "เช็กอินได้เมื่ออยู่ที่งานจริงเท่านั้น", "sport.days": "วัน", "sport.daysLeft": "วันก่อนเริ่ม", "sport.helpGreeting": "ถามวิธีใช้พาสปอร์ต ปฏิทิน เช็กอิน และรางวัลของ Game On ได้เลย", "sport.helpSuggest1": "เช็กอินทำงานอย่างไร?", "sport.helpSuggest2": "ได้แบดจ์อย่างไร?", "sport.helpSuggest3": "คะแนนทำงานอย่างไร?", "sport.liveNow": "กำลังจัด", "sport.nextEvent": "งานถัดไป", "sport.passport": "พาสปอร์ต", "sport.pastEvent": "จบแล้ว", "sport.planning": "กำลังวางแผน…", "sport.planTrip": "วางแผนรอบสนามแข่ง", "sport.points": "คะแนน", "sport.raceDay": "วันแข่ง", "sport.rewards": "รางวัล", "sport.tagline": "น่านเล่นได้ทั้งปี", "sport.today": "วันนี้", "sport.tripAround": "แผน Racecation", "sport.unverified": "วันและรายละเอียดอาจเปลี่ยนแปลง โปรดยืนยันกับผู้จัด", "sport.venue": "สถานที่", "sport.viewEvent": "ดูงาน", "sport.when": "วันเวลา", "sport.road": "ถนน", "sport.trail": "เทรล", "sport.cycling": "จักรยาน", "sport.longboat": "เรือยาว", "sport.compete": "แข่งขัน", "sport.spectate": "เข้าชม", "weather.rainChance": "โอกาสฝน",
  // Demo login / role picker
  "login.badge": "เดโม", "login.title": "เลือกบทบาทของคุณ", "login.subtitle": "เลือกบทบาทเพื่อเข้าใช้งาน ไม่ต้องสมัครสมาชิก", "login.choose": "เลือก",
  "role.demoRole": "บทบาท", "role.changeRole": "เปลี่ยนบทบาท", "role.logout": "ออกจากระบบ",
  "role.user.name": "นักท่องเที่ยว", "role.user.desc": "ติดตามงาน สะสมแสตมป์พาสปอร์ต และรับรางวัล",
  "role.organizer.name": "ผู้จัดงาน", "role.organizer.desc": "จัดการงานและการเช็กอินของคุณ",
  "role.admin.name": "ผู้ดูแลระบบ", "role.admin.desc": "ตรวจสอบงาน ผู้จัดงาน และผู้ใช้",
  // Management shell (organizer + admin)
  "mgmt.organizer.workspace": "พื้นที่ผู้จัดงาน", "mgmt.admin.workspace": "พื้นที่ผู้ดูแลระบบ", "mgmt.demoPreview": "ตัวอย่าง",
  "mgmt.demoBadge": "ตัวอย่างการจัดการ", "mgmt.adminDemoBadge": "ตัวอย่างผู้ดูแลระบบ",
  "mgmt.nav.overview": "ภาพรวม", "mgmt.nav.myEvents": "งานของฉัน", "mgmt.nav.createEvent": "สร้างงาน", "mgmt.nav.checkins": "เช็กอินงาน", "mgmt.nav.allEvents": "งานทั้งหมด", "mgmt.nav.users": "ผู้จัดงานและผู้ใช้",
  "season.green.short": "กรีนซีซัน", "season.cool.short": "ฤดูหนาว", "season.hot.short": "ฤดูร้อน",
  // Organizer overview
  "org.title": "จัดการพื้นที่งานของคุณ", "org.intro": "ข้อมูลงานทั้งหมดมาจากปฏิทินกีฬา Nan Game On จัดการงาน การเช็กอิน และติดตามสถานะได้จากที่นี่", "org.createCta": "สร้างงานใหม่",
  "org.metric.published": "รายการงานที่เผยแพร่", "org.metric.competitionReady": "พร้อมแข่งขัน", "org.metric.needsReview": "รอตรวจสอบ",
  "org.queue.title": "คิวงานของฉัน", "org.queue.sub": "รายการที่พร้อมแข่งขันจากปฏิทินกีฬาปัจจุบัน", "org.viewAll": "ดูทั้งหมด", "org.readonly": "ตัวอย่างอ่านอย่างเดียว",
  // Organizer events list
  "org.events.sub": "รายการงานแข่งขันจากปฏิทินกีฬาปัจจุบัน", "org.events.editNote": "การแก้ไขเป็นเพียงตัวอย่างเท่านั้น", "org.verified": "ยืนยันแล้ว", "org.awaitingReview": "รอตรวจสอบ",
  // Organizer create event
  "org.new.title": "สร้างงานใหม่", "org.new.intro": "กรอกรายละเอียดของงานด้านล่าง", "org.new.eventTitle": "ชื่องาน", "org.new.sportType": "ประเภทกีฬา", "org.new.season": "ฤดูกาล", "org.new.startDate": "วันที่เริ่ม", "org.new.endDate": "วันที่สิ้นสุด", "org.new.location": "สถานที่จัดงาน", "org.new.district": "อำเภอ", "org.new.description": "รายละเอียดกิจกรรม", "org.new.image": "ภาพงาน", "org.new.chooseFilePrompt": "เลือกไฟล์รูปภาพ", "org.new.chooseFile": "เลือกไฟล์", "org.new.save": "บันทึกงาน", "org.new.optional": "ไม่บังคับ", "org.new.titleRequired": "กรุณากรอกชื่องาน", "org.new.added": "เพิ่มงานแล้ว", "org.new.createdHeading": "งานที่คุณเพิ่ม",
  // Organizer check-ins
  "org.checkins.sub": "จุดเช็กอินสำหรับแต่ละงานแข่งขัน", "org.checkins.close": "ปิด", "org.checkins.view": "ดูการเช็กอิน", "org.checkins.note": "ยังไม่มีการเช็กอินสำหรับงานนี้",
  // Admin overview
  "adm.title": "ภาพรวมการดำเนินงาน", "adm.intro": "ภาพรวมตัวชี้วัดการดำเนินงานจากงานกีฬา Nan Game On ทั้งหมด", "adm.metric.allRecords": "งานทั้งหมด", "adm.metric.competition": "โหมดแข่งขัน", "adm.metric.spectator": "โหมดเข้าชม", "adm.review.title": "รายการตรวจสอบ", "adm.review.sub": "งานที่กำลังจะมาถึงและล่าสุดจากปฏิทินที่ใช้ร่วมกัน", "adm.reviewDemo": "ตัวอย่างการตรวจสอบ",
  // Admin events
  "adm.events.subSuffix": "รายการงานกีฬาที่เผยแพร่แล้ว", "adm.events.colEvent": "งาน", "adm.events.colSeason": "ฤดูกาล", "adm.events.colReview": "ตรวจสอบ", "adm.demoReview": "ตัวอย่างตรวจสอบ",
  // Admin users
  "adm.users.intro": "สรุปผู้จัดงานและกลุ่มผู้ชมจากงานกีฬาที่เผยแพร่แล้ว", "adm.users.metric.queues": "คิวตรวจสอบผู้จัด", "adm.users.metric.audienceModes": "รูปแบบผู้ชมงาน", "adm.users.metric.districts": "อำเภอที่จัดงาน", "adm.users.queues.sub": "จัดกลุ่มตามชนิดกีฬาจากรายการงานที่เผยแพร่", "adm.users.demo": "ตัวอย่าง", "adm.users.linkedOne": "งานที่เชื่อมโยง", "adm.users.linkedMany": "งานที่เชื่อมโยง", "adm.users.audience.title": "ตรวจสอบกลุ่มผู้ใช้", "adm.users.audience.sub": "ตัวชี้วัดกลุ่มผู้ชมประเมินจากโหมดของงาน ไม่ใช่จากโปรไฟล์ผู้ใช้", "adm.users.row.spectator": "งานที่เปิดให้เข้าชม", "adm.users.row.competition": "งานที่เปิดให้แข่งขัน", "adm.users.row.noProfiles": "ไม่มีโปรไฟล์ผู้ใช้ที่บันทึกไว้",
};

export const dict: Record<LangCode, Dictionary> = { th, en };

export function translate(lang: LangCode, key: string): string {
  return dict[lang][key] ?? en[key] ?? key;
}
