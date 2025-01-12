import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTitleContent(obj: any): obj is TitleContent {
  return obj && typeof obj === "object" && typeof obj.title === "string";
}

export function isLinkContent(obj: any): obj is LinkContent {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.title === "string" &&
    typeof obj.url === "string"
  );
}

export const DAY = 60 * 60 * 24 * 1000;
