import { Dispatch, SetStateAction } from "react";
import { Screen } from "@/pages";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { WinningHand, payTable, winningHands } from "@/hooks/useGame";
import styles from "./PayTableScreen.module.css";

const winningHandLabels: { readonly [H in WinningHand]: string } = {
  jacksOrBetter: "Jacks or Better",
  twoPair: "2 Pair",
  threeOfAKind: "3 of a Kind",
  straight: "Straight",
  flush: "Flush",
  fullHouse: "Full House",
  fourOfAKind: "4 of a Kind",
  straightFlush: "Straight Flush",
  royalFlush: "Royal Flush",
};

type Props = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function PayTableScreen({ setScreen }: Props) {
  const { playSound } = useSoundPlayer();

  const onClickBack = () => {
    playSound("click");
    setScreen("menu");
    amplitude.track("Pay Table Back Pressed");
  };

  return (
    <div className={styles.root}>
      <div className={styles.table}>
        {winningHands.map((winningHand) => (
          <div className={styles.row} key={winningHand}>
            <div className={styles.handCell}>{winningHandLabels[winningHand]}</div>
            <div className={styles.payCells}>
              {payTable[winningHand].map((pay, index) => (
                <div key={index}>{pay}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClickBack}>BACK</button>
    </div>
  );
}
