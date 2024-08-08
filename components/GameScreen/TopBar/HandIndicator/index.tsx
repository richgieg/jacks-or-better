import { Game, WinningHand } from "@/hooks/useGame";
import styles from "./HandIndicator.module.css";

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
  readonly game: Game,
};

export default function HandIndicator({ game }: Props) {
  if (game.model.winnings) {
    return (
      <div className={`${styles.root} ${styles.won}`}>
        {winningHandLabels[game.model.winnings.hand]}
      </div>
    );
  }
  return (
    <div className={`${styles.root}`}>
      {game.model.winningHandHint ? winningHandLabels[game.model.winningHandHint] : ""}
    </div>
  );
}
