import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

// Perspective card deck: the front card drops away, the rest promote forward,
// and the dropped one returns to the back of the stack.
//
// Adapted from the reference component. Two changes matter here. It is
// controllable: `paused` stops the cycle, and bumping `advance` steps the deck
// once, so the dashboards drive it with real buttons instead of only waiting on
// a timer. A counter prop rather than an imperative ref, because a ref handle
// that fails to attach fails silently through `?.` and the button just does
// nothing. And the auto-cycle is off under reduced motion, where a deck that
// reshuffles itself every few seconds is noise.

export const Card = forwardRef(function Card({ className = "", ...rest }, ref) {
  return <div ref={ref} {...rest} className={`swap-card ${className}`.trim()} />;
});

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x, y: slot.y, z: slot.z,
    xPercent: -50, yPercent: -50,
    skewY: skew, transformOrigin: "center center",
    zIndex: slot.zIndex, force3D: true,
  });

export default function CardSwap({
    width = 400,
    height = 300,
    cardDistance = 44,
    verticalDistance = 44,
    delay = 5200,
    pauseOnHover = true,
    paused = false,
    onCardClick,
    skewAmount = 4,
  easing = "elastic",
  advance = 0,
  children,
}) {
  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 1.6, durMove: 1.6, durReturn: 1.6, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => createRef()), [childArr.length]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const timer = useRef(0);
  const container = useRef(null);
  const swapRef = useRef(() => {});

  // Re-seat every card whenever the number of cards changes, or a booking
  // added by another device would land with no transform at all.
  useEffect(() => {
    order.current = Array.from({ length: refs.length }, (_, i) => i);
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, refs.length), skewAmount);
    });
  }, [refs, cardDistance, verticalDistance, skewAmount]);

  useEffect(() => {
    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: "+=420", duration: config.durDrop, ease: config.ease });
      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const back = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: back.zIndex }), undefined, "return");
      tl.to(elFront, { x: back.x, y: back.y, z: back.z, duration: config.durReturn, ease: config.ease }, "return");
      tl.call(() => { order.current = [...rest, front]; });
    };

    swapRef.current = swap;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cycle = () => {
      clearInterval(timer.current);
      if (paused || still || refs.length < 2) return;
      timer.current = window.setInterval(swap, delay);
    };
    cycle();

    const node = container.current;
    if (pauseOnHover && node && !paused && !still) {
      const stop = () => clearInterval(timer.current);
      const go = () => cycle();
      node.addEventListener("mouseenter", stop);
      node.addEventListener("mouseleave", go);
      return () => {
        node.removeEventListener("mouseenter", stop);
        node.removeEventListener("mouseleave", go);
        clearInterval(timer.current);
      };
    }
    return () => clearInterval(timer.current);
  }, [refs, cardDistance, verticalDistance, delay, pauseOnHover, paused, skewAmount, easing]);

  // Parent bumped the counter: step the deck once. The first render is
  // skipped so mounting does not immediately shuffle.
  const seen = useRef(advance);
  useEffect(() => {
    if (advance === seen.current) return;
    seen.current = advance;
    swapRef.current();
  }, [advance]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div ref={container} className="swap-stage" style={{ width, height }}>
      <div className="swap-inner">{rendered}</div>
    </div>
  );
}
