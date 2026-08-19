import type { Gender, Status } from "@/types";
import { GENDERS, STATUSES } from "@/types";

export const asStatus = (value: string): Status =>
  (STATUSES as readonly string[]).includes(value) ? (value as Status) : "unknown";

export const asGender = (value: string): Gender =>
  (GENDERS as readonly string[]).includes(value) ? (value as Gender) : "unknown";
