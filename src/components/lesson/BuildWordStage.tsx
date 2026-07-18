"use client";

import { useMemo, useState } from "react";
import type { BuildWordActivity } from "@/lib/types";
import { shake, shuffle, type StageProps } from "./stage";

export default function BuildWordStage({
  activity,
  accent,
  chip,
  answered,
  onCorrect,
}: StageProps<BuildWordActivity>) {
  const word = activity.word;
  const bank = useMemo(
    () => shuffle(word.split("").map((ch, i) => ({ ch, key: i }))),
    [word],
  );
  const [filled, setFilled] = useState(0);
  const [usedKeys, setUsedKeys] = useState<number[]>([]);

  const tap = (e: React.MouseEvent<HTMLButtonElement>, ch: string, key: number) => {
    if (answered || usedKeys.includes(key) || filled >= word.length) return;
    if (ch === word[filled]) {
      const next = filled + 1;
      setUsedKeys((u) => [...u, key]);
      setFilled(next);
      if (next === word.length) {
        onCorrect(`You built the word “${word}”! ${word.split("").join("-")}`);
      }
    } else {
      shake(e.currentTarget);
    }
  };

  return (
    <div
      className="bg-white rounded-[26px] px-6 py-7 flex flex-col items-center gap-5"
      style={{ boxShadow: "0 8px 22px rgba(60,40,90,.1)", border: "1px solid rgba(0,0,0,.04)" }}
    >
      <img src={activity.img} alt="" className="w-[120px] h-[120px] object-contain lu-pop" />
      <div className="flex items-center gap-3">
        {word.split("").map((ch, i) => {
          const done = i < filled;
          return (
            <span
              key={i}
              className="rounded-[16px] flex items-center justify-center font-baloo font-extrabold text-[34px]"
              style={{
                width: 66,
                height: 72,
                background: done ? "#fff" : chip,
                border: done ? `3px solid ${accent}` : `3px dashed ${accent}66`,
                color: "#3b2a63",
              }}
            >
              {done ? ch : ""}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {bank.map(({ ch, key }) => {
          const used = usedKeys.includes(key);
          return (
            <button
              key={key}
              type="button"
              disabled={used}
              onClick={(e) => tap(e, ch, key)}
              className="rounded-[16px] font-baloo font-extrabold text-[30px]"
              style={{
                width: 64,
                height: 70,
                background: "#fff",
                border: `3px solid ${accent}44`,
                color: "#3b2a63",
                boxShadow: `0 5px 0 ${accent}22`,
                opacity: used ? 0.35 : 1,
              }}
            >
              {ch}
            </button>
          );
        })}
      </div>
    </div>
  );
}
