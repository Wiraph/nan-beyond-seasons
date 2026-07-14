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
  "sport.badges": "Badges", "sport.botHelp": "Game On Help", "sport.botSport": "Sport Buddy", "sport.calendar": "Calendar", "sport.chatGreeting": "Ask about a festival, race preparation, or nearby race-weekend stops.", "sport.chatSuggest1": "What races are coming up?", "sport.chatSuggest2": "How should I prepare for rain?", "sport.chatSuggest3": "Recommend stops near an event", "sport.checkedIn": "Checked in", "sport.checkin": "Check in", "sport.checkinAntiFake": "This demo check-in is available on the event page.", "sport.days": "days", "sport.daysLeft": "days left", "sport.helpGreeting": "Ask how to use your Game On passport, calendar, check-ins, and rewards.", "sport.helpSuggest1": "How do check-ins work?", "sport.helpSuggest2": "How are badges earned?", "sport.helpSuggest3": "How do points work?", "sport.liveNow": "Live now", "sport.nextEvent": "Next event", "sport.passport": "Passport", "sport.pastEvent": "Past event", "sport.planning": "Planning…", "sport.planTrip": "Plan a race weekend", "sport.points": "Points", "sport.raceDay": "Race day", "sport.rewards": "Rewards", "sport.tagline": "Play Nan all year", "sport.today": "Today", "sport.tripAround": "Racecation plan", "sport.unverified": "Dates and details may change; confirm with the organizer.", "sport.venue": "Venue", "sport.viewEvent": "View event", "sport.when": "When", "sport.road": "Road", "sport.trail": "Trail", "sport.cycling": "Cycling", "sport.longboat": "Longboat", "weather.rainChance": "Rain chance",
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
  "sport.badges": "แบดจ์", "sport.botHelp": "ช่วยเหลือ Game On", "sport.botSport": "ผู้ช่วยกีฬา", "sport.calendar": "ปฏิทิน", "sport.chatGreeting": "ถามเรื่องงานกีฬา การเตรียมตัว หรือจุดแวะใกล้สนามแข่งได้เลย", "sport.chatSuggest1": "มีงานแข่งอะไรบ้าง?", "sport.chatSuggest2": "เตรียมตัววันฝนตกอย่างไร?", "sport.chatSuggest3": "แนะนำจุดแวะใกล้งานแข่ง", "sport.checkedIn": "เช็กอินแล้ว", "sport.checkin": "เช็กอิน", "sport.checkinAntiFake": "เดโมเช็กอินนี้ใช้งานได้จากหน้างานกีฬา", "sport.days": "วัน", "sport.daysLeft": "วันก่อนเริ่ม", "sport.helpGreeting": "ถามวิธีใช้พาสปอร์ต ปฏิทิน เช็กอิน และรางวัลของ Game On ได้เลย", "sport.helpSuggest1": "เช็กอินทำงานอย่างไร?", "sport.helpSuggest2": "ได้แบดจ์อย่างไร?", "sport.helpSuggest3": "คะแนนทำงานอย่างไร?", "sport.liveNow": "กำลังจัด", "sport.nextEvent": "งานถัดไป", "sport.passport": "พาสปอร์ต", "sport.pastEvent": "จบแล้ว", "sport.planning": "กำลังวางแผน…", "sport.planTrip": "วางแผนรอบสนามแข่ง", "sport.points": "คะแนน", "sport.raceDay": "วันแข่ง", "sport.rewards": "รางวัล", "sport.tagline": "น่านเล่นได้ทั้งปี", "sport.today": "วันนี้", "sport.tripAround": "แผน Racecation", "sport.unverified": "วันและรายละเอียดอาจเปลี่ยนแปลง โปรดยืนยันกับผู้จัด", "sport.venue": "สถานที่", "sport.viewEvent": "ดูงาน", "sport.when": "วันเวลา", "sport.road": "ถนน", "sport.trail": "เทรล", "sport.cycling": "จักรยาน", "sport.longboat": "เรือยาว", "weather.rainChance": "โอกาสฝน",
};

export const dict: Record<LangCode, Dictionary> = { th, en };

export function translate(lang: LangCode, key: string): string {
  return dict[lang][key] ?? en[key] ?? key;
}
