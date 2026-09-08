import type { Config } from "tailwindcss";
import { careflowPatientPreset } from "@careflow/ui/tailwind-preset-patient";

const config: Config = {
  presets: [careflowPatientPreset],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
