"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GameOnHeaderActions from "@/components/GameOnHeaderActions";
import PublicBackButton from "@/components/PublicBackButton";
import { useI18n } from "@/i18n/I18nProvider";
import { fallbackSportReply, matchDestinations } from "@/lib/destination-reference";
import { daysUntil, matchEvents, SEASON_ACCENT, type SportEvent } from "@/lib/sports";
import { type Destination, districtLoc, loc } from "@/lib/types";
import { LangCode } from "@/i18n/dictionaries";

type BotMode = "sport" | "help";

type Msg =
  | { from: "user"; text: string }
  | { from: "ai"; text: string; places: Destination[]; events: SportEvent[] };

function ChatInner() {
  const { t, lang, ready } = useI18n();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";
  const [mode, setMode] = useState<BotMode>("sport");
  const [threads, setThreads] = useState<Record<BotMode, Msg[]>>({ sport: [], help: [] });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const messages = threads[mode];
  const setMessages = useCallback(
    (updater: (prev: Msg[]) => Msg[], forMode: BotMode) => {
      setThreads((prev) => ({ ...prev, [forMode]: updater(prev[forMode]) }));
    },
    []
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const botMode = mode;
      setInput("");

      const history = [
        ...threads[botMode].map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: text },
      ];

      setMessages((m) => [...m, { from: "user", text }], botMode);
      setTyping(true);

      // Cards from the question; refined with the answer once it streams in.
      const isSport = botMode === "sport";
      const qPlaces = isSport ? matchDestinations(text) : [];
      const qEvents = isSport ? matchEvents(text) : [];

      const attachCards = (answer: string) => {
        if (!isSport) return;
        const combined = `${text}\n${answer}`;
        const places = matchDestinations(combined);
        const events = matchEvents(combined);
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.from === "ai") {
            copy[copy.length - 1] = { ...last, places, events };
          }
          return copy;
        }, botMode);
      };

      const runLocalFallback = () => {
        const reply = isSport
          ? fallbackSportReply(lang === "th" ? "th" : "en")
          : lang === "th"
            ? "ฉันช่วยอธิบายการใช้งาน ฤดูม่วนน่าน — ม่วนได้ทุกฤดู ที่น่าน ได้ เช่น ปฏิทิน เช็กอิน แต้ม และพาสปอร์ต"
            : "I can explain Ruedu Muan Nan features such as the calendar, check-ins, points, and passport.";
        setMessages(
          (m) => [
            ...m,
            { from: "ai", text: reply, places: qPlaces, events: qEvents },
          ],
          botMode
        );
        setTyping(false);
      };

      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang, mode: botMode }),
        });
        const ctype = resp.headers.get("content-type") ?? "";

        if (!resp.ok || !resp.body || ctype.includes("application/json")) {
          runLocalFallback();
          return;
        }

        setTyping(false);
        setMessages(
          (m) => [...m, { from: "ai", text: "", places: qPlaces, events: qEvents }],
          botMode
        );

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let acc = "";
        const pushDelta = (delta: string) => {
          acc += delta;
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last && last.from === "ai") {
              copy[copy.length - 1] = { ...last, text: acc };
            }
            return copy;
          }, botMode);
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const s = line.trim();
            if (!s.startsWith("data:")) continue;
            const data = s.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta: string = json?.choices?.[0]?.delta?.content ?? "";
              if (delta) pushDelta(delta);
            } catch {
              // ignore keep-alive / non-JSON lines
            }
          }
        }

        if (!acc.trim()) {
          const reply = isSport
            ? fallbackSportReply(lang === "th" ? "th" : "en")
            : lang === "th"
              ? "ฉันช่วยอธิบายการใช้งาน ฤดูม่วนน่าน — ม่วนได้ทุกฤดู ที่น่าน ได้ เช่น ปฏิทิน เช็กอิน แต้ม และพาสปอร์ต"
              : "I can explain Ruedu Muan Nan features such as the calendar, check-ins, points, and passport.";
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last && last.from === "ai") {
              copy[copy.length - 1] = {
                from: "ai",
                text: reply,
                places: qPlaces,
                events: qEvents,
              };
            }
            return copy;
          }, botMode);
        } else {
          attachCards(acc);
        }
      } catch {
        runLocalFallback();
      }
    },
    [mode, threads, lang, setMessages]
  );

  useEffect(() => {
    if (!ready) return;
    if (started.current) return;
    started.current = true;
    if (!initial) return;
    const id = window.setTimeout(() => send(initial), 0);
    return () => window.clearTimeout(id);
  }, [initial, ready, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, typing]);

  const suggestions =
    mode === "sport"
      ? [t("sport.chatSuggest1"), t("sport.chatSuggest2"), t("sport.chatSuggest3")]
      : [t("sport.helpSuggest1"), t("sport.helpSuggest2"), t("sport.helpSuggest3")];
  const suggestionIcons =
    mode === "sport"
      ? ["ti-sailboat", "ti-cloud-rain", "ti-map-pin"]
      : ["ti-qrcode", "ti-medal-2", "ti-bulb"];
  const greeting = mode === "sport" ? t("sport.chatGreeting") : t("sport.helpGreeting");
  const isEmpty = messages.length === 0 && !typing;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <PublicBackButton fallbackHref="/" />
            <h1 className="flex min-w-0 items-center gap-2 text-lg font-bold text-frost">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt text-white">
                <i className="ti ti-message-chatbot text-lg" aria-hidden />
              </span>
              <span className="truncate">{t("sport.botSport")}</span>
            </h1>
          </div>
          <GameOnHeaderActions dark />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-6 pt-4 lg:px-8">
        {/* Bot switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-full border border-black/10 bg-pitch-800 p-1 text-sm font-semibold">
          {(["sport", "help"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              aria-pressed={mode === k}
              className={`flex items-center justify-center gap-1.5 rounded-full py-2 transition ${
                mode === k ? "bg-volt text-white" : "text-steel hover:text-frost"
              }`}
            >
              <i className={`ti ${k === "sport" ? "ti-compass" : "ti-help-circle"} text-base`} aria-hidden />
              {t(k === "sport" ? "chat.tabSport" : "chat.tabHelp")}
            </button>
          ))}
        </div>

        {isEmpty && (
          <div className="anim-rise flex flex-1 flex-col items-center justify-center py-10 text-center">
            <span className="anim-pop flex h-20 w-20 items-center justify-center rounded-3xl bg-volt text-white shadow-lg shadow-volt/30">
              <i className="ti ti-message-chatbot text-4xl" aria-hidden />
            </span>
            <h2 className="mt-5 flex items-center gap-1.5 text-2xl font-bold text-frost">
              {t("sport.botSport")}
              <i className="ti ti-sparkles text-lg text-volt" aria-hidden />
            </h2>
            <p className="mt-1 text-sm font-medium text-volt">{t("chat.botTagline")}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-steel">{greeting}</p>

            <div className="mt-7 grid w-full max-w-md gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="sport-card group flex items-center gap-3 rounded-md p-3 text-left transition hover:border-volt/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-volt/12 text-volt">
                    <i className={`ti ${suggestionIcons[i] ?? "ti-sparkles"} text-lg`} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-frost">{s}</span>
                  <i className="ti ti-arrow-right text-base text-steel transition group-hover:text-volt" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-4 flex-1 space-y-4 overflow-y-auto ${isEmpty ? "hidden" : ""}`}>
          {messages.map((m, i) =>
            m.from === "user" ? (
              <div key={i} className="anim-rise flex justify-end">
                <div className="max-w-[82%] rounded-md rounded-tr-sm bg-volt px-4 py-2.5 text-sm font-medium text-white lg:max-w-[62%]">
                  {m.text}
                </div>
              </div>
            ) : (
              <AiBubble key={i}>
                <FormattedMessage text={m.text} />
                {m.events.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {m.events.map((e) => (
                      <EventMini key={e.id} event={e} lang={lang as LangCode} t={t} />
                    ))}
                  </div>
                )}
                {m.places.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {m.places.map((p) => (
                      <PlaceMini key={p.id} place={p} lang={lang as LangCode} />
                    ))}
                  </div>
                )}
              </AiBubble>
            )
          )}

          {typing && (
            <AiBubble>
              <span className="flex gap-1">
                <Dot /> <Dot /> <Dot />
              </span>
            </AiBubble>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="sticky bottom-0 mt-4 bg-pitch/90 pb-1 pt-2 backdrop-blur">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-full border border-black/15 bg-pitch-800 py-1.5 pl-4 pr-1.5 shadow-sm transition focus-within:border-volt"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.placeholder")}
              className="min-w-0 flex-1 bg-transparent text-sm text-frost outline-none placeholder:text-steel"
            />
            <button
              type="submit"
              aria-label={t("common.send")}
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-volt text-white transition hover:bg-volt-600 disabled:opacity-40"
            >
              <i className="ti ti-send text-lg" aria-hidden />
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

/** Inline `**bold**` → <strong>, everything else as-is. */
function renderInline(text: string, keyBase: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyBase}-${i}`} className="font-semibold text-frost">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${keyBase}-${i}`}>{part}</span>
    )
  );
}

