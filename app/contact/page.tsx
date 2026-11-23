import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/header/Header";
import ContactForm from "@/components/contact/ContactForm";
import GlobalCollaboration from "@/components/contact/GlobalCollaboration";
import { contact } from "@/lib/data";


const socialLinks = [
  { label: "GitHub", href: "https://github.com/Jyoti-bhardwaj0147" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jyotii-bhardwaj/" },
  { label: "Facebook", href: "https://www.facebook.com/bhardwajjyotii1177/" },
  { label: "Instagram", href: "https://www.instagram.com/jyotiibhardwaj17/" },
  { label: "WhatsApp", href: contact.whatsapp },
  { label: "Call Me", href: "tel:+917018064180" },
];

export const metadata = pageMetadata("/contact", "Contact Jyotii Bhardwaj | Freelance Next.js Developer", "Discuss your next website with Jyotii Bhardwaj. Get in touch for freelance Next.js development, React websites, UI/UX design, and GSAP animations.");

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="top" className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:px-10 ">
          <div className="contact-panel borderS p-5 sm:p-8 lg:p-10 lg:pb-0">
            <section aria-labelledby="contact-heading" className="min-w-0">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Have a project in mind?</p>
              <h1 id="contact-heading" className="w-full font-display text-[clamp(3.25rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.06em] text-foreground">
                Let&apos;s make it real<span className="text-accent">.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-secondary sm:text-lg">
                Tell me what you&apos;re building. I&apos;d love to hear your idea and see where we can take it together.
              </p>
            </section>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
              <ContactForm />
              <GlobalCollaboration />
            </div>
          </div>

          <nav aria-label="Social links" className="mt-16 border-t border-line pt-8 sm:mt-20">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-muted">Find me elsewhere</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {socialLinks.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {label}<ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      </main>
    </>
  );
}
