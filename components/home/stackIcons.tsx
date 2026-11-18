import Image from "next/image";
import {
  siCss, siExpress, siFigma, siGit, siGithub, siHtml5, siJavascript,
  siLaravel, siMongodb, siMysql, siNextdotjs, siNodedotjs, siPhp,
  siPostgresql, siPython, siReact, siTailwindcss, siTypescript,
  siVercel,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import type { creativeTools, techStack } from "@/lib/data";

type Tool = (typeof techStack)[number] | (typeof creativeTools)[number];

const stackIcons: Record<Tool, SimpleIcon | string | null> = {
  React: siReact,
  "Next.js": siNextdotjs,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  HTML5: siHtml5,
  CSS3: siCss,
  "Tailwind CSS": siTailwindcss,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Python: siPython,
  Java: "/images/java-icon.svg",
  PHP: siPhp,
  Laravel: siLaravel,
  SQL: "/images/sql-icon.svg",
  MongoDB: siMongodb,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  Git: siGit,
  Github: siGithub,
  Vercel: siVercel,
  Photoshop: "/images/photoshop-icon.svg",
  Figma: siFigma,
};

export function StackIcon({ name, brandColors = false }: { name: Tool; brandColors?: boolean }) {
  const icon = stackIcons[name];

  if (!icon) return null;

  if (typeof icon === "string") {
    if (brandColors && name === "Java") {
      return <Image src={icon} alt="" width={24} height={24} unoptimized className="size-4 shrink-0" />;
    }

    if (brandColors && name === "SQL") {
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="#4479A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    }

    return (
      <span
        aria-hidden="true"
        className="block size-4 shrink-0 bg-current"
        style={{
          maskImage: `url("${icon}")`,
          WebkitMaskImage: `url("${icon}")`,
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4 shrink-0"
      style={brandColors ? { color: ["000000", "0A0A0A", "181717"].includes(icon.hex.toUpperCase()) ? "var(--text)" : `#${icon.hex}` } : undefined}
    >
      <path d={icon.path} />
    </svg>
  );
}
