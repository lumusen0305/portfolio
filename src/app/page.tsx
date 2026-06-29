import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { LogicCircuit } from "@/components/sections/logicCircuit";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

// Page order: Hero → Services → Work → Logic Circuit → About → Skills → Contact
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Work />
        <LogicCircuit />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
