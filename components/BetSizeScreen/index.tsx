import { Dispatch, SetStateAction } from "react";
import { Screen } from "@/pages";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { BetSize, Game } from "@/hooks/useGame";
import * as amplitude from "@amplitude/analytics-browser";
import styles from "./BetSizeScreen.module.css";

type Props = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function BetSizeScreen({ game, setScreen }: Props) {
  const { playSound } = useSoundPlayer();

  const onClick = (betSize: BetSize) => {
    playSound("click");
    game.setBetSize(betSize);
    setScreen("game");
    amplitude.track("Bet Size Pressed", {
      "Bet Size": betSize,
    });
  };

  return (
    <div className={styles.root}>
      <div>
        <button onClick={() => onClick(1)}>1¢</button>
        <button onClick={() => onClick(5)}>5¢</button>
        <button onClick={() => onClick(10)}>10¢</button>
        <button onClick={() => onClick(25)}>25¢</button>
      </div>
      <div>
        <button onClick={() => onClick(100)}>$1</button>
        <button onClick={() => onClick(500)}>$5</button>
        <button onClick={() => onClick(1000)}>$10</button>
        <button onClick={() => onClick(2500)}>$25</button>
      </div>
      <div>
        <button onClick={() => onClick(5000)}>$50</button>
        <button onClick={() => onClick(10000)}>$100</button>
        <button onClick={() => onClick(25000)}>$250</button>
        <button onClick={() => onClick(50000)}>$500</button>
      </div>
      <div>
        <button onClick={() => onClick(100000)}>$1000</button>
        <button onClick={() => onClick(250000)}>$2500</button>
        <button onClick={() => onClick(500000)}>$5000</button>
        <button onClick={() => onClick(1000000)}>$10000</button>
      </div>
    </div>
  );
}
