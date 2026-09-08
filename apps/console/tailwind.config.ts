import type { Config } from "tailwindcss";
import { careflowPreset } from "@careflow/ui/tailwind-preset";

const config: Config = {
  presets: [careflowPreset],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
