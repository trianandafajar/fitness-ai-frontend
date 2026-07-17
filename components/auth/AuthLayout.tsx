import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="mx-auto flex min-h-screen max-w-100 flex-col justify-center px-6 py-8 sm:py-10">
            {children}
        </div>
    );
}
