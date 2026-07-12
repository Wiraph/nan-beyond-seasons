"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { getAIResponse, matchPlaces } from "@/lib/mockAI";
import { Place, districtLoc, loc } from "@/lib/types";
import { LangCode } from "@/i18n/dictionaries";

type Msg =
  | { from: "user"; text: string }
  | { from: "ai"; text: string; places: Place[] };

function ChatInner() {
  const { t, lang, ready } = useI18n();
  const sp = useSearchParams();
  const initial = sp.get("q") ?? "";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setInput("");

      const history = [
        ...messages.map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: text },
      ];

      setMessages((m) => [...m, { from: "user", text }]);
      setTyping(true);

      const cards = matchPlaces(text);

      const runMockFallback = () => {
        const res = getAIResponse(text, lang as LangCode);
        setMessages((m) => [...m, { from: "ai", text: res.reply, places: res.places }]);
        setTyping(false);
      };

      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
        });
        const ctype = resp.headers.get("content-type") ?? "";

        if (!resp.ok || !resp.body || ctype.includes("application/json")) {
          runMockFallback();
          return;
        }

        setTyping(false);
        setMessages((m) => [...m, { from: "ai", text: "", places: cards.places }]);

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
          });
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
          const res = getAIResponse(text, lang as LangCode);
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last && last.from === "ai") {
              copy[copy.length - 1] = { from: "ai", text: res.reply, places: res.places };
            }
            return copy;
          });
        }
      } catch {
        runMockFallback();
      }
    },
    [messages, lang]
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
  }, [messages, typing]);

  const suggestions = [
    t("sport.chatSuggest1"),
    t("sport.chatSuggest2"),
    t("sport.chatSuggest3"),
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <h1 className="flex items-center gap-2 text-lg font-extrabold text-frost">
            <i className="ti ti-message-chatbot text-volt" aria-hidden /> {t("sport.chatTitle")}
          </h1>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-6 pt-4 lg:px-8">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Intro bubble */}
          <div className="sport-card anim-rise flex items-start gap-3 rounded-2xl p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-volt text-pitch">
              <i className="ti ti-bolt text-xl" aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-frost">
                {t("sport.chatTitle")}
                <i className="ti ti-sparkles text-sm text-volt" aria-hidden />
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-steel">{t("sport.chatGreeting")}</p>
            </div>
          </div>

          {messages.map((m, i) =>
            m.from === "user" ? (
              <div key={i} className="anim-rise flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-volt px-4 py-2.5 text-sm font-medium text-pitch lg:max-w-[62%]">
                  {m.text}
                </div>
              </div>
            ) : (
              <AiBubble key={i}>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-frost">
                  {m.text}
                </p>
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

        {/* Suggestions + input */}
        <div className="sticky bottom-0 mt-4 bg-pitch/90 pb-1 pt-2 backdrop-blur">
          {messages.length === 0 && (
            <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs text-steel transition hover:border-volt hover:text-volt lg:px-4 lg:text-sm"
                >
                  <i
                    className={`ti ${["ti-sailboat", "ti-cloud-rain", "ti-map-pin"][i] ?? "ti-sparkles"} text-sm`}
                    aria-hidden
                  />
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-full border border-black/15 bg-pitch-800 py-1.5 pl-4 pr-1.5"
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-volt text-pitch transition hover:bg-volt-600"
            >
              <i className="ti ti-send text-lg" aria-hidden />
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="anim-rise flex items-start gap-2 lg:gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-volt/15 text-volt">
        <i className="ti ti-bolt text-base" aria-hidden />
      </span>
      <div className="sport-card max-w-[88%] rounded-2xl rounded-tl-sm px-4 py-2.5 lg:max-w-[72%]">
        {children}
      </div>
    </div>
  );
}

function PlaceMini({ place, lang }: { place: Place; lang: LangCode }) {
  return (
    <Link
      href={`/place/${place.id}`}
      className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-black/5 p-2.5 transition hover:border-volt/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-volt/12 text-volt">
        <i className={`ti ${place.icon} text-xl`} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-frost">{loc(place.name, lang)}</span>
        <span className="block text-[10px] text-steel">{districtLoc(place.district, lang)}</span>
      </span>
      <i className="ti ti-chevron-right text-base text-steel" aria-hidden />
    </Link>
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
