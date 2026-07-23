"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
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

  const [options, setOptions] = useState<ConfirmOptions>({});

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

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

      <Drawer open={open} onOpenChange={handleOpenChange} side="bottom">
        <DrawerContent>
          <DrawerHeader className="items-center px-6 pb-5 pt-3 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
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
                className="flex w-full items-center justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                {options.confirmText ?? "Delete"}
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
