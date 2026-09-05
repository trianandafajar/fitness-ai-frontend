"use client";

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { createContext } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface ModalContextValue {
  titleId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal components must be used inside <Modal />");
  }

  return context;
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  dismissible?: boolean;
}

export const Modal = ({
  open,
  onOpenChange,
  children,
  dismissible = true,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    if (dismissible) onOpenChange(false);
  }, [dismissible, onOpenChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let timeout = 0;

    if (open) {
      setPresent(true);
      setVisible(false);

      document.body.style.overflow = "hidden";

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setVisible(true);
          panelRef.current?.focus();
        });
      });
    } else {
      setVisible(false);
      document.body.style.overflow = "";

      timeout = window.setTimeout(() => {
        setPresent(false);
      }, 200);
    }

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || !present) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={close}
        className={cx(
          "absolute inset-0 bg-black/40",
          "transition-opacity duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      <ModalContext.Provider value={{ titleId }}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          className={cx(
            "relative w-full max-w-sm rounded-3xl bg-card shadow-[0_0_40px_rgba(0,0,0,0.15)]",
            "outline-none transition-all duration-200 ease-out",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0",
          )}
        >
          {children}
        </div>
      </ModalContext.Provider>
    </div>,
    document.body,
  );
};

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  titleId?: string;
}

export const ModalHeader = ({
  className,
  ...props
}: ModalHeaderProps) => (
  <div className={cx("flex flex-col gap-1.5 px-6 pb-4 pt-6", className)} {...props} />
);

export const ModalTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId } = useModal();

  return (
    <h2
      id={titleId}
      className={cx("text-lg font-semibold text-ink", className)}
      {...props}
    />
  );
};

export const ModalFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx("mt-auto flex flex-col gap-2 border-t border-line p-5", className)}
    {...props}
  />
);