import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
    </main>
  );
}
