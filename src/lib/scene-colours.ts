import { useEffect, useState } from "react";

/** Three.js needs resolved sRGB strings rather than CSS variable references. */
export function useSceneColours() {
  const [colours, setColours] = useState<{ primary: string; white: string; grey: string; ground: string } | null>(null);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (name: string) => css.getPropertyValue(`--scene-${name}`).trim();
    setColours({ primary: read("primary"), white: read("white"), grey: read("grey"), ground: read("ground") });
  }, []);
  return colours;
}