import React from "react";

export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : "https://elearning-g2i8.onrender.com/" + src;
  return <img {...rest} src={src} alt={""} />;
}
