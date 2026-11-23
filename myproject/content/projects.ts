// Every project on the site (home page rows, /projects, case-study pages)
// AND the Lucky chatbot read from this file. Add a project here, push, done.

export type ProjectCategory = "robotics" | "webapp" | "application";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  date: string; // ISO yyyy-mm-dd
  summary: string; // one line, used on cards
  description: string; // paragraph, used on case study + chatbot
  highlights: string[];
  tech: string[];
  video: string;
  poster: string;
  /** "portrait" videos are framed differently on cards */
  orientation?: "landscape" | "portrait";
  /** letterbox instead of crop (UI recordings with important edges) */
  contain?: boolean;
  repo: string;
  repoLabel?: string;
  live?: string;
  award?: string;
  featured?: boolean;
  archived?: boolean;
};

export const categoryMeta: Record<
  ProjectCategory,
  { label: string; short: string; accent: string; soft: string; ring: string; text: string }
> = {
  robotics: {
    label: "Hardware & Robotics",
    short: "robotics",
    accent: "bg-zinc-800",
    soft: "bg-zinc-100",
    ring: "border-zinc-700",
    text: "text-zinc-700",
  },
  webapp: {
    label: "Web Projects",
    short: "webapp",
    accent: "bg-blue-600",
    soft: "bg-blue-50",
    ring: "border-blue-500",
    text: "text-blue-700",
  },
  application: {
    label: "Downloadable Applications",
    short: "application",
    accent: "bg-green-600",
    soft: "bg-green-50",
    ring: "border-green-500",
    text: "text-green-700",
  },
};

