import { useEffect } from "react";
import { Game } from "@/hooks/useGame";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import styles from "./AlertModal.module.css";

const alerts = {
  notEnoughCredits: {
    heading: "Not Enough Credits",
    body: "Change bet size or multiplier.",
  },
  creditLineIssued: {
    heading: "Out of Money",
    body: "A line of credit has been issued!",
  },
} as const;

type Props = {
  readonly game: Game,
};

export default function AlertModal({ game }: Props) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    game.clearAlert();
    playSound("click");
    amplitude.track("Alert OK Pressed", {
      Key: game.model.alert,
    });
  };

  useEffect(() => {
    if (game.model.alert) {
      amplitude.track("Alert", {
        Key: game.model.alert,
      });
    }
  }, [game.model.alert, playSound]);

  if (!game.model.alert) {
    return <></>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <div className={styles.heading}>{alerts[game.model.alert].heading}</div>
        <div className={styles.body}>{alerts[game.model.alert].body}</div>
        <button onClick={onClick}>OK</button>
      </div>
    </div>
  );
}
