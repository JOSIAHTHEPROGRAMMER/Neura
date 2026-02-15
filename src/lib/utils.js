import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { assets } from "../assets/dummyData";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const logoPicker = (isDarkMode) => {
  return isDarkMode ? assets.darkLogo : assets.logo;
}