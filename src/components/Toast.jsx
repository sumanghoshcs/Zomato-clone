import React, { useEffect, useState } from "react";

let listeners = [];
let nextId = 1;

function emit(toasts) {
  listeners.forEach((l) => l(toasts));
}

export function toast(message, type = "success") {
  const id = nextId++;
  emit((current) => [...current, { id, message, type }]);
  setTimeout(() => dismissToast(id), 3500);
}

export function dismissToast(id) {
  emit((current) => current.filter((t) => t.id !== id));
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (t) => setToasts(t);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center px-4 pointer-events-none w-full max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto w-full max-w-sm rounded-xl px-4 py-3 shadow-2xl text-white flex items-center gap-3 animate-toast-in ${
            t.type === "error" ? "bg-red-600" : "bg-zomato"
          }`}
        >
          <span className="text-lg">
            {t.type === "error" ? "⚠" : "✓"}
          </span>
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button
            className="text-white/80 hover:text-white text-xl leading-none"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toaster;
