import { ButtonSecondary } from "@/components/ui/Button";

export function Divider({ text }: { text: string }) {
    return (
        <div className="my-6 flex items-center gap-3 text-[12.5px] font-medium text-ink-faint before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
            {text}
        </div>
    );
}

export function SocialRow() {
    return (
        <div className="mb-7 flex gap-[10px]">
            <ButtonSecondary className="flex items-center justify-center gap-2">
                🍎 Apple
            </ButtonSecondary>
            <ButtonSecondary className="flex items-center justify-center gap-2">
                G Google
            </ButtonSecondary>
        </div>
    );
}
