"use client";

import { useState } from "react";

export default function OrganizerNewEventPage() {
  const [title, setTitle] = useState("");
  const [imageName, setImageName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-2xl border border-volt/30 bg-[#fff8eb] p-5">
        <span className="inline-flex rounded-full bg-volt/15 px-3 py-1 text-xs font-bold text-volt">Demo preview only / ตัวอย่างเท่านั้น</span>
        <h1 className="mt-3 text-2xl font-bold">Create event preview / ตัวอย่างสร้างงาน</h1>
        <p className="mt-2 text-sm leading-6 text-steel">
          This form is a visual demo. It does not create or edit an event, upload a file, or write anything to Supabase.
        </p>
      </section>

      <section className="rounded-2xl border border-pitch/10 bg-white p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Event title / ชื่องาน
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Demo event title" className="mt-2 min-h-11 w-full rounded-lg border border-pitch/15 px-3 text-sm font-normal outline-none focus:border-volt" />
          </label>
          <label className="block text-sm font-semibold">
            Season / ฤดูกาล
            <select defaultValue="green" className="mt-2 min-h-11 w-full rounded-lg border border-pitch/15 bg-white px-3 text-sm font-normal outline-none focus:border-volt">
              <option value="green">Green season</option>
              <option value="cool">Cool season</option>
              <option value="hot">Hot season</option>
            </select>
          </label>
        </div>
        <div className="mt-5">
          <p className="text-sm font-semibold">Event image upload — demo preview / อัปโหลดภาพ (ตัวอย่าง)</p>
          <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-pitch/25 px-3 text-sm hover:border-volt">
            <span>{imageName || "Choose a local file for preview only / เลือกไฟล์เพื่อดูตัวอย่างเท่านั้น"}</span>
            <span className="rounded bg-pitch/5 px-2 py-1 text-xs font-bold">Choose file</span>
            <input type="file" className="sr-only" onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")} />
          </label>
          <p className="mt-2 text-xs text-[#b54708]">No file is uploaded or retained. Supabase is never called from this demo preview.</p>
        </div>
        <button type="button" onClick={() => setMessage(`Demo preview ready${title ? `: ${title}` : ""}. Nothing was saved.`)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-pitch px-4 text-sm font-bold text-frost hover:bg-pitch-800">
          <i className="ti ti-eye" aria-hidden /> Save demo preview / บันทึกตัวอย่าง
        </button>
        <p className="mt-3 min-h-5 text-sm font-medium text-[#b54708]" aria-live="polite">{message}</p>
      </section>
    </div>
  );
}
