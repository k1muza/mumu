"use client";

import { useMemo, useState } from "react";
import FaIcon from "@/components/FaIcon";
import type { Choice, ChoiceActivity } from "@/lib/types";
import { ClockFace, CoinFace, FlatShape, LengthBar, PencilBar } from "./math-art";
import SpeakerButton from "./SpeakerButton";
import { shake, shuffle, type StageProps } from "./stage";

function SetTile({ n, img }: { n: number; img?: string }) {
  if (n === 0) {
    return (
      <span className="flex flex-col items-center gap-1.5 font-baloo text-[15px] font-extrabold text-[#a99ac8]">
        <FaIcon name="box-open" className="text-[34px]" />
        empty
      </span>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {Array.from({ length: n }, (_, i) => (
        <img key={i} src={img} alt="" className="h-[32px] w-[32px] object-contain sm:h-[42px] sm:w-[42px]" />
      ))}
    </div>
  );
}

function tileContent(
  activity: ChoiceActivity,
  choice: Choice,
  index: number,
  accent: string,
  chip: string,
) {
  const delay = { animationDelay: `${index * 0.06}s` };
  if (activity.style === "img") {
    return (
      <img
        src={choice.img}
        alt=""
        className="w-[76px] h-[76px] m-2.5 object-contain lu-pop sm:w-[112px] sm:h-[112px] sm:m-4"
        style={delay}
      />
    );
  }
  if (activity.style === "color") {
    return (
      <span
        className="block m-4 rounded-[16px] lu-pop w-[64px] h-[64px] sm:m-5 sm:w-[96px] sm:h-[96px]"
        style={{ background: choice.color, ...delay }}
      />
    );
  }
  if (activity.style === "shape") {
    return (
      <span className="m-4 lu-pop inline-flex w-[64px] sm:m-5 sm:w-[96px]" style={delay}>
        <FlatShape kind={choice.shape ?? "circle"} size={96} color={choice.color} />
      </span>
    );
  }
  if (activity.style === "clock") {
    return (
      <div className="m-3 lu-pop sm:m-4" style={delay}>
        <div className="sm:hidden">
          <ClockFace h={choice.time?.[0] ?? 0} m={choice.time?.[1] ?? 0} size={110} accent={accent} />
        </div>
        <div className="hidden sm:block">
          <ClockFace h={choice.time?.[0] ?? 0} m={choice.time?.[1] ?? 0} size={138} accent={accent} />
        </div>
      </div>
    );
  }
  if (activity.style === "coin") {
    return (
      <span className="m-3 lu-pop sm:m-4" style={delay}>
        <span className="sm:hidden">
          <CoinFace cents={choice.cents ?? 0} size={64} />
        </span>
        <span className="hidden sm:inline-flex">
          <CoinFace cents={choice.cents ?? 0} size={96} />
        </span>
      </span>
    );
  }
  if (activity.style === "set") {
    return (
      <div
        className="m-2 lu-pop flex min-h-[80px] min-w-[76px] items-center justify-center sm:m-4 sm:min-h-[104px] sm:min-w-[118px]"
        style={delay}
      >
        <SetTile n={choice.n ?? 0} img={activity.setImg} />
      </div>
    );
  }
  if (activity.style === "ordinal") {
    return (
      <div className="m-1.5 lu-pop flex flex-col items-center gap-1.5 sm:m-3 sm:gap-2" style={delay}>
        <img src={choice.img} alt="" className="h-[48px] w-[48px] object-contain sm:h-[84px] sm:w-[84px]" />
        <span
          className="rounded-full px-2 py-0.5 font-baloo text-[11px] font-extrabold sm:px-2.5 sm:text-[13px]"
          style={{ background: chip, color: accent }}
        >
          {choice.pos}
        </span>
      </div>
    );
  }
  const size =
    activity.style === "char"
      ? "text-[44px] sm:text-[64px]"
      : activity.style === "glyph"
        ? "text-[38px] sm:text-[52px]"
        : activity.style === "number"
          ? "text-[34px] sm:text-[46px]"
          : "text-[22px] sm:text-[30px]";
  const pad =
    activity.style === "text"
      ? "px-4 py-3.5 sm:px-[22px] sm:py-[18px]"
      : "px-4 py-3.5 sm:px-[30px] sm:py-[26px]";
  return (
    <span
      className={`${size} ${pad} font-baloo font-extrabold leading-none lu-pop`}
      style={{ color: "#3b2a63", ...delay }}
    >
      {choice.label}
    </span>
  );
}

export default function ChoiceStage({
  activity,
  accent,
  chip,
  answered,
  onCorrect,
  onWrong,
  speechEnabled,
}: StageProps<ChoiceActivity>) {
  // Ordinal rows are positional and length bars are labelled in order — keep authored order.
  const ordered = activity.style === "ordinal" || activity.style === "length";
  const choices = useMemo(
    () => (ordered ? activity.choices : shuffle(activity.choices)),
    [activity, ordered],
  );
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  const pick = (e: React.MouseEvent<HTMLButtonElement>, choice: Choice, i: number) => {
    if (answered || correctIndex !== null) return;
    if (choice.correct) {
      setCorrectIndex(i);
      e.currentTarget.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: 320 },
      );
      onCorrect(activity.correctFeedback);
    } else {
      setWrongIndex(i);
      shake(e.currentTarget);
      setTimeout(() => setWrongIndex(null), 700);
      onWrong(activity.incorrectFeedback);
    }
  };

  const stacked = activity.style === "length";
  const cols =
    activity.style === "ordinal"
      ? choices.length === 3
        ? "grid-cols-3"
        : "grid-cols-4"
      : activity.style === "clock"
        ? choices.length >= 4
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3"
        : choices.length >= 4
          ? "grid-cols-2 sm:grid-cols-4"
          : choices.length === 3
            ? "grid-cols-3"
            : "grid-cols-2";

  const tileState = (i: number) => ({
    border:
      correctIndex === i
        ? "3px solid #3fae4a"
        : wrongIndex === i
          ? "3px solid #e46161"
          : "3px solid rgba(0,0,0,.06)",
    boxShadow:
      correctIndex === i
        ? "0 0 0 4px #3fae4a55,0 6px 16px rgba(60,40,90,.14)"
        : "0 6px 16px rgba(60,40,90,.1)",
    opacity: correctIndex !== null && correctIndex !== i ? 0.55 : 1,
  });

  return (
    <div>
      {activity.audioWord && (
        <div className="flex justify-center mb-4">
          <SpeakerButton
            word={activity.audioWord}
            accent={accent}
            chip={chip}
            speechEnabled={speechEnabled}
          />
        </div>
      )}
      {stacked ? (
        <div className="mx-auto flex max-w-[560px] flex-col gap-3">
          {choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => pick(e, choice, i)}
              className="flex w-full items-center gap-3 rounded-[20px] bg-white px-4 py-3.5 transition-transform hover:scale-[1.02] sm:gap-4 sm:px-5 sm:py-4"
              style={tileState(i)}
            >
              {choice.label && (
                <span
                  className="w-[58px] flex-none text-left font-baloo text-[13px] font-extrabold sm:w-[82px] sm:text-[15px]"
                  style={{ color: accent }}
                >
                  {choice.label}
                </span>
              )}
              <span className="lu-pop inline-flex min-w-0" style={{ animationDelay: `${i * 0.06}s` }}>
                {choice.look === "pencil" ? (
                  <PencilBar len={choice.len ?? 0} color={choice.color ?? accent} />
                ) : (
                  <LengthBar len={choice.len ?? 0} color={choice.color ?? accent} />
                )}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`grid ${cols} gap-3 sm:gap-4 justify-items-center`}>
          {choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => pick(e, choice, i)}
              className="relative bg-white rounded-[22px] flex items-center justify-center transition-transform hover:scale-[1.03]"
              style={tileState(i)}
            >
              {tileContent(activity, choice, i, accent, chip)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
