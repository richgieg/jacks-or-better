import { Rank, Suit } from "@/hooks/useGame";
import styles from "./Card.module.css";

type Props =
 | FrontProps
 | BackProps;

type FrontProps = {
  readonly side: "front",
  readonly suit: Suit,
  readonly rank: Rank,
  readonly held: boolean,
  readonly dim: boolean,
  readonly disabled: boolean,
  readonly onClick: () => void,
};

type BackProps = {
  readonly side: "back",
};

export default function Card(props: Props) {
  switch (props.side) {
    case "front":
      return (
        <button
          className={`${styles.root} ${styles[props.suit]} ${props.held ? styles.held : ""} ${props.dim ? styles.dim : ""}`}
          onTouchStart={props.onClick}
          onTouchEnd={(event) => event.preventDefault()} // prevent onClick from firing on mobile
          onClick={props.onClick}
          disabled={props.disabled}
        >
          <SuitIcon suit={props.suit} />
          <SuitIcon suit={props.suit} />
          <SuitIcon suit={props.suit} />
          <SuitIcon suit={props.suit} />
          <div className={styles.rank}>{props.rank}</div>
          {props.held && <div className={styles.held}>HELD</div>}
        </button>
      );
    case "back":
      return (
        <button className={`${styles.root} ${styles.back}`} disabled>
          <div></div>
        </button>
      )
  }

}

type SuitIconProps = {
  readonly suit: FrontProps["suit"],
};

function SuitIcon({ suit }: SuitIconProps) {

  switch (suit) {
    case "clubs":
      return (
        <svg width="198" height="213" viewBox="0 0 198 213" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M145.002 213H52.0024V203C73.3175 193.92 81.431 185.687 88.5024 165C54.4929 194.399 -0.420303 178.864 0.00242629 122.5C1.22791 99.4642 20.0555 77.7863 52.5024 76C37.9934 45.6998 53.3111 1.82209 99.0024 0C138.288 1.80855 159.438 38.7605 144.502 76C176.306 78.7351 193.789 97.087 197.002 122.5C199.882 171.672 146.522 198.724 108.502 165C115.813 187.049 124.245 194.917 145.002 203V213Z" fill="currentColor"/>
        </svg>
      );
    case "diamonds":
      return (
        <svg width="181" height="212" viewBox="0 0 181 212" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 106C38.8879 142.886 58.6364 166.186 90.5 212C121.448 167.397 141.063 144.044 181 106C141.446 71.6402 121.646 48.3544 90.5 0C61.9069 47.6368 41.9417 70.691 0 106Z" fill="currentColor"/>
        </svg>
      );
    case "hearts":
      return (
        <svg width="239" height="203" viewBox="0 0 239 203" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M237.919 47.6552C246.171 124.249 192.807 134.363 118.919 202.155C23.4961 120.377 -3.83397 119.309 0.418986 47.6552C6.68633 -4.39034 82.2084 -20.9079 119.419 35.1552C158.038 -23.3148 230.489 -1.64644 237.919 47.6552Z" fill="currentColor"/>
        </svg>
      );
    case "spades":
      return (
        <svg width="208" height="212" viewBox="0 0 208 212" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M151.539 212H56.5387V202C80.5089 191.989 87.3678 181.504 96.0387 157C60.5688 192.279 -9.33531 178.239 1.03876 105.5C6.81465 61.6841 82.7407 23.183 104.039 0C125.47 23.1051 200.784 63.3405 206.539 105.5C218.305 185.073 141.716 189 112.039 157C120.661 184.552 130.574 192.819 151.539 202V212Z" fill="currentColor"/>
        </svg>
      );
  }

}
