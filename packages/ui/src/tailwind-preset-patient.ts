import type { Config } from "tailwindcss";
import { patientColors, patientFontFamily, patientFontSize, patientSpacing } from "./tokens-patient";

/** Spread into apps/intake's tailwind.config.ts via `presets: [careflowPatientPreset]`.
 * Separate from careflowPreset (staff) on purpose — see tokens-patient.ts. */
export const careflowPatientPreset: Pick<Config, "darkMode" | "theme" | "plugins"> = {
  darkMode: "class",
  theme: {
    extend: {
      colors: patientColors,
      spacing: patientSpacing,
      fontFamily: patientFontFamily,
      fontSize: patientFontSize,
      minHeight: { touch: "56px" },
      minWidth: { touch: "56px" },
    },
  } as unknown as Config["theme"],
  plugins: [],
};

export default careflowPatientPreset;
