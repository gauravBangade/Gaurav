import { useState } from "react";
import Toast from "./Toast";

export default function About() {
    const [showToast, setShowToast] = useState(false);

    const email = "bangadegaurav@gmail.com";

    const copyEmail = async () => {
        await navigator.clipboard.writeText(email);
        setShowToast(true);
    };

    return (
        <div className="relative mx-auto w-full max-w-2xl space-y-5 break-words px-5 py-3 text-[#1b1b1b] sm:px-6 md:px-4 lg:px-5">


            {/* Psyduck sprite */}
            <div className="flex flex-col items-start gap-1">
                <img
                    src="/sitting-psyduck.webp"
                    alt="Psyduck sprite"
                    className="float-psyduck w-16 h-16 opacity-80 pointer-events-none select-none"
                    draggable="false"
                />

                <h2 className="font-semibold leading-tight sm:text-2xl">
                    Hey, I’m Gaurav.
                </h2>
            </div>

            <p className="text-sm leading-relaxed text-black/80 sm:text-base">
                I build web applications with React and TypeScript that are fast,
                reliable, and thoughtfully designed.
            </p>

            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                Most of my current work is at Ecosail Infotech, where I help design,
                build, and maintain core product features across the frontend.
            </p>

            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                Outside of work, I build tools, small applications, and experiments.
            </p>

            <div className="space-y-2 pt-4 text-sm text-black/60 sm:text-base">
                <p>
                    You can find most of my work on{" "}
                    <a
                        href="https://github.com/gauravBangade"
                        target="_blank"
                        className="break-all underline underline-offset-4 transition hover:text-black"
                    >
                        GitHub
                    </a>.
                </p>

                <p>
                    The best way to reach me is via{" "}
                    <a
                        href="https://www.linkedin.com/in/gaurav-bangade-9a2430222/"
                        target="_blank"
                        className="break-all underline underline-offset-4 transition hover:text-black"
                    >
                        LinkedIn
                    </a>{" "}
                    or{" "}
                    <span className="inline-flex items-center gap-1">
                        {/* mailto link */}
                        <a
                            onClick={copyEmail}
                            className="underline underline-offset-4 transition hover:text-black"
                        >
                            email
                        </a>
                    </span>.
                </p>
            </div>
            {/* Toast */}
            <Toast
                message="Email copied to clipboard ✓"
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
