interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto flex min-h-screen max-w-100 flex-col px-6 ${className}`}>
      {children}
    </div>
  );
}
