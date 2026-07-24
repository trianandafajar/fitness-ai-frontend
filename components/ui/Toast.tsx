"use client";

import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type ToastType = "success" | "error" | "info" | "default";

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  duration: number;
}

interface ToastOptions {
  description?: string;
  duration?: number;
}

let toastId = 0;
let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const addToast = (type: ToastType, title: string, options?: ToastOptions) => {
  const id = ++toastId;

  toasts = [
    ...toasts,
    {
      id,
      type,
      title,
      description: options?.description,
      duration: options?.duration ?? 4000,
    },
  ];

  emitChange();

  return id;
};

const removeToast = (id: number) => {
  toasts = toasts.filter((item) => item.id !== id);
  emitChange();
};

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    addToast("success", title, options),

  error: (title: string, options?: ToastOptions) =>
    addToast("error", title, options),

  info: (title: string, options?: ToastOptions) =>
    addToast("info", title, options),

  message: (title: string, options?: ToastOptions) =>
    addToast("default", title, options),

  dismiss: removeToast,
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => toasts;

const emptyToasts: ToastItem[] = [];
const getServerSnapshot = () => emptyToasts;

const ToastCard = ({ item }: { item: ToastItem }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleDismiss = () => {
    setLeaving(true);

    window.setTimeout(() => {
      removeToast(item.id);
    }, 200);
  };
  
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timeout = window.setTimeout(() => {
      handleDismiss();
    }, item.duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [item.duration]);

  const icon = {
    success: <CheckCircle2 className="size-5 text-green-600" />,
    error: <CircleAlert className="size-5 text-red-500" />,
    info: <Info className="size-5 text-blue-500" />,
    default: <Info className="size-5 text-ink-soft" />,
  }[item.type];

  return (
    <div
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.14)] transition-all duration-200 ${
        visible && !leaving
          ? "translate-y-0 opacity-100"
          : "-translate-y-3 opacity-0"
      }`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{item.title}</p>

        {item.description && (
          <p className="mt-0.5 text-[13px] leading-5 text-ink-soft">
            {item.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 text-ink-faint transition hover:bg-surface hover:text-ink"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export const Toaster = () => {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-100 mx-auto flex w-full max-w-100 flex-col gap-2 px-4">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  );
};
