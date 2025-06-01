import Footer from "@/components/footer/footer";
import HeroSection from "@/components/hero/hero-section";

export default function Home() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
