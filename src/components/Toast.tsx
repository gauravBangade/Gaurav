import { useEffect, useState } from "react";

type ToastProps = {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
};

export default function Toast({
    message,
    show,
    onClose,
    duration = 2000,
}: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!show) return;

        const mountTimer = setTimeout(() => {
            setVisible(true);
        }, 0);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => {
            clearTimeout(mountTimer);
            clearTimeout(timer);
        };
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <>
            <style>{`
                @keyframes toast-glow-pulse {
                    0%, 100% { box-shadow: 0 0 16px 2px rgba(99,210,255,0.45), 0 0 40px 8px rgba(99,210,255,0.18), 0 4px 24px 0 rgba(0,0,0,0.5); }
                    50%       { box-shadow: 0 0 28px 6px rgba(160,99,255,0.55), 0 0 60px 16px rgba(160,99,255,0.22), 0 4px 24px 0 rgba(0,0,0,0.5); }
                }
                .toast-glow {
                    animation: toast-glow-pulse 2.4s ease-in-out infinite;
                }
            `}</style>

            <div
                className="fixed top-5 right-5 z-[999] flex flex-col items-end pointer-events-none"
            >
                <div
                    className={`
                        pointer-events-auto
                        transform transition-all duration-300 ease-out
                        ${visible
                            ? "translate-x-0 opacity-100 scale-100"
                            : "translate-x-6 opacity-0 scale-95"
                        }
                    `}
                >
                    <div
                        className="toast-glow relative overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl px-5 py-3 text-sm font-medium text-white"
                        style={{
                            background: "linear-gradient(135deg, rgba(20,20,30,0.97) 60%, rgba(40,30,60,0.97) 100%)",
                        }}
                    >
                        {/* Shimmer accent line at top */}
                        <div
                            className="absolute inset-x-0 top-0 h-px"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(99,210,255,0.7) 40%, rgba(160,99,255,0.7) 70%, transparent 100%)",
                            }}
                        />

                        {/* Soft inner glow */}
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                background: "radial-gradient(ellipse at 50% -20%, rgba(99,210,255,0.1) 0%, transparent 70%)",
                            }}
                        />

                        <span className="relative z-10 tracking-wide">{message}</span>
                    </div>
                </div>
            </div>
        </>
    );
}