import { useId, useRef, useState, type FormEvent } from "react";
import PokeballIcon from "./PokeballIcon";
import { contact } from "../../data/site";
import { BUTTON_PRIMARY, CARD, LINK_CLASS } from "./styles";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent"; name: string } | { state: "error"; reason: string };

const FIELD_CLASS =
  "w-full rounded-md border border-ink/15 bg-paper px-3.5 py-2.5 text-base text-ink placeholder:text-ink/35 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const LABEL_CLASS = "text-sm font-medium text-ink/75";

const TIMEOUT_MS = 15000;

/** Posts to FormSubmit's AJAX endpoint. Resolves on success, throws with a readable reason otherwise. */
async function sendMessage(fields: { name: string; email: string; message: string }) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(contact.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _subject: `Portfolio message from ${fields.name}`,
        _template: "table",
        _captcha: "false",
      }),
      signal: controller.signal,
    });
    const data: unknown = await response.json().catch(() => null);
    const success = data && typeof data === "object" && "success" in data ? String(data.success) === "true" : false;
    if (!response.ok || !success) {
      const reason = data && typeof data === "object" && "message" in data ? String(data.message) : `HTTP ${response.status}`;
      throw new Error(reason);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("The request timed out.");
    throw error instanceof Error ? error : new Error("Something went wrong.");
  } finally {
    window.clearTimeout(timer);
  }
}

/** The FormSubmit form in a bento tile. Email and links live beside it on the Contact page. */
export default function ContactForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement | null>(null);
  const ids = { name: useId(), email: useId(), message: useId() };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;
    const data = new FormData(event.currentTarget);

    // Honeypot: real people never see this field, bots fill everything.
    if (data.get("_honey")) {
      setStatus({ state: "sent", name: "" });
      return;
    }

    const fields = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    setStatus({ state: "sending" });
    try {
      await sendMessage(fields);
      formRef.current?.reset();
      setStatus({ state: "sent", name: fields.name });
    } catch (error) {
      setStatus({ state: "error", reason: error instanceof Error ? error.message : "Something went wrong." });
    }
  };

  return (
    <div className={`${CARD} ${className}`}>
      {status.state === "sent" ? (
        <div role="status" className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="relative">
            <PokeballIcon className="pokeball-wobble h-16 w-16 text-ink" />
            <span aria-hidden="true" className="caught-star absolute -right-3 -top-2 text-xl text-[#f7d02c]">
              ✦
            </span>
          </div>
          <p className="font-pixel text-xs uppercase">Gotcha!</p>
          <p className="max-w-sm text-sm leading-relaxed text-ink/70">
            {status.name ? `Thanks, ${status.name} — ` : ""}your message was caught. I’ll get back to you soon.
          </p>
          <button type="button" onClick={() => setStatus({ state: "idle" })} className={`text-sm ${LINK_CLASS}`}>
            Send another
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor={ids.name} className={LABEL_CLASS}>
                Name
              </label>
              <input id={ids.name} name="name" required maxLength={100} autoComplete="name" className={FIELD_CLASS} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={ids.email} className={LABEL_CLASS}>
                Email
              </label>
              <input
                id={ids.email}
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                className={FIELD_CLASS}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={ids.message} className={LABEL_CLASS}>
              Message
            </label>
            <textarea
              id={ids.message}
              name="message"
              required
              rows={5}
              maxLength={5000}
              placeholder="Hi Gaurav, ..."
              className={`${FIELD_CLASS} resize-y`}
            />
          </div>

          {/* Honeypot, hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Leave this empty
              <input name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status.state === "sending"}
              className={`${BUTTON_PRIMARY} cursor-pokeball disabled:cursor-wait disabled:opacity-70`}
            >
              <PokeballIcon className={`h-4 w-4 text-ink ${status.state === "sending" ? "pokeball-spin" : ""}`} />
              {status.state === "sending" ? "Throwing…" : "Send message"}
            </button>
            <p className="text-xs text-ink/50">Sent securely through FormSubmit.</p>
          </div>

          <div role="status" aria-live="polite">
            {status.state === "error" && (
              <p className="rounded-lg border border-[#e3350d]/30 bg-[#e3350d]/10 px-3 py-2 text-sm text-ink/80">
                It broke free! The message didn’t send ({status.reason}). Try again, or email me directly at{" "}
                <a href={`mailto:${contact.email}`} className={LINK_CLASS}>
                  {contact.email}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
