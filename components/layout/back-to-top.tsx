"use client";

import classNames from "classnames";
import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function BackToTop() {
  const t = useTranslations("footer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backToTop")}
      className={classNames(
        "fixed bottom-6 end-6 z-30 inline-flex size-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all hover:bg-primary-hover",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
