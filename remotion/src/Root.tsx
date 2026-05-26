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
    </>
  );
};
