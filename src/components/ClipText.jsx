// Letter-by-letter vertical clip reveal.
//
// Each glyph sits inside an overflow:hidden box and slides down into it from
// above, staggered. The keyframe only defines `from` and the element's resting
// style is the final position, so if the animation never runs — reduced motion,
// a paint the browser skips, a re-mounted node — the text is still there and
// readable. Nothing here touches opacity; blank text was a real bug once.

import { Fragment } from "react";

export default function ClipText({ text, as: Tag = "span", className = "", stagger = 0.028, delay = 0, style }) {
  const words = String(text).split(" ");
  let i = 0;

  return (
    <Tag className={`clip-text ${className}`} style={style} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={`${word}-${w}`}>
          {/* A real space, not a margin — otherwise the heading copies out of
              the page as one run-on word. */}
          {w > 0 && " "}
          <span className="clip-word" aria-hidden="true">
            {Array.from(word).map((ch, c) => (
              <span className="clip-mask" key={c}>
                <span className="clip-ch" style={{ animationDelay: `${delay + i++ * stagger}s` }}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
