// components/LetterPreloader.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LetterPreloader.module.css";
import BackgroundPopEffect from "@/componenet/PopClicksCanvas";

export default function LetterPreloader({
  name = "Iftikhar Ali",
  total = 2600,
  letterSize = 84,
  onFinish = () => {},
}) {
  const containerRef = useRef(null);

  // ✅ keep gap in state (safe for SSR)
  const [gap, setGap] = useState(Math.round(letterSize * 0.6));

  useEffect(() => {
    const handleResize = () => {
      const newGap = Math.round(
        letterSize * (window.innerWidth < 640 ? 0.35 : 0.6)
      );
      setGap(newGap);
    };

    // run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [letterSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const letters = Array.from(name);
    const n = letters.length;

    // timings (ms)
    const popStart = 80 * 1.5;
    const popStagger = reduced ? 40 * 1.5 : 110 * 1.5;
    const beforeSpread = popStart + popStagger * n + 120 ;
    const spreadDuration = reduced ? 200 * 1.5 : 650;
    const pauseAfterSpread = reduced ? 300 * 1.5 : 650 * 2.5;
    const fadeDuration = 400 * 1.5;

    const enterTimer = setTimeout(() => {
      container.classList.add(styles.entered || "entered");
    }, popStart);

    const spreadTimer = setTimeout(() => {
      container.classList.add(styles.spread || "spread");
    }, beforeSpread);

    const finishTimer = setTimeout(() => {
      container.style.transition = `opacity ${fadeDuration}ms ease`;
      container.style.opacity = "0";

      setTimeout(() => {
        try {
          onFinish();
        } catch {}
      }, Math.max(60, Math.round(fadeDuration / 6)));
    }, beforeSpread + spreadDuration + pauseAfterSpread);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(spreadTimer);
      clearTimeout(finishTimer);
    };
  }, [name, total, letterSize, onFinish]);

  const letters = Array.from(name);
  const n = letters.length;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      aria-hidden="true"
      role="presentation"
      style={{ pointerEvents: "auto" }}
    >
      <div className="relative w-[90vw] max-w-[900px] h-[25vh] max-h-[220px] flex items-center justify-center">
        <BackgroundPopEffect />
        {letters.map((char, i) => {
          const centerIndex = (n - 1) / 2;
          const offsetX = Math.round((i - centerIndex) * (gap + 2));
          const rot = (i - centerIndex) * 2.5;

          const style = {
            transitionDelay: `${i * 165}ms`, // scaled to 1.5x
            ["--tx"]: `${offsetX}px`,
            ["--rot"]: `${rot}deg`,
          };

          if (char === " ") {
            return (
              <span
                key={`space-${i}`}
                className={`${styles.letter} ${styles.space}`}
                style={style}
                aria-hidden="true"
              >
                &nbsp;
              </span>
            );
          }

          return (
            <span
              key={`${char}-${i}`}
              className={styles.letter}
              style={style}
              aria-hidden="true"
            >
              {char}
            </span>
          );
        })}
        <div className={styles.signature}>Iftikhar</div>
      </div>
    </div>
  );
}

// // components/LetterPreloader.jsx
// "use client";
// import React, { useEffect, useRef } from "react";
// import styles from "./LetterPreloader.module.css";
// import BackgroundPopEffect from "@/componenet/PopClicksCanvas";

// export default function LetterPreloader({
//   name = "Iftikhar Ali",
//   total = 2600,
//   letterSize = 84,
//   onFinish = () => {},
// }) {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const reduced =
//       typeof window !== "undefined" &&
//       window.matchMedia &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const letters = Array.from(name);
//     const n = letters.length;

//     // timings (ms) — tuned to pop all letters then spread
//     // timings (ms) — tuned to pop all letters then spread
// const popStart = 80 * 1.5;              // 120
// const popStagger = reduced ? 40 * 1.5 : 110; // 60 or 165
// // wait until final letter pop animation finishes then trigger spread
// const beforeSpread = popStart + popStagger * n + 120 * 1.5; // scaled
// const spreadDuration = reduced ? 200 * 1.5 : 650 * 1.5; // 300 or 975
// const pauseAfterSpread = reduced ? 300 * 1.5 : 650 * 1.5; // 450 or 975
// const fadeDuration = 400 * 1.5;         // 600


//     // start pop-in (add entered class quickly so CSS transitions run)
//     const enterTimer = setTimeout(() => {
//       container.classList.add(styles.entered || "entered");
//     }, popStart);

//     // trigger spread AFTER all letters have popped in
//     const spreadTimer = setTimeout(() => {
//       container.classList.add(styles.spread || "spread");
//     }, beforeSpread);

//     // fade and finish after spread + pause
//     const finishTimer = setTimeout(() => {
//       container.style.transition = `opacity ${fadeDuration}ms ease`;
//       container.style.opacity = "0";

//       // call onFinish after a tiny offset so fade begins smoothly
//       setTimeout(() => {
//         try {
//           onFinish();
//         } catch (e) {
//           // swallow
//         }
//       }, Math.max(60, Math.round(fadeDuration / 6)));
//     }, beforeSpread + spreadDuration + pauseAfterSpread);

//     return () => {
//       clearTimeout(enterTimer);
//       clearTimeout(spreadTimer);
//       clearTimeout(finishTimer);
//     };
//   }, [name, total, letterSize, onFinish]);

//   const letters = Array.from(name);
//   const n = letters.length;
//   // const gap = Math.round(letterSize * 0.25 * 1.5);
// const gap = Math.round(letterSize * (window.innerWidth < 640 ? 0.35 : 0.6));

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className={styles.container}
//         aria-hidden="true"
//         role="presentation"
//         style={{ pointerEvents: "auto" }}
//       >
//         <div className={styles.center}>
//           <BackgroundPopEffect />
//           {letters.map((char, i) => {
//             const centerIndex = (n - 1) / 2;
//             const offsetX = Math.round((i - centerIndex) * (gap + 2));
//             const rot = (i - centerIndex) * 2.5;

//             const style = {
//               transitionDelay: `${i * 110}ms`, // match JS timing above (popStagger fallback)
//               ["--tx"]: `${offsetX}px`,
//               ["--rot"]: `${rot}deg`,
//             };

//             // keep spaces visible but as gap
//             if (char === " ") {
//               return (
//                 <span
//                   key={`space-${i}`}
//                   className={`${styles.letter} ${styles.space}`}
//                   style={style}
//                   aria-hidden="true"
//                 >
//                   &nbsp;
//                 </span>
//               );
//             }

//             return (
//               <span
//                 key={`${char}-${i}`}
//                 className={styles.letter}
//                 style={style}
//                 aria-hidden="true"
//               >
//                 {char}
//               </span>
//             );
//           })}
//           <div className={styles.signature}>Iftikhar</div>
//         </div>
//       </div>
      
//     </>
//   );
// }
