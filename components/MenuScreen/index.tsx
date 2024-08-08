import { Dispatch, SetStateAction, useState } from "react";
import { Screen } from "@/pages";
import * as amplitude from "@amplitude/analytics-browser";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { useDarkMode } from "usehooks-ts";
import IntroModal from "../GameScreen/IntroModal";
import styles from "./MenuScreen.module.css";

type Props = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

export default function MenuScreen({ setScreen }: Props) {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const { playSound } = useSoundPlayer();

  const onIntroModalClick = () => {
    playSound("click");
    setShowIntroModal(false);
    amplitude.track("About OK Pressed");
  };

  return (
    <div className={styles.root}>
      <div>
        <PayTableButton setScreen={setScreen} />
        <VolumeButton />
        <ThemeButton />
      </div>
      <div>
        <AboutButton setShowIntroModal={setShowIntroModal} />
        {/* TODO: Uncomment the following button when /api/contact is fully set up. */}
        {/* <ContactButton setScreen={setScreen} /> */}
        <BackButton setScreen={setScreen} />
      </div>
      {showIntroModal && <IntroModal buttonLabel="OK" onClick={onIntroModalClick} />}
    </div>
  );
}

type PayTableButtonProps = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function PayTableButton({ setScreen }: PayTableButtonProps) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    setScreen("payTable");
    amplitude.track("Pay Table Pressed");
  };

  return (
    <button onClick={onClick}>
      <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.9722 47H30.0278V33.9444H16.9722V47ZM33.9444 47H38.5139C43.2006 47 47 43.2006 47 38.5139V33.9444H33.9444V47ZM47 30.0278V16.9722H33.9444V30.0278H47ZM47 13.0556V8.48611C47 3.79935 43.2006 0 38.5139 0H33.9444V13.0556H47ZM30.0278 0H16.9722V13.0556H30.0278V0ZM13.0556 0H8.48611C3.79935 0 0 3.79935 0 8.48611V13.0556H13.0556V0ZM0 16.9722V30.0278H13.0556V16.9722H0ZM0 33.9444V38.5139C0 43.2006 3.79935 47 8.48611 47H13.0556V33.9444H0ZM30.0278 16.9722V30.0278H16.9722V16.9722H30.0278Z" fill="currentColor"/>
      </svg>
      PAY TABLE
    </button>
  );
}

function ThemeButton() {
  const { toggle } = useDarkMode();
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    toggle();
    amplitude.track("Theme Pressed");
  };

  return (
    <button onClick={onClick}>
      <svg width="47" height="47" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.5 47C36.4786 47 47 36.4786 47 23.5C47 10.5213 36.4786 0 23.5 0C10.5213 0 0 10.5213 0 23.5C0 36.4786 10.5213 47 23.5 47ZM23.5 43.475V3.525C34.5318 3.525 43.475 12.4681 43.475 23.5C43.475 34.5318 34.5318 43.475 23.5 43.475Z" fill="currentColor"/>
      </svg>
      THEME
    </button>
  );
}

