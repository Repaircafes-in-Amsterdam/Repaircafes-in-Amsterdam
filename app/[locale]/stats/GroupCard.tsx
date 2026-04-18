export default function GroupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border-blue border-2 bg-white">
      <div className="bg-blue flex items-center justify-between gap-3 px-3 py-2 text-white">
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="p-3">{children}</div>
    </article>
  );
}
