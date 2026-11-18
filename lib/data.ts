export type Project = {
  id: string;
  title: string;
  description: string;
  stackTags: string[];
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    id: "luna-cosmic",
    title: "Luna Cosmic",
    description:
      "🌙 Luna Cosmic - Explore moon phases, lunar cycles, and celestial insights through an immersive, modern interface.",
    stackTags: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Farmer Motion",
      "GSAP",
    ],
    imageSrc: "/images/projects/project-1.png",
    imageAlt: "Luna Cosmic project preview",
    href: "https://luna-cosmic.vercel.app/",
  },
  {
    id: "visualis",
    title: "Visualis focus",
    description:
      "Visualis is designed for general wellness and visual-focus exercises.",
    stackTags: ["React", "Next.js", "GSAP","Tailwind",],
    imageSrc: "/images/projects/project-2-v2.png",
    imageAlt: "Visualis focus",
    href: "https://visualis-focus.vercel.app/",
  },
  {
    id: "aura-interiors",
    title: "Aura Interiors",
    description: "Aura Interiors create quietly remarkable interiors where every detail has a purpose, and every space tells a story.",
    stackTags: ["Next.js", "GSAP", "Farmer Motion","Tailwind",],
    imageSrc: "/images/projects/project-3.png",
    imageAlt: "Aura Interiors project preview",
    href: "https://aura-interiors-v1.vercel.app/",
  },
  {
    id: "Portfolio",
    title: "Portfolio",
    description:
      "A portfolio of Next.js projects built with clean interfaces, smooth motion, and attention to detail.",
    stackTags: ["Next.js", "GSAP", "Three.js","Tailwind","Resend", "Framer Motion", "Vercel","React"],
    imageSrc: "/images/projects/project-4-v1.png",
    imageAlt: "Porfolio Jyotii next.js developer designer preview",
  },
  {
    id: "the-new-local",
    title: "The New Local",
    description: "A fast editorial home for curious people and local stories.",
    stackTags: ["Next.js", "MDX", "Tailwind"],
    imageSrc: "/images/projects/project-1.png",
    imageAlt: "The New Local project preview",
  },
  {
    id: "ops-console",
    title: "Ops Console",
    description: "A focused operations room that makes complex work legible.",
    stackTags: ["React", "Node.js", "SQL"],
    imageSrc: "/images/projects/project-1.png",
    imageAlt: "Ops Console project preview",
  },
];

export const techStack = [
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Python",
  "Java",
  "PHP",
  "Laravel",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Git",
  "Github",
  "Vercel",
] as const;

export const creativeTools = ["Photoshop", "Figma"] as const;

// TODO: Replace with Jyotii's email address.
export const contact = {
  whatsapp: "https://wa.me/917018064180",
  email: "mailto:<jyoti.kumari174315@gmail.com>",
};
