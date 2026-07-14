import { ReactNode } from "react";

interface AuthLayoutProps {
    formSide: ReactNode;
    visualSide: ReactNode;
}

export default function AuthLayout({ formSide, visualSide }: AuthLayoutProps) {
    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-8 md:px-16 lg:px-24">
                <div className="mx-auto w-full max-w-100">{formSide}</div>
            </div>
            {visualSide}
        </div>
    );
}
