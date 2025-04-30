interface HeaderProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  noMargin?: boolean;
}

export const Header = (props: HeaderProps) => {
  const { title, description, noMargin } = props;
  return (
    <div className={`flex flex-col gap-2 ${noMargin ? "" : "mb-4"}`}>
      <div className="text-2xl font-bold">{title}</div>
      {description && (
        <div className="text-sm text-gray-500 font-normal">{description}</div>
      )}
    </div>
  );
};
