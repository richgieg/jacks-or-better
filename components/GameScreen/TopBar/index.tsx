import { Game } from "@/hooks/useGame"
import HandIndicator from "./HandIndicator";
import styles from "./TopBar.module.css";

type Props = {
  readonly game: Game,
};

export default function TopBar({ game }: Props) {
  return (
    <div className={styles.root}>
      <HandIndicator game={game} />
    </div>
  );
}
