import Upcoming from "./Upcoming";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex min-h-screen text-blue">
      <Upcoming />
    </main>
  );
}
