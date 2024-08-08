import { Game } from "@/hooks/useGame";
import Card from "./Card";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import styles from "./CardHolder.module.css";

type Props = {
  readonly game: Game,
};

export default function CardHolder({ game }: Props) {
  const { playSound } = useSoundPlayer();

  if (game.model.cards === null) {
    return (
      <div className={styles.root}>
        <Card side="back" />
        <Card side="back" />
        <Card side="back" />
        <Card side="back" />
        <Card side="back" />
      </div>
    );
  }

  const onClick = (cardIndex: number) => {
    if (game.model.status === "draw") {
      playSound("click");
      if (game.model.cardsHeldFlags[cardIndex]) {
        amplitude.track("Card Unheld");
      } else {
        amplitude.track("Card Held");
      }
      game.toggleHold(cardIndex, game.model);
    }
  };

  return (
    <div className={styles.root}>
      {game.model.cards.map(({ suit, rank }, index) =>
        <Card
          key={index}
          side="front"
          suit={suit}
          rank={rank}
          held={game.model.cardsHeldFlags[index]}
          dim={game.model.status === "deal" && !game.model.winningCardFlags[index]}
          disabled={game.model.status === "deal"}
          onClick={() => onClick(index)}
        />
      )}
    </div>
  );
}
