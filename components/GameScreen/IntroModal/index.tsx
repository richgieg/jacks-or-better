import * as amplitude from "@amplitude/analytics-browser";
import styles from "./IntroModal.module.css";

type Props = {
  readonly buttonLabel: string,
  readonly onClick: () => void,
};

export default function IntroModal({ buttonLabel, onClick }: Props) {
  const onClickAttributionLink = () => {
    amplitude.logEvent("Attribution Link Pressed");
  };

  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <svg width="138" height="31" viewBox="0 0 138 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.9225 30.6762H7.82417V29.2595C10.8262 27.9731 11.969 26.8068 12.9649 23.8759C8.17494 28.041 0.440803 25.8401 0.500342 17.8549C0.672942 14.5913 3.32467 11.5202 7.89459 11.2671C5.8511 6.9744 8.00848 0.75814 14.4438 0.5C19.9768 0.756221 22.9557 5.99128 20.8521 11.2671C25.3315 11.6546 27.7938 14.2545 28.2464 17.8549C28.6519 24.8212 21.1365 28.6537 15.7818 23.8759C16.8114 26.9997 17.999 28.1143 20.9225 29.2595V30.6762Z" fill="currentColor"/>
          <path d="M35.5044 15.5881C40.9504 20.8384 43.7161 24.155 48.1784 30.6762C52.5125 24.3274 55.2595 21.0034 60.8524 15.5881C55.3131 10.6973 52.5402 7.3828 48.1784 0.5C44.1741 7.28066 41.3781 10.5622 35.5044 15.5881Z" fill="currentColor"/>
          <path d="M101.172 7.1868C102.319 17.9341 94.8998 19.3533 84.6275 28.8656C71.3613 17.3908 67.5617 17.241 68.153 7.1868C69.0243 -0.116036 79.5238 -2.43371 84.697 5.43285C90.0661 -2.77144 100.139 0.268978 101.172 7.1868Z" fill="currentColor"/>
          <path d="M129.661 30.0727H116.414V28.6777C119.757 27.2812 120.713 25.8187 121.922 22.4005C116.976 27.3217 107.229 25.3632 108.676 15.2166C109.481 9.10455 120.068 3.73389 123.038 0.5C126.026 3.72302 136.528 9.3356 137.33 15.2166C138.971 26.3165 128.291 26.8643 124.153 22.4005C125.355 26.2438 126.738 27.3971 129.661 28.6777V30.0727Z" fill="currentColor"/>
        </svg>
        <h1>Jacks or Better</h1>
        <h2>Video Poker</h2>
        <div className={styles.attribution}>
          Created By: <a href="https://www.richgieg.com/" onClick={onClickAttributionLink} target="_blank">Richard Gieg</a>
        </div>
        <button onClick={onClick}>{buttonLabel}</button>
        <div className={styles.version}>Version: 1.0.1</div>
      </div>
    </div>
  );
}
