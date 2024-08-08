import { Dispatch, SetStateAction } from "react";
import { Game } from "@/hooks/useGame";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { Screen } from "@/pages";
import styles from "./Buttons.module.css";

type Props = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function Buttons({ game, setScreen }: Props) {
  return (
    <div className={styles.root}>
      <MenuButton setScreen={setScreen} />
      <ChangeBetMultiplierButton game={game} setScreen={setScreen} />
      <ChangeBetSizeButton game={game} setScreen={setScreen} />
      <MaxBetButton game={game} />
      <DealDrawButton game={game} />
    </div>
  );
}

type MenuButtonProps = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function MenuButton({ setScreen }: MenuButtonProps) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    setScreen("menu");
    amplitude.track("Menu Pressed");
  };

  return (
    <button onClick={onClick}>MENU</button>
  );
}

type ChangeBetMultiplierButtonProps = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function ChangeBetMultiplierButton({ game, setScreen }: ChangeBetMultiplierButtonProps) {
  const { playSound } = useSoundPlayer();
  const onClick = () => {
    if (game.model.status === "deal") {
      playSound("click");
      setScreen("betMultiplier");
      amplitude.track("Change Bet Multiplier Pressed");
    }
  };
  return (
    <button onClick={onClick} disabled={game.model.status === "draw"}>SET BET</button>
  );
}

type ChangeBetSizeButtonProps = {
  readonly game: Game,
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function ChangeBetSizeButton({ game, setScreen }: ChangeBetSizeButtonProps) {
  const { playSound } = useSoundPlayer();
  const onClick = () => {
    if (game.model.status === "deal") {
      playSound("click");
      setScreen("betSize");
      amplitude.track("Change Bet Size Pressed");
    }
  };
  const penniesPerBet = game.model.betSize;
  return (
    <button onClick={onClick} disabled={game.model.status === "draw"}>
      {penniesPerBet >= 100 ? `$${penniesPerBet / 100}` : `${penniesPerBet}¢`}
    </button>
  );
}

type MaxBetButtonProps = {
  readonly game: Game,
};

function MaxBetButton({ game }: MaxBetButtonProps) {
  const { playSound } = useSoundPlayer();
  const onClick = () => {
    if (game.model.status === "deal") {
      amplitude.track("Max Bet Pressed");
      const result = game.maxBet(game.model);
      processDealResult(result, playSound);
    }
  };
  return (
    <button onClick={onClick} disabled={game.model.status === "draw"}>MAX BET</button>
  );
}

type DealDrawButtonProps = {
  readonly game: Game,
};

function DealDrawButton({ game }: DealDrawButtonProps) {
  const { playSound } = useSoundPlayer();
  const onClick = () => {
    switch (game.model.status) {
      case "deal": {
        amplitude.track("Deal Pressed");
        const result = game.deal(game.model);
        processDealResult(result, playSound);
        break;
      }
      case "draw": {
        amplitude.track("Draw Pressed");
        if (game.allCardsHeld(game.model)) {
          playSound("click"); // next
        } else {
          playSound("shuffle"); // draw
        }
        game.draw(game.model);
        break;
      }
    }
  };
  return (
    <button
      className={game.model.status === "draw" ? styles.draw : ""}
      onClick={onClick}
    >{game.model.status === "deal"
      ? "DEAL"
      : game.allCardsHeld(game.model)
        ? "NEXT"
        : "DRAW"
      }</button>
  );
}

function processDealResult(
  result: ReturnType<Game["deal"]>,
  playSound: ReturnType<typeof useSoundPlayer>["playSound"],
): void {
  switch (result) {
    case "success":
      playSound("shuffle");
      break;
    case "notEnoughCredits":
      playSound("click");
      break;
  }
}
