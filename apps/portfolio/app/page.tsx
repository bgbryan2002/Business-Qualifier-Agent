import { Hero } from "@/components/hero/hero";
import { getBuyerNumbers } from "@/lib/vault";

export default function HomePage() {
  const n = getBuyerNumbers();
  return <Hero asOfDate={n.as_of_date} homeMetro={n.home_metro} hours={n.hours_per_week} />;
}
