import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    rightElement?: ReactNode;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
    ({ label, id, rightElement, ...props }, ref) => {
        return (
            <div className="mb-4.5">
                <label
                    htmlFor={id}
                    className="mb-1.75 block whitespace-nowrap text-[13px] font-semibold text-ink"
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        {...props}
                        className={`w-full rounded-[10px] border-[1.5px] border-line bg-surface font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white ${rightElement ? "pr-10" : ""} px-3.5 py-3.25`}
                    />
                    {rightElement && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Field.displayName = "Field";

export default Field;
