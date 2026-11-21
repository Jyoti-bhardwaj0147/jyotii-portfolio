import Image from "next/image";
import { GlareCard } from "@/components/ui/glare-card";

export default function AboutAside() {
  return (
    <aside aria-label="A note from Jyotii" className="flex min-w-0 flex-col align-middle gap-8 lg:sticky lg:top-24 lg:self-start">
      <GlareCard className="flex flex-col items-center justify-center">
      <div className="relative flex min-h-0 min-w-0 w-full flex-1 items-end overflow-hidden">
        
          <Image
            src="/images/jyotii-bhardwaj.png"
            alt="Portrait of Jyotii Bhardwaj"
            fill
            sizes="(min-width: 480px) 440px, calc(100vw - 40px)"
            className="object-cover object-top"
            priority
          />
        

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <p className="relative p-6 text-xs font-semibold uppercase tracking-[0.24em] text-white sm:p-8">Jyotii Bhardwaj / Developer &amp; designer</p>
      </div>
      
      <blockquote className="w-full shrink-0 border-t border-line bg-accent p-7 text-bg sm:p-9">
        <p className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-base sm:leading-snug text-align-center">
          &ldquo;Good design gets noticed. Thoughtful development makes it last.&rdquo;
        </p>
      </blockquote>
      </GlareCard>
    </aside>
  );
}
