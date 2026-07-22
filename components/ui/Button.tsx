import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonPrimary({ className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`w-full rounded-[10px] bg-orange px-3.5 py-3.5 font-sans text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(217,68,10,0.15)] transition-all hover:bg-orange-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
    );
}

export function ButtonSecondary({ className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`w-full rounded-[10px] border-[1.5px] border-line bg-white px-3.25 py-3.25 font-sans text-[14px] font-semibold text-ink transition-colors hover:border-ink-faint disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />
    );
}

export function ButtonGlass({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-[14px] border border-orange/25 bg-linear-to-br from-orange/75 via-orange/70 to-orange-deep/70 px-3.5 py-3.5 font-sans text-[15px] font-semibold text-white backdrop-blur-md backdrop-saturate-150 shadow-[0_8px_20px_rgba(217,68,10,0.16),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all hover:from-orange/55 hover:via-orange/50 hover:to-orange-deep/60 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/25 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-white/70 disabled:bg-orange/20 disabled:bg-none disabled:text-orange-deep/70 disabled:opacity-100 disabled:ring-1 disabled:ring-inset disabled:ring-orange/20 disabled:shadow-[0_4px_12px_rgba(217,68,10,0.08),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(217,68,10,0.08)] ${className}`}
    />
  );
}
