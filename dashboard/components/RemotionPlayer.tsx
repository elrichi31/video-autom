"use client";

import { Player } from "@remotion/player";
import { type FC, useEffect, useState } from "react";

type LoadedComp = {
  component: FC<Record<string, unknown>>;
  durationInFrames: number;
};

// Compositions whose file name doesn't follow the standard pattern
const FILE_OVERRIDES: Record<string, string> = {
  OsintVerticalPremium: "PhoneHackedComposition",
  Top5AI2026Vertical: "Composition",
  ReduceAIHallucinationsVertical: "HallucinationsComposition",
};

async function loadComp(compositionId: string): Promise<LoadedComp> {
  const fileName =
    FILE_OVERRIDES[compositionId] ??
    compositionId.replace(/VerticalPremium$|Vertical$/, "") + "Composition";

  // webpackInclude tells webpack to bundle all Composition files as chunks
  const m = await import(
    /* webpackInclude: /Composition\.tsx$/ */
    `../../remotion/src/${fileName}.tsx`
  );

  // The component is the only exported function (FC)
  const component = Object.values(m).find(
    (v) => typeof v === "function",
  ) as FC<Record<string, unknown>>;

  // The duration is the only exported number
  const durationInFrames = Object.values(m).find(
    (v) => typeof v === "number",
  ) as number;

  if (!component || !durationInFrames) throw new Error(`Invalid composition module: ${fileName}`);
  return { component, durationInFrames };
}

export function RemotionPlayer({ compositionId }: { compositionId: string }) {
  const [comp, setComp]   = useState<LoadedComp | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComp(null);
    setError(null);
    loadComp(compositionId)
      .then(setComp)
      .catch((e) => setError(String(e)));
  }, [compositionId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-[#555] text-xs p-4 text-center">
        No se pudo cargar la preview.<br />
        <span className="text-[10px] opacity-60 mt-1">{error}</span>
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Player
      component={comp.component}
      durationInFrames={comp.durationInFrames}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1920}
      style={{ width: "100%", height: "100%" }}
      inputProps={{ voiceoverFile: null }}
      controls
      loop
    />
  );
}