/** Lightweight renderer for the model's markdown: paragraphs, `*`/`-` bullet
 *  lists, and inline bold. Avoids a heavy markdown dependency. */
function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={key} className="my-1.5 space-y-1">
        {items.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-volt/70" aria-hidden />
            <span className="min-w-0 flex-1">{renderInline(b, `${key}-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    const bullet = line.match(/^[*-]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flushBullets(`ul-${i}`);
    if (!line) return;
    blocks.push(
      <p key={`p-${i}`} className="break-words [&:not(:first-child)]:mt-2">
        {renderInline(line, `p-${i}`)}
      </p>
    );
  });
  flushBullets("ul-end");

  return <div className="text-sm leading-relaxed text-frost">{blocks}</div>;
}

function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="anim-rise flex items-start gap-2 lg:gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt text-white">
        <i className="ti ti-message-chatbot text-base" aria-hidden />
      </span>
      <div className="sport-card max-w-[88%] rounded-md rounded-tl-sm px-4 py-2.5 lg:max-w-[72%]">
        {children}
      </div>
    </div>
  );
}

function EventMini({
  event,
  lang,
  t,
}: {
  event: SportEvent;
  lang: LangCode;
  t: (k: string) => string;
}) {
  const accent = SEASON_ACCENT[event.season];
  const days = daysUntil(event);
  return (
    <Link
      href={`/events/${event.id}`}
      className={`flex items-center gap-2.5 rounded-md border border-black/10 bg-black/5 p-2.5 transition hover:border-volt/50 ${accent.flag}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white ${accent.text}`}>
        <i className={`ti ${event.icon} text-xl`} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-frost">
          {loc(event.name, lang)}
        </span>
        <span className="block text-[10px] text-steel" suppressHydrationWarning>
          {loc(event.monthLabel, lang)} · {districtLoc(event.venue.district, lang)}
          {days > 0 ? ` · ${t("sport.daysLeft")} ${days} ${t("sport.days")}` : ""}
        </span>
      </span>
      <i className="ti ti-chevron-right text-base text-steel" aria-hidden />
    </Link>
  );
}

function PlaceMini({ place, lang }: { place: Destination; lang: LangCode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-black/10 bg-black/5 p-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-volt/12 text-volt">
        <i className="ti ti-map-pin text-xl" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-frost">{loc(place.name, lang)}</span>
        <span className="block text-[10px] text-steel">{districtLoc(place.district, lang)}</span>
      </span>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-steel" />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-steel">…</div>}>
      <ChatInner />
    </Suspense>
  );
}