export const projects: Project[] = [
  {
    slug: "pid-line-follower",
    title: "PID Line Follower Robot",
    category: "robotics",
    date: "2024-12-05",
    summary: "A line follower tuned with a PID controller. Took 1st place at Delta 5.0 Robothon.",
    description:
      "A competition line-following robot that reads the track with an IR sensor array and steers with a PID (proportional–integral–derivative) controller. Instead of the jerky bang-bang steering of simple line followers, the PID loop turns the sensor reading into a smooth correction, letting the robot hold the line through tight curves at speed. It won 1st place at the Delta 5.0 Robothon, a national-level techfest.",
    highlights: [
      "Won 1st place at Delta 5.0 Robothon (2024), a national-level techfest",
      "PID control turns the sensor array's line position into smooth differential steering",
      "You can try the same control loop live in the PID Lab on this site",
    ],
    tech: ["Arduino", "C++", "PID control", "IR sensor array", "Motor driver"],
    video: "/media/pid-line-follower.mp4",
    poster: "/media/pid-line-follower.jpg",
    repo: "https://github.com/navidadelpour/line-follower-robot",
    repoLabel: "Reference code",
    award: "1st Place · Delta 5.0 Robothon",
    featured: true,
  },
  {
    slug: "binfinity-ai-garbage-classifier",
    title: "BINFINITY: AI Garbage Classifier",
    category: "robotics",
    date: "2025-06-10",
    summary: "Smart bin that sees your waste, classifies it, and opens the right lid. 2nd runner-up at Technomorph 2025.",
    description:
      "BINFINITY is an end-to-end smart bin built for the Technomorph Hackathon, organised by the Robotics Club of Purwanchal Campus. A webcam feed is processed with OpenCV and YOLOv5 to classify waste as plastic or paper, MediaPipe tracks the user's hand for hands-free interaction, and the decision is sent over serial to an Arduino UNO that drives servo motors to open the correct bin. Ultrasonic sensors detect when a bin is full and LEDs signal status.",
    highlights: [
      "2nd Runner-up at Technomorph Hackathon 2025",
      "YOLOv5 + OpenCV real-time detection of plastic vs paper",
      "MediaPipe hand tracking for touch-free use",
      "Python to Arduino over serial; servos, IR and ultrasonic sensors on the hardware side",
      "Circuit prototyped in TinkerCAD before building",
    ],
    tech: ["Python", "YOLOv5", "OpenCV", "MediaPipe", "TensorFlow/Keras", "Arduino UNO", "Servo motors"],
    video: "/media/ai-garbage-classifier.mp4",
    poster: "/media/ai-garbage-classifier.jpg",
    orientation: "portrait",
    repo: "https://github.com/Manav47699/ROBOTICS-ai-garbage-classifier",
    award: "2nd Runner-up · Technomorph 2025",
    featured: true,
  },
  {
    slug: "catalyst",
    title: "Catalyst",
    category: "webapp",
    date: "2026-01-16",
    summary: "A launchpad for young entrepreneurs: community, mentorship, investment and an AI mentor.",
    description:
      "Catalyst is a platform for young entrepreneurs to grow their ventures, network with like-minded founders and get mentorship, both human and AI. It has a community feed and interest groups, a city-level partner map built with GeoPy and OpenStreetMap (privacy-friendly, no live GPS), a mentor marketplace with Stripe payments, an investment portal, and local LLM features through Ollama: a Llama 3.2 3B business mentor that asks follow-up questions, a Qwen-based RAG help bot on every page, and Whisper speech-to-text for hands-free brainstorming.",
    highlights: [
      "Next.js frontend with a Django + FastAPI backend",
      "AI mentor on Llama 3.2 (3B) via Ollama, RAG help bot with LangChain + Qwen",
      "Voice input with OpenAI Whisper",
      "Leaflet + GeoPy partner map that only uses city-level location",
      "Stripe-powered mentor marketplace and investment portal",
    ],
    tech: ["Next.js", "Django", "FastAPI", "Ollama", "LangChain", "Whisper", "Leaflet", "Stripe"],
    video: "/media/catalyst.mp4",
    poster: "/media/catalyst.jpg",
    repo: "https://github.com/Manav47699/Catalyst",
    featured: true,
  },
  {
    slug: "makalu-jadibuti",
    title: "Makalu Jadibuti Website",
    category: "webapp",
    date: "2025-11-20",
    summary: "Production website for Makalu Jadibuti Production Pvt. Ltd., a real client and live today.",
    description:
      "The official website for Makalu Jadibuti Production Pvt. Ltd., a Nepali herbal products company. Built with Next.js and Tailwind CSS and deployed to the client's own domain, it presents the company, its products and contact details.",
    highlights: [
      "Delivered for a real business and live in production",
      "Next.js + Tailwind CSS",
      "Deployed to the client's own domain",
    ],
    tech: ["Next.js", "React", "Tailwind CSS"],
    video: "/media/makalu-jadibuti.mp4",
    poster: "/media/makalu-jadibuti.jpg",
    repo: "https://github.com/Manav47699/Makalu-Jadibuti-Website",
    live: "https://makalujadibuti.com.np/",
    featured: true,
  },
  {
    slug: "agrinova",
    title: "Agrinova App",
    category: "application",
    date: "2024-12-25",
    summary: "Offline desktop app that identifies invasive plant species with a built-in CNN.",
    description:
      "AGRINOVA is an offline, downloadable desktop application that detects invasive plant species. It ships with a convolutional neural network built with TensorFlow and Keras, trained on more than 1,000 images across more than 5 classes, behind a PyQt5 interface. It was Manav's first neural-network project, and the README is honest that accuracy has room to grow.",
    highlights: [
      "Fully offline: the CNN model ships inside the app",
      "Trained on 1,000+ images across 5+ plant classes",
      "Desktop UI built with PyQt5",
    ],
    tech: ["Python", "TensorFlow", "Keras", "CNN", "PyQt5"],
    video: "/media/agrinova.mp4",
    poster: "/media/agrinova.jpg",
    contain: true,
    repo: "https://github.com/Manav47699/AGRINOVA-app",
    featured: true,
  },
  {
    slug: "desktop-calculator",
    title: "Desktop Calculator",
    category: "application",
    date: "2024-10-20",
    summary: "PyQt5 calculator with decimals, modulus and a light/dark theme toggle.",
    description:
      "A desktop calculator built with the PyQt5 graphics library. Beyond basic arithmetic it supports decimals, modulus, parentheses and a light/dark theme toggle.",
    highlights: ["Built with PyQt5", "Light / dark theme toggle", "Decimals, modulus and parentheses"],
    tech: ["Python", "PyQt5"],
    video: "/media/calculator.mp4",
    poster: "/media/calculator.jpg",
    contain: true,
    repo: "https://github.com/Manav47699/Calculator-app",
    archived: true,
  },
  {
    slug: "portfolio-v2",
    title: "Portfolio v2",
    category: "webapp",
    date: "2025-02-01",
    summary: "The previous version of this site, with a FastAPI + RAG chatbot.",
    description:
      "The second version of this portfolio, built with Next.js and Tailwind CSS and paired with a Python FastAPI backend: a RAG chatbot using Cohere embeddings, ChromaDB and Llama 3.1, deployed in Docker. The site you're on now is its successor.",
    highlights: ["Next.js + Tailwind CSS", "FastAPI RAG backend with Cohere, ChromaDB and Llama 3.1", "Dockerised backend"],
    tech: ["Next.js", "Tailwind CSS", "FastAPI", "ChromaDB", "Docker"],
    video: "/media/portfolio.mp4",
    poster: "/media/portfolio.jpg",
    repo: "https://github.com/Manav47699/Portfolio",
    archived: true,
  },
  {
    slug: "first-website",
    title: "First Website",
    category: "webapp",
    date: "2024-08-10",
    summary: "Where it started: the first portfolio, hand-written in HTML and CSS.",
    description: "Manav's first website and portfolio, hand-written with HTML, CSS and Tailwind.",
    highlights: ["HTML + CSS + Tailwind", "The starting point of everything else here"],
    tech: ["HTML", "CSS", "Tailwind"],
    video: "/media/first-website.mp4",
    poster: "/media/first-website.jpg",
    repo: "https://github.com/Manav47699/Old_Portfolio",
    archived: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const byDateDesc = (a: Project, b: Project) => +new Date(b.date) - +new Date(a.date);

export const formatMonth = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
