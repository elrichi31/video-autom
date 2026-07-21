import type { FC } from "react";
import {
  AccentBar,
  ActionList,
  AlertLayout,
  BlockSequence,
  CloseLayout,
  DarkShell,
  DefenseLayout,
  DetailText,
  ExplainLayout,
  GlitchTitle,
  IndicatorCard,
  NarrativeText,
  PhaseLabel,
  PhaseLayout,
  Reveal,
  TerminalBlock,
  TimestampDisplay,
} from "./explainer-light/components";

/**
 * Self-contained showcase of the explainer-light theme. Uses inline copy and no
 * audio/images so it renders instantly in the Remotion Studio — purely a visual
 * preview of the light "quiet flex" template.
 */

const FPS = 30;
type AccentPair = [string, string];
const ACCENT: AccentPair = ["#2f6bff", "#8a5cf6"];

const D = {
  intro: 4 * FPS,
  explain: 7 * FPS,
  phase: 7 * FPS,
  defense: 7 * FPS,
  close: 5 * FPS,
} as const;

export const explainerLightDemoDuration =
  D.intro + D.explain + D.phase + D.defense + D.close;

export const ExplainerLightDemoComposition: FC = () => {
  let at = 0;
  const next = (len: number) => {
    const from = at;
    at += len;
    return { from, durationInFrames: len };
  };

  const intro = next(D.intro);
  const explain = next(D.explain);
  const phase = next(D.phase);
  const defense = next(D.defense);
  const close = next(D.close);

  return (
    <>
      <BlockSequence {...intro}>
        <DarkShell accent={ACCENT} durationInFrames={D.intro} variant="alert" sceneKey="intro">
          <AlertLayout
            tag={<PhaseLabel text="EXPLICADOR" accent={ACCENT[0]} />}
            title={<GlitchTitle text={"¿Qué es\nel phishing?"} accent={ACCENT} size={128} />}
            subtitle={<DetailText text="Te lo explico en 30 segundos" />}
          />
        </DarkShell>
      </BlockSequence>

      <BlockSequence {...explain}>
        <DarkShell accent={ACCENT} durationInFrames={D.explain} variant="terminal" sceneKey="layers">
          <ExplainLayout
            tag={<PhaseLabel text="DEFINICIÓN" accent={ACCENT[0]} />}
            terminal={
              <TerminalBlock
                accent={ACCENT}
                lines={[
                  "> Phishing = engaño digital",
                  "> Mensajes que imitan a bancos",
                  "> Roban tus datos y contraseñas",
                ]}
              />
            }
            definition={
              <NarrativeText
                text={"Un atacante se hace pasar\npor alguien de confianza"}
                size={54}
              />
            }
            detail={<DetailText text="El 90% de los ciberataques empiezan así." />}
          />
        </DarkShell>
      </BlockSequence>

      <BlockSequence {...phase}>
        <DarkShell accent={ACCENT} durationInFrames={D.phase} variant="body" sceneKey="phase1">
          <PhaseLayout
            phase={<PhaseLabel text="CÓMO TE ATACAN" accent={ACCENT[1]} />}
            timestamp={<TimestampDisplay time="PASO 01" accent={ACCENT} />}
            title={<NarrativeText text="Recibes un mensaje urgente" size={62} />}
            indicator={
              <IndicatorCard
                accent={ACCENT}
                items={[
                  "\"Tu cuenta será bloqueada\"",
                  "Un enlace que parece real",
                  "Piden tu clave de inmediato",
                ]}
              />
            }
          />
        </DarkShell>
      </BlockSequence>

      <BlockSequence {...defense}>
        <DarkShell accent={ACCENT} durationInFrames={D.defense} variant="body" sceneKey="reality">
          <DefenseLayout
            tag={<PhaseLabel text="CÓMO PROTEGERTE" accent={ACCENT[0]} />}
            title={<NarrativeText text="3 reglas de oro" size={64} />}
            actions={
              <ActionList
                accent={ACCENT}
                items={[
                  "No hagas clic en enlaces urgentes",
                  "Verifica siempre el remitente",
                  "Activa la verificación en dos pasos",
                ]}
              />
            }
          />
        </DarkShell>
      </BlockSequence>

      <BlockSequence {...close}>
        <DarkShell accent={ACCENT} durationInFrames={D.close} variant="close" sceneKey="close">
          <CloseLayout
            tag={<PhaseLabel text="RECUERDA" accent={ACCENT[1]} />}
            title={<GlitchTitle text={"Piensa antes\nde hacer clic"} accent={ACCENT} size={104} />}
            subtitle={<DetailText text="Sigue para más tips de ciberseguridad" />}
            bar={
              <Reveal>
                <AccentBar accent={ACCENT} />
              </Reveal>
            }
          />
        </DarkShell>
      </BlockSequence>
    </>
  );
};
