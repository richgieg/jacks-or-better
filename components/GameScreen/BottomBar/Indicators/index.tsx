import { Game } from "@/hooks/useGame";
import styles from "./Indicators.module.css";

type Props = {
  readonly game: Game,
};

export default function Indicators({ game }: Props) {
  return (
    <div className={styles.root}>
      <WinIndicator game={game} />
      <BetIndicator game={game} />
      <CreditIndicator game={game} />
    </div>
  );
}

function WinIndicator({ game }: Props) {
  return (
    <div>{game.model.winnings ? `WIN ${game.model.winnings.quantity}` : ""}</div>
  );
}

function BetIndicator({ game }: Props) {
  return (
    <div>BET {game.model.betMultiplier}</div>
  );
}

function CreditIndicator({ game }: Props) {
  return (
    <div>CREDITS {Math.floor(game.model.pennies / game.model.betSize)}</div>
  );
}
