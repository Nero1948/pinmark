import Link from "next/link";
import { PackCard } from "@/components/PackCard";
import { getAllPacks } from "@/lib/game";

export default function HomePage() {
  const packs = getAllPacks();

  return (
    <main className="pm-home">
      <header className="pm-hero">
        <span className="pm-hero__deco pm-hero__deco--1" aria-hidden="true">☁️</span>
        <span className="pm-hero__deco pm-hero__deco--2" aria-hidden="true">☁️</span>
        <span className="pm-hero__deco pm-hero__deco--3" aria-hidden="true">🗺️</span>
        <span className="pm-hero__deco pm-hero__deco--4" aria-hidden="true">⛰️</span>
        <div className="pm-hero__inner">
          <div className="pm-hero__badge">📍</div>
          <h1 className="pm-hero__title">Pinmark</h1>
          <p className="pm-hero__tagline">Aotearoa Explorer</p>
          <p className="pm-hero__sub">
            Look at the photo. Drop a pin on the map. How well do you know Aotearoa New Zealand?
          </p>
        </div>
        <svg
          className="pm-hero__wave"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,40 C240,75 480,5 720,32 C960,60 1200,15 1440,42 L1440,70 L0,70 Z"
            fill="#fbf6ea"
          />
        </svg>
      </header>

      <section className="pm-packs">
        <h2 className="pm-packs__heading">Choose Your Pack 🧭</h2>
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
