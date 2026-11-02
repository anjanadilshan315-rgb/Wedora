import type { CSSProperties } from "react";

/** Fixed positions keep the server and browser markup identical. */
const particles = Array.from({ length: 20 }, (_, index) => ({
  left: `${(index * 37 + 8) % 100}%`,
  top: `${(index * 23 + 5) % 100}%`,
  size: `${3 + (index % 4) * 2}px`,
  duration: `${16 + (index % 5) * 4}s`,
  delay: `${-index * 1.7}s`,
}));

export default function GildedBackground() {
  return (
    <div className="gilded-background" aria-hidden="true">
      <div className="gilded-light gilded-light-gold" />
      <div className="gilded-light gilded-light-wine" />
      <div className="gilded-light gilded-light-champagne" />
      {particles.map((particle, index) => (
        <span key={index} className="gilded-particle" style={{
          left: particle.left, top: particle.top,
          "--particle-size": particle.size,
          "--particle-duration": particle.duration,
          "--particle-delay": particle.delay,
        } as CSSProperties} />
      ))}
    </div>
  );
}
