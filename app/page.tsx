import Link from "next/link";
import { PackCard } from "@/components/PackCard";
import { getAllPacks } from "@/lib/game";

export default function HomePage() {
  const packs = getAllPacks();

  return (
    <main className="pm-home">
      <header className="pm-hero">
        <div className="pm-hero__inner">
          <div className="pm-hero__badge">📍</div>
          <h1 className="pm-hero__title">Pinmark</h1>
          <p className="pm-hero__tagline">Aotearoa Explorer</p>
          <p className="pm-hero__sub">
            Look at the photo. Drop a pin on the map. How well do you know Aotearoa New Zealand?
          </p>
        </div>
      </header>

      <section className="pm-packs">
        <h2 className="pm-packs__heading">Choose a Pack</h2>
        <div className="pm-packs__grid">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

      <footer className="pm-footer">
        <p>
          <Link href="/for-teachers">For Teachers</Link>
          {" · "}
          Made with aroha for Aotearoa classrooms
        </p>
      </footer>
    </main>
  );
}
