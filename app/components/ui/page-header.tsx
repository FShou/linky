
interface PageHeaderProps {
  title: string,
  subTitle: string,
  children?: React.ReactNode
}
export default function PageHeader({ title, subTitle, children}: PageHeaderProps) {
  return (
    <header className="flex items-center">
      <div>
        <h1 className="text-xl text-primary font-semibold">{title}</h1>
        <p className="hidden md:block text-sm text-muted-foreground">
          {subTitle}
        </p>
      </div>
      <div className="ml-auto justify-self-end">
        {children}
      </div>
    </header>
  );
}
