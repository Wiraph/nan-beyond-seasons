# Nan Beyond Seasons Hackathon 2026

โปรเจกต์สำหรับ Hackathon "Nan Beyond Seasons Challenge" (11-18 กรกฎาคม 2026)

## Knowledge Base: NotebookLM (สำคัญมาก)

ข้อมูลโจทย์ hackathon และข้อมูลจังหวัดน่านทั้งหมดอยู่ใน NotebookLM notebook:
- **Notebook**: "Nan Beyond Seasons Challenge"
- **Notebook ID**: `ee9c98f3-0a0b-4f1b-a7b1-d124513a69bf`

**เมื่อขาดข้อมูลเกี่ยวกับโจทย์ hackathon หรือข้อมูลจังหวัดน่าน ให้ query NotebookLM ก่อนเสมอ** แทนการเดาหรือถามผู้ใช้ให้ส่งไฟล์:

- ผ่าน MCP tools: ใช้ MCP server ชื่อ `notebooklm` (ติดตั้งแล้วใน `~/.claude.json`)
- ผ่าน CLI: `notebooklm ask "<คำถาม>"` (notebook ถูก set เป็น context ปัจจุบันแล้ว)

ตัวอย่าง:
```bash
notebooklm --quiet ask "Track 1 มีข้อกำหนดอะไรบ้าง"
notebooklm --quiet ask "ข้อมูลฤดูกาลท่องเที่ยวของจังหวัดน่าน"
```

### กฎการใช้ NotebookLM (ประหยัด tokens)

- Query NotebookLM แบบ **เงียบๆ** — ใช้คำตอบเป็น context ภายในเพื่อทำงานต่อทันที
- **ห้ามเอาคำตอบจาก NotebookLM มาเล่าซ้ำให้ user ฟัง** ยกเว้น user ถามข้อมูลนั้นตรงๆ
- ใช้ flag `--quiet` เสมอเมื่อเรียกผ่าน CLI เพื่อตัดข้อความ status
- ตั้งคำถามให้แคบและเจาะจง จะได้คำตอบสั้น ไม่เปลือง context
- ไม่ต้องรายงานว่า "กำลังถาม NotebookLM" หรือ "ได้คำตอบแล้ว" — ทำเงียบๆ แล้วตอบ user ด้วยผลลัพธ์สุดท้ายเลย

## โจทย์โดยสรุป

Hackathon แก้ปัญหาการท่องเที่ยวจังหวัดน่านให้เที่ยวได้ทั้ง 12 เดือน (ไม่กระจุกแค่ high season) มี 3 tracks:

1. **Track 1: AI Trip Planner & Concierge** — ระบบแนะนำเส้นทางท่องเที่ยวปรับตามสภาพอากาศ/ฤดูกาล/ความชอบ เน้น Green Season
2. **Track 2: Experience & Wellness Finder** — จับคู่ความสนใจเฉพาะ (สปา สมุนไพร วัฒนธรรมชุมชน Workation)
3. **Track 3: Tools & Campaigns for Locals** — เครื่องมือ/แดชบอร์ดสำหรับผู้ประกอบการท้องถิ่น + แคมเปญ Gamification

แนวทางที่กำหนด: Design Thinking, Agile, ส่งมอบ Prototype ที่ใช้งานได้จริง

## ไฟล์อ้างอิง

- ไฟล์โจทย์ต้นฉบับ: `C:\Users\Nong_FA\Downloads\โจทย์ Nan Beyond Seasons Hackathon 2026.pdf` (14 หน้า)
