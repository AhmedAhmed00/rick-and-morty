"use client";

import Image from "next/image";
import { Dna, Globe, MapPin, MonitorPlay, VenusAndMars } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CharacterDetail } from "@/types";

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-control bg-card px-3 py-1.5 text-sm text-muted-fg">
      <span aria-hidden className="shrink-0 text-primary">
        {icon}
      </span>
      {children}
    </span>
  );
}

function PlaceCard({
  icon,
  label,
  name,
}: {
  icon: ReactNode;
  label: string;
  name: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-card">
      <span
        aria-hidden
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-fg">{label}</span>
        <span className="block truncate font-medium">{name}</span>
      </span>
    </Card>
  );
}

export function CharacterDetails({ character }: { character: CharacterDetail }) {
  const t = useTranslations("character");
  const tGender = useTranslations("gender");

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-10">
      <Image
        src={character.image}
        alt={character.name}
        width={440}
        height={440}
        sizes="(min-width: 768px) 22rem, 100vw"
        loading="eager"
        className="h-auto w-full rounded-card border border-border"
      />

      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold md:text-5xl">{character.name}</h1>
          <p className="inline-flex items-center gap-2 text-sm text-muted-fg">
            <MonitorPlay size={16} aria-hidden className="text-primary" />
            {t("episodeCount", { count: character.episodes.length })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={character.status}
            className="rounded-control bg-card px-3 py-1.5 text-sm"
          />
          <Fact icon={<Dna size={16} />}>{character.species}</Fact>
          <Fact icon={<VenusAndMars size={16} />}>
            {tGender(character.gender)}
          </Fact>
        </div>

        <div className="grid gap-grid sm:grid-cols-2">
          <PlaceCard
            icon={<Globe size={18} />}
            label={t("origin")}
            name={character.origin}
          />
          <PlaceCard
            icon={<MapPin size={18} />}
            label={t("location")}
            name={character.location}
          />
        </div>
      </div>
    </div>
  );
}
