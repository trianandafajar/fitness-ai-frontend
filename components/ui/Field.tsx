import { InputHTMLAttributes, forwardRef } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
    ({ label, id, ...props }, ref) => {
        return (
            <div className="mb-4.5">
                <label
                    htmlFor={id}
                    className="mb-1.75 block text-[13px] font-semibold text-ink"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={id}
                    {...props}
                    className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-3.25 font-sans text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white"
                />
            </div>
        );
    }
);

Field.displayName = "Field";

export default Field;
