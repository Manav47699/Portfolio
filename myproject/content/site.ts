// Single source of truth for personal info used across the site,
// SEO metadata and the Lucky chatbot's knowledge base.

export const site = {
  name: "Manav Acharya",
  shortName: "Manav",
  url: "https://www.manavacharya.com.np",
  role: "Computer Engineer",
  tagline: "Computer engineer building AI that reaches into the physical world.",
  description:
    "Portfolio of Manav Acharya, a Computer Engineering student from Dharan, Nepal who builds robots, AI systems and full-stack web apps.",
  location: "Dharan, Nepal",
  timezone: "Asia/Kathmandu",
  email: "acharyamanav7@gmail.com",
  resume: "/resume.pdf",
  college: {
    degree: "Bachelor's in Computer Engineering (BCT)",
    name: "Purwanchal Campus, Dharan",
    alias: "Eastern Regional Campus",
  },
  rotatingLines: [
    "robots that win competitions.",
    "AI that runs on your own machine.",
    "websites for real businesses.",
    "things that sense, think and move.",
  ],
  awards: [
    {
      place: "1st Place",
      event: "Delta 5.0 Robothon",
      year: "2024",
      project: "pid-line-follower",
    },
    {
      place: "2nd Runner-up",
      event: "Technomorph Hackathon",
      year: "2025",
      project: "binfinity-ai-garbage-classifier",
    },
  ],
  socials: [
    { name: "GitHub", handle: "@Manav47699", url: "https://github.com/Manav47699", icon: "/icons/github.svg" },
    { name: "LinkedIn", handle: "Manav Acharya", url: "https://www.linkedin.com/in/manav-acharya-a252272b8/", icon: "/icons/linkedin.svg" },
    { name: "Instagram", handle: "@manav.ar", url: "https://www.instagram.com/manav.ar/", icon: "/icons/instagram.svg" },
    { name: "Facebook", handle: "manav.acharya.503", url: "https://www.facebook.com/manav.acharya.503/", icon: "/icons/facebook.svg" },
  ],
  languages: ["Nepali", "English", "Hindi"],
} as const;

export type TechItem = { name: string; icon: string; invert?: boolean };

export const techStack: { group: string; items: TechItem[] }[] = [
  {
    group: "Languages",
    items: [
      { name: "Python", icon: "/icons/python.svg" },
      { name: "C", icon: "/icons/c.svg" },
      { name: "C++", icon: "/icons/cpp.svg" },
      { name: "JavaScript", icon: "/icons/javascript.svg" },
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "HTML", icon: "/icons/html.svg" },
      { name: "CSS", icon: "/icons/css.svg" },
    ],
  },
  {
    group: "Web & Backend",
    items: [
      { name: "Django", icon: "/icons/django.svg" },
      { name: "FastAPI", icon: "/icons/fastapi.svg" },
      { name: "Next.js", icon: "/icons/nextjs.svg" },
      { name: "Tailwind", icon: "/icons/tailwind.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
    ],
  },
  {
    group: "AI & ML",
    items: [
      { name: "TensorFlow", icon: "/icons/tensorflow.svg" },
      { name: "PyTorch", icon: "/icons/pytorch.svg" },
      { name: "LangChain", icon: "/icons/langchain.svg" },
      { name: "Ollama", icon: "/icons/ollama.svg" },
      { name: "PyQt5", icon: "/icons/qt.svg" },
    ],
  },
  {
    group: "Hardware",
    items: [
      { name: "Arduino", icon: "/icons/arduino.svg" },
      { name: "ESP32", icon: "/icons/espressif.svg" },
      { name: "Raspberry Pi", icon: "/icons/raspberrypi.svg" },
    ],
  },
];
