import { preload } from "react-dom";
import { HomeLanding } from "@/components/HomeLanding";

preload("/hero.mp4", { as: "video" });

export default function Home() {
  return <HomeLanding />;
}
