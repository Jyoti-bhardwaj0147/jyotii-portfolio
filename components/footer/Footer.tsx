
import { FloatingDock } from "@/components/ui/FloatingDock";
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";


import FooterNavigation from "./FooterNavigation";


export default function Footer({ pinned = false }: { pinned?: boolean }) {
  const year = new Date().getFullYear();

  const links = [
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/Jyoti-bhardwaj0147",
    }, 
    {
      title: "Facebook",
      icon: (
        <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.facebook.com/bhardwajjyotii1177/",
    }, 
    {
      title: "Instagram",
      icon: (
        <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.instagram.com/jyotiibhardwaj17/",
    },  
    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/jyotii-bhardwaj/",
    }, 
    {
      title: "Whatsapp",
      icon: (
        <IconBrandWhatsapp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://wa.me/917018064180",
    },
    {
      title: "Email",
      icon: (
        <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "mailto:jyotiibhardwaj11@gmail.com",
    },
    {
      title: "Discord",
      icon: (
        <IconBrandDiscord className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://discord.com/users/1522156933900144778",
    },    
  ];

  return (
    <footer className={`${pinned ? "sticky bottom-0 -z-10" : "relative isolate"} bg-surface py-10`}>
      
      <div className=" mx-auto flex max-w-7xl flex-col gap-8 px-5 text-sm text-secondary sm:px-8 lg:px-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-end justify-between gap-12">
          <div>
            <p className="mt-1 text-accent tracking-[0.28em]">Freelance Next.js Developer</p>
            <h2 className="font-display font-bold text-foreground mt-3 sm:mt-5 text-5xl sm:text-9xl">Jyotii</h2>
            <div className="flex items-center justify-start h-[3rem] sm:h-[5rem] w-full mt-5">
              <FloatingDock
                items={links}
              />
            </div>
            
          </div>
          
          
          <div className="flex item-start justify-content flex-col gap-y-4 ">
            {/* Footer Navigation */}
            <FooterNavigation />
            {/* <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:tracking-[0.28em] tracking-[0.16em] tracking-[0.28em]" aria-label="Footer navigation">
              <a className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="#top">Home</a>
              <a className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="#about">About</a>
              <a className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="#work">Work</a>
              <a className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="#stack">Stack</a>
              <a className="scramble-text hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="#contact">Contact</a>
            </nav> */}

            {/* Social Links */}
            {/* <div className="flex hidden  flex-wrap gap-x-6 gap-y-2 sm:tracking-[0.28em] tracking-[0.16em]" aria-label="Social links">
              <a className="hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a className="hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href={contact.email}>Email</a>
              <a className="hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href={contact.whatsapp}>WhatsApp</a>
            </div> */}

          </div>


        </div>

        <div className="flex flex-col gap-6 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8 border-t border-line pt-5">
          <p className="text-sm text-muted">
            © {year} Jyotii Bhardwaj. All rights reserved.
          </p>
          <div className=" flex flex-shrink-0 md:gap-8 items-center justify-between  font-mono text-white">
            <div className="text-xs">Lives in India</div>
            <div className="text-xs text-gray-300 opacity-50">Available worldwide</div>
          </div>


        </div>


      </div>
    </footer>
  );
}
