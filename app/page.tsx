import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Stats from "@/components/sections/Stats";
import Social from "@/components/sections/Social";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Stats />
        <Social />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
