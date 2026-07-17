import Image from "next/image";
import { APP_BRAND } from "@/lib/app-config";

export default function Logo() {
    const prefix = "Fitness"
    const suffix = APP_BRAND.startsWith(prefix) ? APP_BRAND.slice(prefix.length) : ""
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/logo.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
            />
            <div className="font-display text-lg font-bold tracking-tight">
                {prefix}<span className="text-orange">{suffix}</span>
            </div>
        </div>
    );
}
