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
          voiceoverFile: null,
        }}
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
    </>
  );
};
