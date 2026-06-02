"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ClasesCTA from "@/components/ClasesCTA";
import Work from "@/components/Work/Work";
import Certifications from "@/components/Certifications";
import Collaboration from "@/components/Collaboration";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ClasesCTA />
      <Work />
      <Certifications />
      <Collaboration />
      <Contact />
      <Footer />
    </div>
  );
}
