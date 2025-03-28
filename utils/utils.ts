import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* 將回傳的任何形式的 response 轉換成 JavaScript 可用的物件 */
export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}