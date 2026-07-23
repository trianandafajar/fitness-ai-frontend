"use client";

import {
  createContext,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DrawerSide = "top" | "right" | "bottom" | "left";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  dismissible: boolean;
  side: DrawerSide;
  titleId: string;
  descriptionId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error(
      "Drawer components must be used inside <Drawer />",
    );
  }

  return context;
};

interface DrawerProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissible?: boolean;
  side?: DrawerSide;
}

export const Drawer = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  dismissible = true,
  side = "bottom",
}: DrawerProps) => {
  const [internalOpen, setInternalOpen] =
    useState(defaultOpen);

  const titleId = useId();
  const descriptionId = useId();

  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }

      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <DrawerContext.Provider
      value={{
        open,
        setOpen,
        dismissible,
        side,
        titleId,
        descriptionId,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const DrawerTrigger = ({
  className,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useDrawer();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }}
      {...props}
    />
  );
};

interface DrawerContentProps
  extends HTMLAttributes<HTMLDivElement> {
  showHandle?: boolean;
}

export const DrawerContent = ({
  children,
  className,
  showHandle = true,
  ...props
}: DrawerContentProps) => {
  const {
    open,
    setOpen,
    dismissible,
    side,
    titleId,
    descriptionId,
  } = useDrawer();

  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const previousFocusRef = useRef<HTMLElement | null>(
    null,
  );

  const isVertical =
    side === "top" || side === "bottom";

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
      setDragOffset(0);

      previousFocusRef.current =
        document.activeElement as HTMLElement;

      document.body.style.overflow = "hidden";

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setVisible(true);
          contentRef.current?.focus();
        });
      });
    } else {
      setVisible(false);
      setDragOffset(0);

      document.body.style.overflow = "";

      timeout = window.setTimeout(() => {
        setPresent(false);
        previousFocusRef.current?.focus();
      }, 300);
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key === "Escape" &&
      dismissible
    ) {
      setOpen(false);
    }
  };

  const getPointerPosition = (
    event: PointerEvent<HTMLDivElement>,
  ) =>
    isVertical
      ? event.clientY
      : event.clientX;

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    dragStartRef.current =
      getPointerPosition(event);

    setDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging) return;

    const current =
      getPointerPosition(event);

    const offset =
      side === "bottom" ||
      side === "right"
        ? current - dragStartRef.current
        : dragStartRef.current - current;

    setDragOffset(Math.max(0, offset));
  };

  const handlePointerEnd = () => {
    setDragging(false);

    if (
      dragOffset > 100 &&
      dismissible
    ) {
      setDragOffset(0);
      setOpen(false);
      return;
    }

    setDragOffset(0);
  };

  const getDragStyle =
    (): CSSProperties | undefined => {
      if (!dragOffset) {
        return undefined;
      }

      switch (side) {
        case "top":
          return {
            transform: `translateY(-${dragOffset}px)`,
          };

        case "bottom":
          return {
            transform: `translateY(${dragOffset}px)`,
          };

        case "left":
          return {
            transform: `translateX(-${dragOffset}px)`,
          };

        case "right":
          return {
            transform: `translateX(${dragOffset}px)`,
          };
      }
    };

  const sideClasses: Record<
    DrawerSide,
    string
  > = {
    bottom: cx(
      "inset-x-0 bottom-0",
      "max-h-[90vh] w-full",
      "rounded-t-3xl border-t border-line",
      visible
        ? "translate-y-0"
        : "translate-y-full",
    ),

    top: cx(
      "inset-x-0 top-0",
      "max-h-[90vh] w-full",
      "rounded-b-3xl border-b border-line",
      visible
        ? "translate-y-0"
        : "-translate-y-full",
    ),

    left: cx(
      "inset-y-0 left-0",
      "h-full w-[85%] max-w-85",
      "rounded-r-3xl border-r border-line",
      visible
        ? "translate-x-0"
        : "-translate-x-full",
    ),

    right: cx(
      "inset-y-0 right-0",
      "h-full w-[85%] max-w-85",
      "rounded-l-3xl border-l border-line",
      visible
        ? "translate-x-0"
        : "translate-x-full",
    ),
  };

  if (!mounted || !present) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={() => {
          if (dismissible) {
            setOpen(false);
          }
        }}
        className={cx(
          "absolute inset-0 bg-black/40",
          "transition-opacity duration-300 ease-out",
          visible
            ? "opacity-100"
            : "opacity-0",
        )}
      />

      {/* Mengikuti max width aplikasi mobile */}
      <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-100">
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={getDragStyle()}
          className={cx(
            "pointer-events-auto absolute flex flex-col bg-white",
            "shadow-[0_0_40px_rgba(0,0,0,0.15)]",
            "outline-none",
            "transition-transform duration-300 ease-out",
            dragging && "transition-none",
            sideClasses[side],
            className,
          )}
          {...props}
        >
          {showHandle && (
            <div
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerEnd
              }
              onPointerCancel={
                handlePointerEnd
              }
              className={cx(
                "flex touch-none cursor-grab items-center justify-center active:cursor-grabbing",
                isVertical
                  ? "h-7 w-full"
                  : "h-full w-7",
                side === "top" &&
                  "order-last",
                side === "left" &&
                  "absolute right-0 top-0",
                side === "right" &&
                  "absolute left-0 top-0",
              )}
            >
              <div
                className={cx(
                  "rounded-full bg-line",
                  isVertical
                    ? "h-1.5 w-12"
                    : "h-12 w-1.5",
                )}
              />
            </div>
          )}

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "flex flex-col gap-1.5 px-5 py-4",
      className,
    )}
    {...props}
  />
);

export const DrawerTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  const { titleId } = useDrawer();

  return (
    <h2
      id={titleId}
      className={cx(
        "text-lg font-semibold text-ink",
        className,
      )}
      {...props}
    />
  );
};

export const DrawerDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  const { descriptionId } = useDrawer();

  return (
    <p
      id={descriptionId}
      className={cx(
        "text-sm text-ink-soft",
        className,
      )}
      {...props}
    />
  );
};

export const DrawerBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "flex-1 overflow-y-auto px-5",
      className,
    )}
    {...props}
  />
);

export const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "mt-auto flex flex-col gap-2 border-t border-line p-5",
      className,
    )}
    {...props}
  />
);

export const DrawerClose = ({
  className,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useDrawer();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    />
  );
};