function VolumeButton() {
  const { volume, changeToNextVolume, playSound } = useSoundPlayer();

  const onClick = () => {
    const newVolume = changeToNextVolume();
    playSound("click", newVolume);
    amplitude.track("Volume Pressed", {
      "New Volume": newVolume,
    });
  };

  return (
    <button onClick={onClick}>
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        {(() => {
          switch (volume) {
            case "off":
              return <path d="M13 1.25244C13 0.173823 11.7255 -0.398407 10.9195 0.318263L6.42794 4.31153C6.29065 4.4336 6.11333 4.50102 5.92961 4.50102H2.25C1.00736 4.50102 0 5.50838 0 6.75102V11.249C0 12.4916 1.00736 13.499 2.25 13.499H5.92956C6.11329 13.499 6.29063 13.5664 6.42793 13.6885L10.9194 17.6822C11.7255 18.399 13 17.8267 13 16.7481V1.25244ZM14.2197 6.22211C14.5126 5.92922 14.9874 5.92922 15.2803 6.22211L17 7.94175L18.7197 6.22211C19.0126 5.92922 19.4874 5.92922 19.7803 6.22211C20.0732 6.515 20.0732 6.98988 19.7803 7.28275L18.0607 9.00245L19.7803 10.7222C20.0732 11.0151 20.0732 11.4899 19.7803 11.7828C19.4874 12.0757 19.0126 12.0757 18.7197 11.7828L17 10.0631L15.2803 11.7828C14.9874 12.0757 14.5126 12.0757 14.2197 11.7828C13.9268 11.4899 13.9268 11.0151 14.2197 10.7222L15.9393 9.00245L14.2197 7.28275C13.9268 6.98988 13.9268 6.515 14.2197 6.22211Z" fill="currentColor"/>;
            case "low":
              return <path d="M12.7041 0.442494C12.8952 0.668204 13 0.954334 13 1.25002V16.7517C13 17.4421 12.4404 18.0017 11.75 18.0017C11.4542 18.0017 11.168 17.8968 10.9423 17.7057L5.97513 13.4999H2.25C1.00736 13.4999 0 12.4925 0 11.2499V6.74985C0 5.50721 1.00736 4.49985 2.25 4.49985H5.97522L10.9425 0.295884C11.4694 -0.150106 12.2582 -0.084466 12.7041 0.442494Z" fill="currentColor"/>;
            case "medium":
              return <path d="M12.7041 0.4425C12.8952 0.66821 13 0.95433 13 1.25003V16.7517C13 17.442 12.4404 18.0017 11.75 18.0017C11.4542 18.0017 11.168 17.8968 10.9423 17.7056L5.97513 13.4999H2.25C1.00736 13.4999 0 12.4925 0 11.2499V6.74985C0 5.50721 1.00736 4.49985 2.25 4.49985H5.97522L10.9425 0.29588C11.4694 -0.15011 12.2582 -0.0844602 12.7041 0.4425ZM15.1035 5.64021C15.4571 5.42442 15.9187 5.5361 16.1344 5.88967C16.7083 6.8298 16.9957 7.8818 16.9957 9.0304C16.9957 10.1789 16.7083 11.231 16.1344 12.1711C15.9187 12.5247 15.4571 12.6364 15.1035 12.4206C14.75 12.2048 14.6383 11.7432 14.8541 11.3897C15.2822 10.6882 15.4957 9.9069 15.4957 9.0304C15.4957 8.1539 15.2822 7.3726 14.8541 6.67112C14.6383 6.31756 14.75 5.85601 15.1035 5.64021Z" fill="currentColor"/>;
            case "high":
              return <path d="M13 1.25244V16.7481C13 17.8267 11.7255 18.399 10.9194 17.6822L6.42793 13.6885C6.29063 13.5664 6.11329 13.499 5.92956 13.499H2.25C1.00736 13.499 0 12.4916 0 11.249V6.75102C0 5.50838 1.00736 4.50102 2.25 4.50102H5.92961C6.11333 4.50102 6.29065 4.4336 6.42794 4.31153L10.9195 0.318263C11.7255 -0.398407 13 0.173823 13 1.25244ZM16.9916 2.89977C17.3244 2.65323 17.7941 2.72321 18.0407 3.05606C19.2717 4.71814 20 6.77634 20 9.00245C20 11.2286 19.2717 13.2868 18.0407 14.9489C17.7941 15.2818 17.3244 15.3517 16.9916 15.1052C16.6587 14.8587 16.5888 14.389 16.8353 14.0561C17.8815 12.6436 18.5 10.8963 18.5 9.00245C18.5 7.10865 17.8815 5.3614 16.8353 3.94885C16.5888 3.61599 16.6587 3.1463 16.9916 2.89977ZM15.143 5.37177C15.5072 5.17457 15.9624 5.31001 16.1596 5.67428C16.6958 6.66489 17 7.79925 17 9.00245C17 10.2057 16.6958 11.34 16.1596 12.3307C15.9624 12.6949 15.5072 12.8304 15.143 12.6332C14.7787 12.436 14.6432 11.9808 14.8404 11.6166C15.2609 10.8398 15.5 9.95015 15.5 9.00245C15.5 8.05475 15.2609 7.16515 14.8404 6.38837C14.6432 6.02411 14.7787 5.56896 15.143 5.37177Z" fill="currentColor"/>;
          }
        })()}
      </svg>
      VOLUME
    </button>
  );
}

type AboutButtonProps = {
  readonly setShowIntroModal: Dispatch<SetStateAction<boolean>>,
};

