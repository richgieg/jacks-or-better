import { Dispatch, SetStateAction } from "react";
import { Game } from "@/hooks/useGame";
import BottomBar from "./BottomBar";
import CardHolder from "./CardHolder";
import TopBar from "./TopBar";
import AlertModal from "./AlertModal";
import IntroModal from "./IntroModal";
import { Screen } from "@/pages";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import * as amplitude from "@amplitude/analytics-browser";
import styles from "./GameScreen.module.css";

type Props = {
  readonly game: Game,
  readonly introModalShown: boolean,
  readonly setIntroModalShown: Dispatch<SetStateAction<boolean>>,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function GameScreen({ game, introModalShown, setIntroModalShown, setScreen }: Props) {
  const { playSound } = useSoundPlayer();

  const onIntroModalClick = () => {
    playSound("click");
    setIntroModalShown(true);
    amplitude.track("Play Pressed");
  };

  return (
    <div className={styles.root}>
      <TopBar game={game} />
      <CardHolder game={game} />
      <BottomBar game={game} setScreen={setScreen} />
      <AlertModal game={game} />
      {!introModalShown && <IntroModal buttonLabel="PLAY" onClick={onIntroModalClick}/>}
    </div>
  );
}
