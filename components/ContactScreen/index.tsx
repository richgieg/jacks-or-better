import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Screen } from "@/pages";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import styles from "./ContactScreen.module.css";

type Props = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function ContactScreen({ setScreen }: Props) {
  const { playSound } = useSoundPlayer();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const onClickBack = () => {
    playSound("click");
    setScreen("menu");
    amplitude.track("Contact Back Pressed");
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    playSound("click");
    setMessageSent(true);
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });
    amplitude.track("Contact Message Sent", {
      Name: name,
      Email: email,
      Message: message,
    });
  };

  if (messageSent) {
    const onClick = () => {
      playSound("click");
      setScreen("menu");
      amplitude.track("Contact Confirmation OK Pressed");
    };

    return (
      <div className={styles.root}>
        <div className={styles.confirmation}>Message Sent!</div>
        <button onClick={onClick}>OK</button>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <form onSubmit={onSubmit}>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="Name"
            spellCheck={false}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <textarea
          placeholder="Message"
          spellCheck={false}
          value={message}
          onChange={(e) => setMessage(e.target.value)} required
        />
        <div className={styles.buttons}>
          <button type="button" onClick={onClickBack}>BACK</button>
          <button type="submit">SEND</button>
        </div>
      </form>
    </div>
  );
}
