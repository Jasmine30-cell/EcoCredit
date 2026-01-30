import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const submitRecycling = async (data: any) => {
  return fetch("/api/recycling/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const fetchRecyclingData = async (userId: string) => {
  const res = await fetch(`/api/recycling/my-data/${userId}`);
  return res.json();
};