function AboutButton({ setShowIntroModal }: AboutButtonProps) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    setShowIntroModal(true);
    amplitude.track("About Pressed");
  };

  return (
    <button onClick={onClick}>
      <svg width="47" height="47" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.5001 0C36.4788 0 47 10.5213 47 23.5001C47 36.4788 36.4788 47 23.5001 47C10.5213 47 0 36.4788 0 23.5001C0 10.5213 10.5213 0 23.5001 0ZM23.4911 19.3858C22.286 19.3868 21.2935 20.2944 21.1587 21.4632L21.1429 21.7371L21.1514 34.6639L21.1673 34.9379C21.3039 36.1064 22.2978 37.0129 23.5027 37.0119C24.7076 37.0112 25.7 36.1035 25.8351 34.9348L25.8507 34.6609L25.8422 21.7341L25.8262 21.4601C25.6897 20.2916 24.696 19.3851 23.4911 19.3858ZM23.501 10.5758C21.8769 10.5758 20.5604 11.8924 20.5604 13.5164C20.5604 15.1405 21.8769 16.4571 23.501 16.4571C25.1251 16.4571 26.4418 15.1405 26.4418 13.5164C26.4418 11.8924 25.1251 10.5758 23.501 10.5758Z" fill="currentColor"/>
      </svg>
      ABOUT
    </button>
  );
}

type ContactButtonProps = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function ContactButton({ setScreen }: ContactButtonProps) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    setScreen("contact");
    amplitude.track("Contact Pressed");
  };

  return (
    <button onClick={onClick}>
      <svg width="47" height="47" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9009 30.2105C18.9009 28.9507 19.3173 27.7879 20.0197 26.8527H6.03431C3.25393 26.8527 1 29.1065 1 31.887V33.9463C1 35.227 1.39937 36.4757 2.14249 37.5187C5.59476 42.3639 11.2427 44.7639 18.9009 44.7639H19.0133C18.9396 44.4014 18.9009 44.0263 18.9009 43.6421V30.2105ZM18.9009 0C25.0825 0 30.0939 5.01127 30.0939 11.193C30.0939 17.3747 25.0825 22.386 18.9009 22.386C12.7191 22.386 7.70784 17.3747 7.70784 11.193C7.70784 5.01127 12.7191 0 18.9009 0ZM33.4739 37.882L21.182 30.7118C21.4831 28.5316 23.3539 26.8527 25.6169 26.8527H41.2871C43.7379 26.8527 45.7287 28.8219 45.7638 31.2643L33.4739 37.882ZM33.9825 40.1506L45.7642 33.8066V42.5228C45.7642 44.9956 43.7598 47 41.2871 47H25.6169C23.1441 47 21.1397 44.9956 21.1397 42.5228V33.2788L32.8881 40.1318C33.2248 40.3283 33.6393 40.3353 33.9825 40.1506Z" fill="currentColor"/>
      </svg>
      CONTACT
    </button>
  );
}

type BackButtonProps = {
  readonly setScreen: Dispatch<SetStateAction<Screen>>,
};

function BackButton({ setScreen }: BackButtonProps) {
  const { playSound } = useSoundPlayer();

  const onClick = () => {
    playSound("click");
    setScreen("game");
    amplitude.track("Menu Back Pressed");
  };

  return (
    <button onClick={onClick}>
      <svg width="47" height="47" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.5 0C10.5213 0 0 10.5213 0 23.5C0 36.4786 10.5213 47 23.5 47C36.4786 47 47 36.4786 47 23.5C47 10.5213 36.4786 0 23.5 0ZM24.1582 34.1471C23.5324 34.773 22.5534 34.8298 21.8635 34.3178L21.6658 34.1471L12.2638 24.7453C11.638 24.1195 11.5812 23.14 12.0933 22.45L12.264 22.2524L21.6677 12.8524C22.356 12.1643 23.472 12.1645 24.1601 12.8529C24.7857 13.4787 24.8426 14.4579 24.3305 15.1478L24.1596 15.3454L17.7631 21.7391L33.4887 21.7384C34.381 21.7384 35.1184 22.4014 35.235 23.2617L35.2512 23.5009C35.2512 24.3932 34.588 25.1307 33.7279 25.2472L33.4887 25.2634L17.7678 25.2641L24.1582 31.6545C24.784 32.2803 24.8409 33.2595 24.3288 33.9495L24.1582 34.1471Z" fill="currentColor"/>
      </svg>
      BACK
    </button>
  );
}
