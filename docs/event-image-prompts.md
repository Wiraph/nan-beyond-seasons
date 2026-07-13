# Prompt เจนภาพ Hero แต่ละงานกีฬา (Nan Game On)

**วิธีใช้:** เจนภาพจาก prompt ด้านล่าง → ตั้งชื่อไฟล์ตาม `event id` → วางใน `public/events/` →
บอกชื่อไฟล์มา (หรือใส่ `"image": "/events/<id>.jpg"` เองใน `src/data/sportsEvents.json`)

**สเปกทุกภาพ:**
- อัตราส่วน **แนวนอน 16:9** (แบนเนอร์กว้าง สูง ~44–56 หน่วย — ระบบ crop แบบ object-cover ให้)
- **ห้ามมีตัวหนังสือ/โลโก้/ลายน้ำ** ในภาพ
- สไตล์ **ภาพถ่ายสารคดีกีฬา (photorealistic)** แสงธรรมชาติ
- ⚠️ **Responsible AI (กติกา hackathon):** ตรวจทุกภาพก่อนใช้ ให้ถูกต้อง เหมาะสม เคารพวัฒนธรรมน่าน หลีกเลี่ยงใบหน้าบุคคลจริงที่ระบุตัวได้
- Negative prompt (สำหรับ SD/SDXL): `text, watermark, logo, deformed hands, extra limbs, blurry, western olympic rowing shell, cartoon`

---

## 1. `boat-race-opening.jpg` — แข่งเรือยาวนัดเปิดสนาม (กรีนซีซัน)
```
Traditional Northern Thai long-boat racing on the Nan River, Thailand. A long
wooden racing boat carved from a single log with a tall ornate naga (serpent)
prow and curved tail, a full crew of rowers in matching jerseys paddling in
perfect unison, water splashing, cheering crowds on the green riverbank, lush
rainy-season foliage, soft overcast daylight, documentary sports photography,
dynamic wide banner composition, no text, no logo. 16:9
```

## 2. `boat-race-royal-cup.jpg` — แข่งเรือชิงถ้วยพระราชทาน (ปลายฝน)
```
Grand finale of Northern Thai naga long-boat racing on the Nan River. Two long
carved wooden boats with tall dragon-serpent (naga) prows racing neck and neck,
powerful synchronized rowing, spray of water, festive riverside crowds with
colorful Lanna tung flags, golden ripening rice fields and layered misty
mountains in the distance, warm late-afternoon light, celebratory atmosphere,
documentary photography, wide banner, no text, no logo. 16:9
```

## 3. `nan-marathon.jpg` — น่านมาราธอน (หน้าหนาว เมืองเก่า)
```
Early-morning city marathon through the historic old town of Nan, Northern
Thailand. Runners with race bibs on a quiet street passing a Lanna-style
Buddhist temple with tiered golden roofs, cool misty winter air, soft golden
sunrise light, calm and scenic Northern Thai townscape, documentary sports
photography, wide banner composition, no text, no logo. 16:9
```

## 4. `doi-phu-kha-trail.jpg` — เทรลดอยภูคา (หน้าหนาว, ดอกชมพูภูคา)
```
A trail runner on a high mountain ridge at Doi Phu Kha, Nan, Northern Thailand.
Layered blue mountains and a vast sea of morning mist below, pink Chomphu Phu
Kha blossoms and golden wild grasses lining the ridge trail, crisp clear
morning light, epic panoramic landscape, documentary sports photography, wide
banner, no text, no logo. 16:9
```

## 5. `cycling-route-1715.jpg` — ปั่นเส้น 1715 ปัว–บ่อเกลือ (หน้าหนาว)
```
A road cyclist climbing a winding mountain highway through the misty forested
mountains of Nan, Northern Thailand (the famous Route 1715, Pua to Bo Kluea).
Dramatic hairpin switchback curves, layered green tropical ridges and low
clouds, cool clear morning light, endurance road cycling, documentary sports
photography, wide banner, no text, no logo. 16:9
```

## 6. `wa-river-rafting.jpg` — ล่องแก่งลำน้ำว้า (กรีนซีซัน)
```
White-water rafting on the Wa River, Mae Charim, Nan, Northern Thailand. A team
in helmets and life vests paddling an inflatable raft through powerful class-4
rapids, whitewater splashing, dense green monsoon-season jungle and a rocky
river gorge, misty overcast light, high-energy action, documentary sports
photography, wide banner, no text, no logo. 16:9
```

## 7. `songkran-fun-run.jpg` — วิ่งสาดน้ำสงกรานต์ (หน้าร้อน เมืองเก่า)
```
A festive Songkran water-splash fun run in the old town of Nan, Northern
Thailand. Joyful soaked runners splashing and throwing water, bright water
spray glittering in strong midday sunlight, Lanna temple and old-town street
backdrop, tropical festival energy, vibrant and playful, documentary
photography, wide banner, no text, no logo. 16:9
```

---

### เคล็ดลับให้ออกมาเป็น "น่าน" ไม่ใช่ generic
- ย้ำคำว่า **naga prow / dragon-serpent boat** สำหรับเรือแข่ง (เอกลักษณ์น่าน ไม่ใช่เรือพายโอลิมปิก)
- ใส่ **Lanna temple / tiered roof / misty layered mountains / terraced rice** เป็นฉากหลัง
- ถ้าเจนแล้วหน้าคนเพี้ยน ลองถ่ายมุมกว้าง/มุมหลัง หรือครอปให้คนเล็กลง (แบนเนอร์ครอปบนอยู่แล้ว)
- อยากได้ชุดภาพโทนเดียวกัน เติมท้ายทุก prompt: `consistent cinematic teal-and-orange color grade`
