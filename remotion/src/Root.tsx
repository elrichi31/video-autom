import "./index.css";
import type { FC } from "react";
import { Composition } from "remotion";
import { MyComposition, totalDuration } from "./Composition";
import {
  HallucinationsComposition,
  hallucinationsDuration,
} from "./HallucinationsComposition";
import {
  CyberAttacksComposition,
  cyberAttacksDuration,
} from "./CyberAttacksComposition";
import {
  AiSkillsComposition,
  aiSkillsDuration,
} from "./AiSkillsComposition";
import {
  HackerGroupsComposition,
  hackerGroupsDuration,
} from "./HackerGroupsComposition";
import {
  AiAgentsComposition,
  aiAgentsDuration,
} from "./AiAgentsComposition";
import {
  CyberToolsComposition,
  cyberToolsDuration,
} from "./CyberToolsComposition";
import {
  ZeroDayComposition,
  zeroDayDuration,
} from "./ZeroDayComposition";
import {
  PhoneHackedComposition,
  phoneHackedDuration,
} from "./PhoneHackedComposition";
import {
  AiAutomationsComposition,
  aiAutomationsDuration,
} from "./AiAutomationsComposition";
import {
  DarkWebComposition,
  darkWebDuration,
} from "./DarkWebComposition";
import {
  RansomwareTerrorTecnologicoComposition,
  ransomwareTerrorTecnologicoDuration,
  calculateMetadata as ransomwareCalculateMetadata,
} from "./RansomwareTerrorTecnologicoComposition";

import {
  DeepfakesComposition,
  deepfakesDuration,
  calculateMetadata as deepfakesCalculateMetadata,
} from "./DeepfakesComposition";

import {
  QueEsLaDeepwebComposition,
  queEsLaDeepwebDuration,
  calculateMetadata as queEsLaDeepwebCalculateMetadata,
} from "./QueEsLaDeepwebComposition";

import {
  QueEsLaDarknetComposition,
  queEsLaDarknetDuration,
  calculateMetadata as queEsLaDarknetCalculateMetadata,
} from "./QueEsLaDarknetComposition";

import {
  EscasezTokensIaComposition,
  escasezTokensIaDuration,
  calculateMetadata as escasezTokensIaCalculateMetadata,
} from "./EscasezTokensIaComposition";

import {
  CriptomonedasYFraudesComposition,
  criptomonedasYFraudesDuration,
  calculateMetadata as criptomonedasYFraudesCalculateMetadata,
} from "./CriptomonedasYFraudesComposition";

import {
  TiendasEnLineaNecessidadNegociosComposition,
  tiendasEnLineaNecessidadNegociosDuration,
  calculateMetadata as tiendasEnLineaNecessidadNegociosCalculateMetadata,
} from "./TiendasEnLineaNecessidadNegociosComposition";

import {
  JuiceJackingPeligroCargarCelularComposition,
  juiceJackingPeligroCargarCelularDuration,
  calculateMetadata as juiceJackingPeligroCargarCelularCalculateMetadata,
} from "./JuiceJackingPeligroCargarCelularComposition";

import {
  ImpactoCiberseguridadGpt56Composition,
  impactoCiberseguridadGpt56Duration,
  calculateMetadata as impactoCiberseguridadGpt56CalculateMetadata,
} from "./ImpactoCiberseguridadGpt56Composition";

import {
  EstafaIaClonacionVozComposition,
  estafaIaClonacionVozDuration,
  calculateMetadata as estafaIaClonacionVozCalculateMetadata,
} from "./EstafaIaClonacionVozComposition";

import {
  PeligrosCodigosQrComposition,
  peligrosCodigosQrDuration,
  calculateMetadata as peligrosCodigosQrCalculateMetadata,
} from "./PeligrosCodigosQrComposition";

