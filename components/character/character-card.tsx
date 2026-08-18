"use client";

import Image from "next/image";
import { Dna, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "@/i18n/navigation";
import type { Character } from "@/lib/types";

interface Props {
  character: Character;
  /** Set on the first row so the largest contentful image isn't lazy-loaded. */
  eager?: boolean;
}

export function CharacterCard({ character, eager = false }: Props) {
  const t = useTranslations("character");

  return (
    <Card interactive className="flex flex-col overflow-hidden">
      <div className="relative aspect-square w-full bg-border">
        <Image
          src={character.image}
          alt={character.name}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-card">
        <h3 className="text-lg font-semibold leading-tight">
          {/* Stretched link makes the whole card the target. */}
          <Link
            href={`/character/${character.id}`}
            className="after:absolute after:inset-0"
          >
            {character.name}
          </Link>
        </h3>

        <StatusBadge status={character.status} />

        <p className="flex items-center gap-1.5 text-sm text-muted-fg">
          <Dna size={16} aria-hidden className="shrink-0" />
          <span className="min-w-0 truncate">{character.species}</span>
        </p>

        <p className="flex items-center gap-1.5 text-sm text-muted-fg">
          <MapPin size={16} aria-hidden className="shrink-0" />
          <span className="min-w-0 truncate">{character.location}</span>
        </p>

        <span className="mt-auto pt-2 text-sm font-medium text-primary-text">
          {t("learnMore")}
        </span>
      </div>
    </Card>
  );
}
