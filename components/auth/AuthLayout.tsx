import { ReactNode } from "react";
import PageContainer from "@/components/ui/PageContainer";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <PageContainer className="justify-center py-8 sm:py-10 px-6">
            {children}
        </PageContainer>
    );
}