export const RemotionRoot: FC = () => {
  return (
    <>
      <Composition
        id="Top5AI2026Vertical"
        component={MyComposition}
        durationInFrames={totalDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          backgroundMusicFile: null,
          popSfxFile: null,
          transitionSfxFile: null,
        }}
      />
      <Composition
        id="CyberAttacksVerticalPremium"
        component={CyberAttacksComposition}
        durationInFrames={cyberAttacksDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile:
            "ElevenLabs_2026-03-30T20_35_43_David - Deep, Attractive, Mysterious_pvc_sp100_s30_sb60_se0_m2.mp3",
        }}
      />
      <Composition
        id="AiSkillsVerticalPremium"
        component={AiSkillsComposition}
        durationInFrames={aiSkillsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile:
            "ElevenLabs_2026-04-04T05_10_01_David - Energetic, Deep and Pleasant_pvc_sp100_s31_sb82_se18_b_m2.mp3",
        }}
      />
      <Composition
        id="HackerGroupsVerticalPremium"
        component={HackerGroupsComposition}
        durationInFrames={hackerGroupsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: "ElevenLabs_2026-04-09T01_45_08_David C - Viral Storytelling_pvc_sp100_s31_sb82_se18_b_m2.mp3",
        }}
      />
      <Composition
        id="AiAgentsVerticalPremium"
        component={AiAgentsComposition}
        durationInFrames={aiAgentsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
        }}
      />
      <Composition
        id="CyberToolsVerticalPremium"
        component={CyberToolsComposition}
        durationInFrames={cyberToolsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
        }}
      />
      <Composition
        id="ZeroDayVerticalPremium"
        component={ZeroDayComposition}
        durationInFrames={zeroDayDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
        }}
      />
      <Composition
        id="OsintVerticalPremium"
        component={PhoneHackedComposition}
        durationInFrames={phoneHackedDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
          hookMedia: null,
          // ════════════════════════════════════════
          //  PONÉ ACÁ TUS ARCHIVOS DE public/
          //  Ejemplo: ["osint-fuentes.png", "osint-redes.mp4", ...]
          // ════════════════════════════════════════
          mediaFiles: [null, null, null, null, null],
        }}
      />
      <Composition
        id="AiAutomationsVerticalPremium"
        component={AiAutomationsComposition}
        durationInFrames={aiAutomationsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
        }}
      />
      <Composition
        id="DarkWebVerticalPremium"
        component={DarkWebComposition}
        durationInFrames={darkWebDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverFile: null,
        }}
      />
      <Composition
        id="RansomwareTerrorTecnologicoVerticalPremium"
        component={RansomwareTerrorTecnologicoComposition}
        calculateMetadata={ransomwareCalculateMetadata}
        durationInFrames={ransomwareTerrorTecnologicoDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="ReduceAIHallucinationsVertical"
        component={HallucinationsComposition}
        durationInFrames={hallucinationsDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          backgroundMusicFile: null,
        }}
      />
      <Composition
        id="DeepfakesVerticalPremium"
        component={DeepfakesComposition}
        calculateMetadata={deepfakesCalculateMetadata}
        durationInFrames={deepfakesDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="QueEsLaDeepwebVerticalPremium"
        component={QueEsLaDeepwebComposition}
        calculateMetadata={queEsLaDeepwebCalculateMetadata}
        durationInFrames={queEsLaDeepwebDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="QueEsLaDarknetVerticalPremium"
        component={QueEsLaDarknetComposition}
        calculateMetadata={queEsLaDarknetCalculateMetadata}
        durationInFrames={queEsLaDarknetDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="EscasezTokensIaVerticalPremium"
        component={EscasezTokensIaComposition}
        calculateMetadata={escasezTokensIaCalculateMetadata}
        durationInFrames={escasezTokensIaDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="CriptomonedasYFraudesVerticalPremium"
        component={CriptomonedasYFraudesComposition}
        calculateMetadata={criptomonedasYFraudesCalculateMetadata}
        durationInFrames={criptomonedasYFraudesDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="TiendasEnLineaNecessidadNegociosVerticalPremium"
        component={TiendasEnLineaNecessidadNegociosComposition}
        calculateMetadata={tiendasEnLineaNecessidadNegociosCalculateMetadata}
        durationInFrames={tiendasEnLineaNecessidadNegociosDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="JuiceJackingPeligroCargarCelularVerticalPremium"
        component={JuiceJackingPeligroCargarCelularComposition}
        calculateMetadata={juiceJackingPeligroCargarCelularCalculateMetadata}
        durationInFrames={juiceJackingPeligroCargarCelularDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="ImpactoCiberseguridadGpt56VerticalPremium"
        component={ImpactoCiberseguridadGpt56Composition}
        calculateMetadata={impactoCiberseguridadGpt56CalculateMetadata}
        durationInFrames={impactoCiberseguridadGpt56Duration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="EstafaIaClonacionVozVerticalPremium"
        component={EstafaIaClonacionVozComposition}
        calculateMetadata={estafaIaClonacionVozCalculateMetadata}
        durationInFrames={estafaIaClonacionVozDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
      <Composition
        id="PeligrosCodigosQrVerticalPremium"
        component={PeligrosCodigosQrComposition}
        calculateMetadata={peligrosCodigosQrCalculateMetadata}
        durationInFrames={peligrosCodigosQrDuration}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}
      />
    </>
  );
};
