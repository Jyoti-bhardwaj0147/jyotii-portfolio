"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, useGSAP);

export default function LettersFlipping() {
  useGSAP(() => {
    const splits = new Map<HTMLElement, SplitText>();

    const initialize = () => {
      document.querySelectorAll<HTMLElement>(".letter-flip").forEach((element) => {
        if (splits.has(element)) return;

        const split = SplitText.create(element, {
          type: "chars,words",
          wordsClass: "word",
          charsClass: "char",
          mask: "words",
          autoSplit: true,
          onSplit(self) {
            self.words.forEach((word) => {
              const content = word.innerHTML;
              word.innerHTML = "";

              const before = document.createElement("div");
              before.classList.add("before");
              before.innerHTML = content;

              const after = document.createElement("div");
              after.classList.add("after");
              after.setAttribute("aria-hidden", "true");
              after.innerHTML = content;

              word.append(before, after);
            });
          },
        });

        splits.set(element, split);
      });

      for (const [element, split] of splits) {
        if (!element.isConnected) {
          split.revert();
          splits.delete(element);
        }
      }
    };

    initialize();
    const observer = new MutationObserver(initialize);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      splits.forEach((split) => split.revert());
      splits.clear();
    };
  });

  return null;
}
