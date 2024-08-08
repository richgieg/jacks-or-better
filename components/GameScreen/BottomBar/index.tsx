import { Dispatch, SetStateAction } from "react";
import { Game } from "@/hooks/useGame";
import Buttons from "./Buttons";
import Indicators from "./Indicators";
import { Screen } from "@/pages";
import styles from "./BottomBar.module.css";

type Props = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function BottomBar({ game, setScreen }: Props) {
  return (
    <div className={styles.root}>
      <Indicators game={game} />
      <Buttons game={game} setScreen={setScreen} />
    </div>
  );
}
