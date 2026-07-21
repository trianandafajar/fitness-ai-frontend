interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({
  children,
  className = "",
}: PageContainerProps) => {
  return (
    <div
      className={`mx-auto flex min-h-screen max-w-100 flex-col px-6 ${className}`}
    >
      {children}
    </div>
  );
};

PageContainer.displayName = "PageContainer";

export default PageContainer;