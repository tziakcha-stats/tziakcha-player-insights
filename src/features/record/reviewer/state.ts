import { w } from "../../../shared/env";
import { ReviewResponseItem, TZLikeInstance } from "./types";

export function ensureReviewStores(): void {
  if (!w.__reviews) {
    w.__reviews = {};
  }
  if (!w.__reviews_filled) {
    w.__reviews_filled = {};
  }
  if (!w.__reviews_seats) {
    w.__reviews_seats = [undefined, undefined, undefined, undefined];
  }
}

export function resetReviewStores(): void {
  w.__reviews = {};
  w.__reviews_filled = {};
  w.__reviews_seats = [undefined, undefined, undefined, undefined];
}

export function getReviews(): Record<string, ReviewResponseItem> {
  ensureReviewStores();
  return w.__reviews as Record<string, ReviewResponseItem>;
}

export function getFilledReviews(): Record<string, ReviewResponseItem> {
  ensureReviewStores();
  return w.__reviews_filled as Record<string, ReviewResponseItem>;
}

export function getReviewSeats(): Array<number | undefined> {
  ensureReviewStores();
  return w.__reviews_seats as Array<number | undefined>;
}

export function setReviewError(message: string): void {
  w.__review_error = message;
  const reviewEl = document.getElementById("review");
  if (reviewEl) {
    reviewEl.innerText = message;
  }
}

export function clearReviewError(): void {
  setReviewError("");
}

export function setTZInstance(instance: unknown): void {
  w.__review_tz_instance = instance;
}

export function getTZInstance(): TZLikeInstance | null {
  return (w.__review_tz_instance as TZLikeInstance | undefined) ?? null;
}
