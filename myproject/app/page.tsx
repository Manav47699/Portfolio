import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import LabSection from "@/components/home/LabSection";
import FeedbackForm from "@/components/home/FeedbackForm";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectsShowcase />
      <LabSection />
      <FeedbackForm />
    </main>
  );
}
