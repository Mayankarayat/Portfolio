import Image from "next/image";
import type { CSSProperties } from "react";
import type { PopOutImage } from "@/content/story";
import { Tilt } from "./Tilt";

/** Depth of the cut-out layer, and the scale that cancels its perspective growth. */
const POP_Z = 30;
const PERSPECTIVE = 1400;
const POP_SCALE = (PERSPECTIVE - POP_Z) / PERSPECTIVE;

interface PopOutPortraitProps {
  image: PopOutImage;
  chips?: readonly string[];
  sizes: string;
}

/**
 * A photo card with Mayank stepping out of it: the card shows the photo from
 * the chin down, a transparent cut-out layer (head and shoulders) sits 30px in
 * front of it and continues above the card's top edge. Pointer tilt (desktop)
 * and a scroll-linked swing-in reveal the depth. Purely CSS 3D — crisp images,
 * no WebGL, no video.
 */
export function PopOutPortrait({ image, chips = [], sizes }: PopOutPortraitProps) {
  const { card, pop, overlap } = image;
  const width = card.width;
  // Room above the card for the part of the cut-out that rises out of it.
  const headroom = ((pop.height - overlap) / width) * 100;
  const overlapOfCard = (overlap / card.height) * 100;
  const featherOfPop = (overlap / pop.height) * 100;

  return (
    <div data-swing style={{ paddingTop: `${headroom}%` }}>
      <Tilt max={7}>
        <div className="relative" style={{ aspectRatio: `${width} / ${card.height}`, transformStyle: "preserve-3d" }}>
          <div className="layer-3d absolute inset-0 overflow-hidden rounded-[2rem] bg-elevated shadow-[var(--shadow-lift)] ring-1 ring-black/5">
            <Image src={card} alt={image.alt} fill sizes={sizes} quality={85} className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0"
            style={
              {
                bottom: `${100 - overlapOfCard}%`,
                aspectRatio: `${pop.width} / ${pop.height}`,
                transform: `translateZ(${POP_Z}px) scale(${POP_SCALE})`,
                transformOrigin: "50% 100%",
                maskImage: `linear-gradient(to top, transparent 0%, #000 ${featherOfPop}%)`,
                WebkitMaskImage: `linear-gradient(to top, transparent 0%, #000 ${featherOfPop}%)`,
                filter: "drop-shadow(0 18px 24px rgb(24 22 18 / 0.18))",
              } as CSSProperties
            }
          >
            <Image src={pop} alt="" fill sizes={sizes} quality={85} className="object-contain object-bottom" />
          </div>

          {chips.map((chip, i) => (
            <span
              key={chip}
              aria-hidden="true"
              className={`layer-3d absolute ${i === 0 ? "float-slow -right-3 top-[18%] sm:-right-6" : "float-slower -left-3 bottom-[14%] sm:-left-6"} rounded-full border border-white/70 bg-white/75 px-4 py-2 text-[13px] font-medium text-fg shadow-[var(--shadow-soft)] backdrop-blur-md`}
              style={{ "--z": `${70 + i * 30}px` } as CSSProperties}
            >
              <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle" />
              {chip}
            </span>
          ))}
        </div>
      </Tilt>
    </div>
  );
}
