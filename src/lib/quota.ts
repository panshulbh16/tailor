import { db } from "./db";
import { FREE_TAILORS } from "./plans";

export { FREE_TAILORS };

/** How many free tailors this user has left (Infinity for Pro). */
export function tailorsLeft(userId: number, plan: string): number {
  if (plan === "pro") return Infinity;
  const used = (db.prepare("SELECT COUNT(*) n FROM tailors WHERE user_id = ?").get(userId) as { n: number }).n;
  return Math.max(0, FREE_TAILORS - used);
}
