import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PokemonDialog from "./PokemonDialog";
import PsychicText from "./PsychicText";
import Toast from "./Toast";
import { PsychicContext, usePsychicBlast, type PsychicPhase } from "../hooks/usePsychicBlast";

const LINK_CLASS =
    "cursor-pointer font-medium text-[#466a52] transition hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ef] " +
    // PsychicText renders each glyph as an inline-block span, which blocks text-decoration from
    // propagating down — so the underline must be drawn on the glyph spans themselves.
    "[&_[data-glyph]]:underline [&_[data-glyph]]:decoration-2 [&_[data-glyph]]:underline-offset-4";

const SECTION_LABEL_CLASS =
    "border-t border-black/10 pt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40";

/** Visual cue that a link opens elsewhere; the real hint lives in the sr-only text. */
const EXTERNAL_MARK = (
    <>
        <span aria-hidden="true" className="ml-0.5">
            ↗
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
    </>
);

const DOT = (
    <span aria-hidden="true" className="text-black/30">
        ·
    </span>
);

/** How long the intro prompt and the post-blast punchline stay on screen. */
const DIALOG_LINGER_MS = 6000;

const DIALOG_LINES = {
    prompt: "PSYDUCK is staring at you. (Click it!)",
    charge: "PSYDUCK is concentrating...",
    attack: "PSYDUCK used CONFUSION!",
    aftermath: "Sorry... my head hurts when I read. Psy!",
} as const;

export default function About() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const psyduckRef = useRef<HTMLImageElement | null>(null);

    const [phase, setPhase] = useState<PsychicPhase>("idle");
    const [aftermath, setAftermath] = useState(false);
    const [introVisible, setIntroVisible] = useState(true);
    const [hovered, setHovered] = useState(false);

    // One group for the whole page: every <PsychicText> below registers with it,
    // so clicking Psyduck blasts all the text (and shakes Psyduck) on one clock.
    const psychic = usePsychicBlast({
        companionRef: psyduckRef,
        onPhaseChange: (next) => {
            setPhase(next);
            if (next === "charge") setAftermath(false);
            if (next === "idle") setAftermath(true);
        },
    });

    useEffect(() => {
        const timer = window.setTimeout(() => setIntroVisible(false), DIALOG_LINGER_MS);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!aftermath) return;
        const timer = window.setTimeout(() => setAftermath(false), DIALOG_LINGER_MS);
        return () => window.clearTimeout(timer);
    }, [aftermath]);

    const dialogLine =
        phase === "charge"
            ? DIALOG_LINES.charge
            : phase === "burst" || phase === "return"
                ? DIALOG_LINES.attack
                : aftermath
                    ? DIALOG_LINES.aftermath
                    : DIALOG_LINES.prompt;

    const dialogVisible = hovered || introVisible || aftermath || phase !== "idle";

    const email = "bangadegaurav@gmail.com";

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setToastMessage("Email copied to clipboard ✓");
        } catch {
            setToastMessage(`Copy failed — email is ${email}`);
        }
        setShowToast(true);
    };

    return (
        <PsychicContext value={psychic}>
            <div className="relative mx-auto w-full max-w-xl space-y-5 break-words px-5 py-14 text-[#1b1b1b] sm:px-6 sm:py-20">

                {/* Psyduck sprite — click it and it uses Confusion on the whole page */}
                <div className="flex flex-col items-start gap-1">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={psychic.blast}
                            onPointerEnter={() => setHovered(true)}
                            onPointerLeave={() => setHovered(false)}
                            onFocus={() => setHovered(true)}
                            onBlur={() => setHovered(false)}
                            aria-label="Psyduck uses Confusion"
                            aria-describedby="psyduck-dialog"
                            className="float-psyduck cursor-pointer rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ef]"
                        >
                            <img
                                ref={psyduckRef}
                                src="/sitting-psyduck.webp"
                                alt=""
                                aria-hidden="true"
                                className="h-16 w-16 opacity-80"
                                draggable="false"
                            />
                        </button>

                        <div
                            id="psyduck-dialog"
                            role="status"
                            aria-live="polite"
                            className="pointer-events-none absolute left-[4.75rem] top-0 z-10 w-max max-w-[min(17rem,calc(100vw-7.5rem))]"
                        >
                            {dialogVisible && (
                                <PokemonDialog
                                    key={dialogLine}
                                    text={dialogLine}
                                    className="poke-dialog--tail-left poke-dialog--enter"
                                />
                            )}
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold leading-tight sm:text-2xl">
                        <PsychicText text="Hey, I’m Gaurav." />
                    </h1>
                </div>

                <p className="text-sm leading-relaxed text-black/80 sm:text-base">
                    <PsychicText split="words" text="I build web applications with React and TypeScript that are fast, reliable, and thoughtfully designed." />
                </p>

                <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                    <PsychicText split="words" text="Most of my current work is at Ecosail Infotech, where I help design, build, and maintain core product features across the frontend." />
                </p>

                <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                    <PsychicText split="words" text="Outside of work, I build tools, small applications, and experiments." />
                </p>

                <section className="space-y-3 pt-6">
                    <h2 className={SECTION_LABEL_CLASS}>
                        <PsychicText split="words" text="Things I’ve built" />
                    </h2>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <Link to="/json-toolkit" className={`text-sm sm:text-base ${LINK_CLASS}`}>
                            <PsychicText split="words" text="JSON Toolkit" />
                            <span aria-hidden="true" className="ml-1">
                                →
                            </span>
                        </Link>
                        <span className="text-sm text-black/55">
                            <PsychicText split="words" text="Format, validate, and visualize JSON." />
                        </span>
                    </div>
                </section>

                <section className="space-y-3 pt-2">
                    <h2 className={SECTION_LABEL_CLASS}>
                        <PsychicText split="words" text="Contact" />
                    </h2>
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-black/70 sm:text-base">
                        <a href="https://github.com/gauravBangade" target="_blank" rel="noreferrer" className={LINK_CLASS}>
                            <PsychicText split="words" text="GitHub" />
                            {EXTERNAL_MARK}
                        </a>
                        {DOT}
                        <a
                            href="https://www.linkedin.com/in/gaurav-bangade-9a2430222/"
                            target="_blank"
                            rel="noreferrer"
                            className={LINK_CLASS}
                        >
                            <PsychicText split="words" text="LinkedIn" />
                            {EXTERNAL_MARK}
                        </a>
                        {DOT}
                        <button
                            type="button"
                            onClick={copyEmail}
                            aria-label={`Copy email address ${email} to clipboard`}
                            className={LINK_CLASS}
                        >
                            <PsychicText split="words" text="email" />
                        </button>
                    </p>
                </section>

                {/* Toast */}
                <Toast
                    message={toastMessage}
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </PsychicContext>
    );
}
