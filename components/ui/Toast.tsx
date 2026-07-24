"use client";

import type { CSSProperties } from "react";
import {
  Toaster as SonnerToaster,
  toast,
} from "sonner";

export { toast };

export const Toaster = () => (
  <SonnerToaster
    position="top-center"
    visibleToasts={3}
    richColors
    offset="32px"
    style={
      {
        "--width": "300px",
        "--gap": "6px",
      } as CSSProperties
    }
    toastOptions={{
      duration: 4000,
      classNames: {
        toast:
          "!min-h-0 !rounded-xl !border !px-3 !py-2.5 !shadow-md !gap-2",
        title:
          "!text-[12.5px] !font-semibold !leading-4",
        description:
          "!text-[10.5px] !leading-4 !mt-0.5",
        icon: "!size-4",
      },
    }}
  />
);