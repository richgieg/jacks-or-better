import { Dispatch, SetStateAction } from "react";
import { Screen } from "@/pages";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { BetMultiplier, Game } from "@/hooks/useGame";
import * as amplitude from "@amplitude/analytics-browser";
import styles from "./BetMultiplierScreen.module.css";

type Props = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function BetMultiplierScreen({ game, setScreen }: Props) {
  const { playSound } = useSoundPlayer();

  const onClick = (betMultiplier: BetMultiplier) => {
    playSound("click");
    game.setBetMultiplier(betMultiplier);
    setScreen("game");
    amplitude.track("Bet Multiplier Pressed", {
      "Bet Multiplier": betMultiplier,
    });
  };

  return (
    <div className={styles.root}>
      <button onClick={() => onClick(1)}>1</button>
      <button onClick={() => onClick(2)}>2</button>
      <button onClick={() => onClick(3)}>3</button>
      <button onClick={() => onClick(4)}>4</button>
      <button onClick={() => onClick(5)}>5</button>
    </div>
  );
}
