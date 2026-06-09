import { notFound } from "next/navigation";
import { getPack, getLocationsForPack, getAllPacks } from "@/lib/game";
import { PinmarkGame } from "@/components/PinmarkGame";

type Props = {
  params: Promise<{ packId: string }>;
};

export async function generateStaticParams() {
  return getAllPacks().map((p) => ({ packId: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Not found" };
  return {
    title: `${pack.title} | Pinmark`,
    description: pack.blurb
  };
}

export default async function PlayPage({ params }: Props) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  const locations = getLocationsForPack(pack);

  return <PinmarkGame pack={pack} locations={locations} />;
}
