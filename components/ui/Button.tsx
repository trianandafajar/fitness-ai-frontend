import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonPrimary({ className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`w-full rounded-[10px] bg-orange px-3.5 py-3.5 font-sans text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(217,68,10,0.15)] transition-all hover:bg-orange-deep active:scale-[0.99] ${className}`}
        />
    );
}

export function ButtonSecondary({ className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`w-full rounded-[10px] border-[1.5px] border-line bg-white px-3.25 py-3.25 font-sans text-[14px] font-semibold text-ink transition-colors hover:border-ink-faint ${className}`}
        />
    );
}
