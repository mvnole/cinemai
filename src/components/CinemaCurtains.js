import React, { useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export default function CinemaCurtains({ active, onCover, onComplete }) {
  const springClose = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 };
  const springOpen = { type: "spring", stiffness: 120, damping: 22, mass: 0.9 };

  const leftCtrl = useAnimation();
  const rightCtrl = useAnimation();

  const edgeShadowLeft =
    "inset -18px 0 30px rgba(0,0,0,0.55), inset -2px 0 0 rgba(255,255,255,0.05)";
  const edgeShadowRight =
    "inset 18px 0 30px rgba(0,0,0,0.55), inset 2px 0 0 rgba(255,255,255,0.05)";

  const folds = `
    repeating-linear-gradient(
      90deg,
      rgba(7,28,40,1) 0px,
      rgba(7,28,40,1) 8px,
      rgba(10,33,48,1) 8px,
      rgba(10,33,48,1) 18px,
      rgba(6,22,32,1) 18px,
      rgba(6,22,32,1) 26px
    )
  `;
  const baseGradient = `
    radial-gradient(1200px 100% at 50% -20%, rgba(0,188,212,0.10), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.08))
  `;
  const bgLayer = `${folds}, ${baseGradient}`;

  useEffect(() => {
    let done = false;
    async function run() {
      if (!active) return;

      // 1) CLOSE
      await Promise.all([
        leftCtrl.start({ x: 0, rotateZ: 0.2, skewY: -1.2, transition: springClose }),
        rightCtrl.start({ x: 0, rotateZ: -0.2, skewY: 1.2, transition: springClose }),
      ]);

      // momentul când sunt complet închise
      if (typeof onCover === "function") onCover();

      // mică pauză
      await new Promise((r) => setTimeout(r, 120));

      // 2) OPEN
      await Promise.all([
        leftCtrl.start({ x: "-100%", rotateZ: 0, skewY: 0, transition: springOpen }),
        rightCtrl.start({ x: "100%", rotateZ: 0, skewY: 0, transition: springOpen }),
      ]);

      if (!done && typeof onComplete === "function") onComplete();
    }
    run();
    return () => { done = true; };
  }, [active, leftCtrl, rightCtrl, onCover, onComplete]);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="curtainDisplace" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" dur="9s" values="0.004 0.007; 0.003 0.010; 0.004 0.009" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="soften"><feGaussianBlur stdDeviation="0.35" /></filter>
      </svg>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ x: "-100%", rotateZ: 0, skewY: 0 }}
              animate={leftCtrl}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-screen w-1/2 z-[9999] pointer-events-none"
              style={{
                backgroundImage: bgLayer,
                backgroundSize: "auto, cover",
                backgroundBlendMode: "overlay",
                borderRight: "3px solid #00bcd4",
                filter: "url(#curtainDisplace)",
                boxShadow: edgeShadowLeft,
              }}
            />
            <motion.div
              initial={{ x: "100%", rotateZ: 0, skewY: 0 }}
              animate={rightCtrl}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-screen w-1/2 z-[9999] pointer-events-none"
              style={{
                backgroundImage: bgLayer,
                backgroundSize: "auto, cover",
                backgroundBlendMode: "overlay",
                borderLeft: "3px solid #00bcd4",
                filter: "url(#curtainDisplace)",
                boxShadow: edgeShadowRight,
              }}
            />
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes curtainDrift {
          0% { transform: translateX(0px) translateY(0px); opacity: 0.9; }
          50% { transform: translateX(-6px) translateY(2px); opacity: 1; }
          100% { transform: translateX(0px) translateY(0px); opacity: 0.9; }
        }
        @keyframes curtainDriftAlt {
          0% { transform: translateX(0px) translateY(0px); opacity: 0.9; }
          50% { transform: translateX(6px) translateY(-2px); opacity: 1; }
          100% { transform: translateX(0px) translateY(0px); opacity: 0.9; }
        }
      `}</style>
    </>
  );
}
