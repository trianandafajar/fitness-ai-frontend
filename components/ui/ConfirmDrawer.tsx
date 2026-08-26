"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import {
  Modal,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

type ConfirmFunction = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFunction | null>(null);

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [options, setOptions] = useState<ConfirmOptions>({});

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const confirm = useCallback<ConfirmFunction>((newOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(newOptions);
      setOpen(true);
    });
  }, []);

  const resolveConfirm = useCallback((value: boolean) => {
    setOpen(false);

    resolverRef.current?.(value);
    resolverRef.current = null;
  }, []);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (!value) {
        resolveConfirm(false);
      }
    },
    [resolveConfirm],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {isDesktop ? (
        <Modal open={open} onOpenChange={handleOpenChange}>
          <ModalHeader className="items-center text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle size={24} />
            </div>
            <ModalTitle className="font-display text-xl">
              {options.title ?? "Are you sure?"}
            </ModalTitle>
            <p className="max-w-sm text-sm leading-6 text-ink-soft">
              {options.description ?? "This action cannot be undone."}
            </p>
          </ModalHeader>
          <ModalFooter>
            <div className="grid grid-cols-2 gap-2.5">
              <ButtonSecondary
                type="button"
                onClick={() => resolveConfirm(false)}
                className="w-full py-3 text-sm"
              >
                {options.cancelText ?? "Cancel"}
              </ButtonSecondary>

              <button
                type="button"
                onClick={() => resolveConfirm(true)}
                className="flex w-full items-center justify-center rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger/90"
              >
                {options.confirmText ?? "Delete"}
              </button>
            </div>
          </ModalFooter>
        </Modal>
      ) : (
        <Drawer open={open} onOpenChange={handleOpenChange} side="bottom">
          <DrawerContent>
            <DrawerHeader className="items-center px-6 pb-5 pt-3 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <AlertTriangle size={24} />
              </div>

              <DrawerTitle className="font-display text-xl">
                {options.title ?? "Are you sure?"}
              </DrawerTitle>

              <p className="max-w-sm text-sm leading-6 text-ink-soft">
                {options.description ?? "This action cannot be undone."}
              </p>
            </DrawerHeader>

            <DrawerFooter>
              <div className="grid grid-cols-2 gap-2.5">
                <ButtonSecondary
                  type="button"
                  onClick={() => resolveConfirm(false)}
                  className="w-full py-3 text-sm"
                >
                  {options.cancelText ?? "Cancel"}
                </ButtonSecondary>

                <button
                  type="button"
                  onClick={() => resolveConfirm(true)}
                  className="flex w-full items-center justify-center rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white transition hover:bg-danger/90"
                >
                  {options.confirmText ?? "Delete"}
                </button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
};
