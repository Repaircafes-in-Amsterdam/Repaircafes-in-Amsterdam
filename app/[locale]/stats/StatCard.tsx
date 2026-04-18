export default function StatCard({
  value,
  description,
}: {
  value: string;
  description: string;
}) {
  return (
    <section className="border-blue bg-blue-250 border-l-2 px-3 py-2">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{description}</p>
    </section>
  );
}
