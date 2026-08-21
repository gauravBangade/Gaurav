import { useEffect, useRef, useState } from "react";
import PokemonDialog from "./PokemonDialog";
import PsychicText from "./PsychicText";
import Toast from "./Toast";
import { PsychicContext, usePsychicBlast, type PsychicPhase } from "../hooks/usePsychicBlast";

const LINK_CLASS =
    "break-all underline underline-offset-4 transition hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]";

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

    // One group for the whole section: every <PsychicText> below registers with it,
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
            <div className="relative mx-auto w-full max-w-2xl space-y-5 break-words px-5 py-3 text-[#1b1b1b] sm:px-6 md:px-4 lg:px-5">


                {/* Psyduck sprite — click it and it uses Confusion on the whole section */}
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
                            className="float-psyduck cursor-pointer rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
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

                    <h2 className="font-semibold leading-tight sm:text-2xl">
                        <PsychicText text="Hey, I’m Gaurav." />
                    </h2>
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

                <div className="space-y-2 pt-4 text-sm text-black/60 sm:text-base">
                    <p>
                        <PsychicText split="words" text="You can find most of my work on" />{" "}
                        <a href="https://github.com/gauravBangade" target="_blank" rel="noreferrer" className={LINK_CLASS}>
                            <PsychicText split="words" text="GitHub" />
                        </a>
                        <PsychicText split="words" text="." />
                    </p>

                    <p>
                        <PsychicText split="words" text="The best way to reach me is via" />{" "}
                        <a
                            href="https://www.linkedin.com/in/gaurav-bangade-9a2430222/"
                            target="_blank"
                            rel="noreferrer"
                            className={LINK_CLASS}
                        >
                            <PsychicText split="words" text="LinkedIn" />
                        </a>{" "}
                        <PsychicText split="words" text="or" />{" "}
                        <button
                            type="button"
                            onClick={copyEmail}
                            aria-label={`Copy email address ${email} to clipboard`}
                            className="cursor-pointer underline underline-offset-4 transition hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#466a52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfbf8]"
                        >
                            <PsychicText split="words" text="email" />
                        </button>
                        <PsychicText split="words" text="." />
                    </p>
                </div>
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
