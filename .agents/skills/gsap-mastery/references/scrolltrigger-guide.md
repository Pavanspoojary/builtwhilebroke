# ScrollTrigger Guide: Pin, Scrub & Snap

A master reference for creating pinned viewports, scrubbed narrative sequences, and parallax sections with GSAP ScrollTrigger.

---

## 1. ScrollTrigger Configuration Fundamentals

```ts
ScrollTrigger.create({
  trigger: ".target-element",
  start: "top center",       // When top of element hits center of viewport
  end: "bottom top",         // When bottom of element hits top of viewport
  pin: true,                 // Pin target during scroll
  pinSpacing: true,          // Add padding to prevent overlap
  scrub: 1,                  // 1 second smooth catch-up lag (true for instant sync)
  markers: false,            // Visual debug guides
  toggleActions: "play none none reverse", // [onEnter, onLeave, onEnterBack, onLeaveBack]
  onUpdate: (self) => {
    console.log("Progress:", self.progress);
  },
});
```

---

## 2. Horizontal Scroll Section Scrub

Transforms vertical page scrolling into smooth horizontal sliding across a multi-panel container:

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalTrack({ panels }: { panels: { title: string; desc: string }[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-zinc-950">
      <div ref={trackRef} className="flex h-full w-fit">
        {panels.map((panel, idx) => (
          <div
            key={idx}
            className="flex h-full w-screen flex-shrink-0 items-center justify-center p-12 border-r border-white/10"
          >
            <div className="max-w-xl text-center">
              <h2 className="text-5xl font-bold text-white mb-4">{panel.title}</h2>
              <p className="text-zinc-400 text-lg">{panel.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 3. Stacking Card Deck with Diminution

Cards pin and scale down sequentially as subsequent cards slide over them:

```ts
const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

cards.forEach((card, index) => {
  if (index === cards.length - 1) return; // Last card doesn't shrink
  
  gsap.to(card, {
    scale: 0.9,
    opacity: 0.4,
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top top+=80px",
      end: "bottom top",
      scrub: true,
      pin: true,
      pinSpacing: false, // Allows next card to stack directly over
    },
  });
});
```
