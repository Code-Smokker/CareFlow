import type { Config } from "tailwindcss";
import { borderRadius, colors, fontFamily, fontSize, spacing } from "./tokens";

/**
 * Spread into a consuming app's tailwind.config.ts via `presets: [careflowPreset]`.
 * Single source of truth for colour/type/spacing tokens across staff-density apps.
 *
 * Tailwind's own Config type wants mutable tuples for fontFamily/fontSize; tokens.ts exports
 * `as const` (readonly) so every other consumer gets literal types. Cast at this one boundary
 * rather than losing literal-ness everywhere else.
 */
export const careflowPreset: Pick<Config, "darkMode" | "theme" | "plugins"> = {
  darkMode: "class",
  theme: {
    extend: {
      colors,
      borderRadius,
      spacing,
      fontFamily,
      fontSize,
    } as Config["theme"] extends { extend?: infer E } ? E : never,
  },
  plugins: [],
};

export default careflowPreset;
