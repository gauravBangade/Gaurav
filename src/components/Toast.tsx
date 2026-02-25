import { useEffect } from "react";

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
    useEffect(() => {
        if (!show) return;

        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [show, duration, onClose]);

    return (
        <div
            className={`
        pointer-events-none fixed top-6 right-6 z-[999]
        transition-all duration-300 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
        >
            <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-white/10 text-white text-sm px-4 py-2 rounded-xl shadow-2xl">
                {message}
            </div>
        </div>
    );
}