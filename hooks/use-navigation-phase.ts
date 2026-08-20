"use client";

import { useSyncExternalStore } from "react";

export type NavigationPhase = "idle" | "loading" | "done";


const DONE_MS = 400;


let pending = 0;
let phase: NavigationPhase = "idle";
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function setPhase(next: NavigationPhase) {
  if (phase === next) return;
  phase = next;
  for (const listener of listeners) listener();
}

export function startNavigation() {
  pending += 1;

  clearTimeout(timer);
  timer = undefined;
  setPhase("loading");
}

export function endNavigation() {

  pending = Math.max(0, pending - 1);
  if (pending > 0) return;

  setPhase("done");
  timer = setTimeout(() => {
    timer = undefined;
    setPhase("idle");
  }, DONE_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => phase;

const getServerSnapshot = (): NavigationPhase => "idle";

export function useNavigationPhase() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
