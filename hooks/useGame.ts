import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import useSoundPlayer from "./useSoundPlayer";

const INITIAL_PENNIES = 1000000;
const INITIAL_BET_MULTIPLIER: BetMultiplier = 1;
const MAX_BET_MULTIPLIER: BetMultiplier = 5;
const INITIAL_BET_SIZE: BetSize = 1;

export type BetMultiplier = 1 | 2 | 3 | 4 | 5;

const betSizes = [
  1, 5, 10, 25,
  100, 500, 1000, 2500,
  5000, 10000, 25000, 50000,
  100000, 250000, 500000, 1000000,
] as const;

export type BetSize = typeof betSizes[number];

const suits = ["clubs", "diamonds", "hearts", "spades"] as const;

export type Suit = typeof suits[number];

const ranksHighAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"] as const;
const ranksLowAce = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

export type Rank = typeof ranksHighAce[number];

export const winningHands = [
  "royalFlush",
  "straightFlush",
  "fourOfAKind",
  "fullHouse",
  "flush",
  "straight",
  "threeOfAKind",
  "twoPair",
  "jacksOrBetter",
] as const;

export type WinningHand = typeof winningHands[number];

// 9/6 pay table with royal flush max bet bonus.
export const payTable = {
  royalFlush: [250, 500, 750, 1000, 4000],
  straightFlush: [50, 100, 150, 200, 250],
  fourOfAKind: [25, 50, 75, 100, 125],
  fullHouse: [9, 18, 27, 36, 45],
  flush: [6, 12, 18, 24, 30],
  straight: [4, 8, 12, 16, 20],
  threeOfAKind: [3, 6, 9, 12, 15],
  twoPair: [2, 4, 6, 8, 10],
  jacksOrBetter: [1, 2, 3, 4, 5],
} as const satisfies {
  [H in WinningHand]: readonly [number, number, number, number, number]
};

export type Game = {
  readonly model: Model,
  readonly clearAlert: () => void,
  readonly setBetSize: (betSize: BetSize) => void,
  readonly setBetMultiplier: (betMultipler: BetMultiplier) => void,
  readonly deal: (model: DealModel) => ReturnType<typeof deal>,
  readonly maxBet: (model: DealModel) => ReturnType<typeof deal>,
  readonly toggleHold: (cardIndex: number, model: DrawModel) => void,
  readonly allCardsHeld: (model: DrawModel) => boolean,
  readonly draw: (model: DrawModel) => void,
};

type Model =
  | DealModel
  | DrawModel;

type DealModel = {
  readonly status: "deal",
  readonly deck: readonly Card[],
  readonly cards: readonly Card[] | null,
  readonly cardsHeldFlags: readonly boolean[],
  readonly pennies: number,
  readonly betSize: BetSize,
  readonly betMultiplier: BetMultiplier,
  readonly winnings: Winnings | null,
  readonly winningCardFlags: readonly boolean[],
  readonly winningHandHint: null,
  readonly creditLines: number,
  readonly alert?: "notEnoughCredits" | "creditLineIssued",
};

type Winnings = {
  readonly quantity: number,
  readonly hand: WinningHand,
};

type DrawModel = {
  readonly status: "draw",
  readonly deck: readonly Card[],
  readonly cards: readonly Card[],
  readonly cardsHeldFlags: readonly boolean[],
  readonly pennies: number,
  readonly betSize: BetSize,
  readonly betMultiplier: BetMultiplier,
  readonly winnings: null,
  readonly winningCardFlags: null,
  readonly winningHandHint: WinningHand | null,
  readonly creditLines: number,
  readonly alert?: "notEnoughCredits" | "creditLineIssued",
};

type Card = {
  readonly suit: Suit,
  readonly rank: Rank,
};

export default function useGame(): Game | null {
  const [model, setModel] = useLocalStorage<Model>("model", {
    status: "deal",
    deck: makeDeck(),
    cards: null,
    cardsHeldFlags: [false, false, false, false, false],
    pennies: INITIAL_PENNIES,
    betSize: INITIAL_BET_SIZE,
    betMultiplier: INITIAL_BET_MULTIPLIER,
    winnings: null,
    winningCardFlags: [false, false, false, false, false],
    winningHandHint: null,
    creditLines: 0,
  });
  const { playSound } = useSoundPlayer();

  // Temporary hack to ensure that the model loaded from localStorage has new
  // model values. This should be replaced with Zod validation.
  useEffect(() => {
    const validatedModel: any = model;
    if (typeof validatedModel.creditLines !== "number") {
      validatedModel.creditLines = 0;
    }
    if (typeof validatedModel.betSize !== "number") {
      validatedModel.betSize = INITIAL_BET_SIZE;
    }
    setModel({
      ...validatedModel,
    });
  // Only run on first render instead of every time model changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent hydration error on first run (server doesn't have localStorage so
  // the client and server have different values for model on first run).
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    setFirstRun(false);
  }, []);

  if (firstRun) {
    return null;
  }

  return {
    model,
    clearAlert: () => clearAlert(model, setModel),
    setBetSize: (betSize: BetSize) => setBetSize(betSize, model, setModel),
    setBetMultiplier: (betMultipler: BetMultiplier) => setBetMultiplier(betMultipler, model, setModel),
    deal: (model: DealModel) => deal(model, setModel, playSound, false),
    maxBet: (model: DealModel) => deal(model, setModel, playSound, true),
    toggleHold: (cardIndex: number, model: DrawModel) => toggleHold(cardIndex, model, setModel),
    allCardsHeld: (model: DrawModel) => allCardsHeld(model),
    draw: (model: DrawModel) => draw(model, setModel, playSound),
  } as const;
}

function makeDeck(): readonly Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranksHighAce) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function clearAlert(model: Model, setModel: Dispatch<SetStateAction<Model>>) {
  setModel({
    ...model,
    alert: undefined,
  });
}

function setBetSize(betSize: BetSize, model: Model, setModel: Dispatch<SetStateAction<Model>>) {
  setModel({
    ...model,
    betSize,
  });
}

function setBetMultiplier(betMultiplier: BetMultiplier, model: Model, setModel: Dispatch<SetStateAction<Model>>) {
  setModel({
    ...model,
    betMultiplier,
  });
}

function deal(
  model: DealModel,
  setModel: Dispatch<SetStateAction<Model>>,
  playSound: ReturnType<typeof useSoundPlayer>["playSound"],
  maxBet: boolean,
) {
  const betMultiplier = maxBet ? MAX_BET_MULTIPLIER : model.betMultiplier;
  const costPennies = model.betSize * betMultiplier;
  if (costPennies > model.pennies) {
    setModel({
      ...model,
      // Update betMultipler in case player pressed max bet.
      betMultiplier,
      alert: "notEnoughCredits",
    });
    playAlertBeep(playSound);
    return "notEnoughCredits";
  }
  const pennies = model.pennies - costPennies;
  const deck = model.deck.slice();
  if (model.cards) {
    deck.push(...model.cards);
  }
  shuffle(deck);
  const cards = deck.splice(0, 5);
  const winningHandHint = calculateWinningHandInfo(cards)?.hand ?? null;
  if (winningHandHint) {
    window.setTimeout(() => playSound("hint"), 350);
  }
  setModel({
    ...model,
    status: "draw",
    betMultiplier,
    pennies,
    deck,
    cards,
    cardsHeldFlags: [false, false, false, false, false],
    winnings: null,
    winningCardFlags: null,
    winningHandHint,
  });
  return "success";
}

function shuffle(deck: Card[]) {
  // Durstenfeld shuffle (an optimized version of Fisher-Yates).
  // https://stackoverflow.com/a/12646864/4704976
  for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
  }
}

function toggleHold(cardIndex: number, model: DrawModel, setModel: Dispatch<SetStateAction<Model>>) {
  const cardsHeldFlags = [...model.cardsHeldFlags];
  cardsHeldFlags[cardIndex] = !cardsHeldFlags[cardIndex];
  setModel({
    ...model,
    cardsHeldFlags,
  });
}

function allCardsHeld(model: DrawModel) {
  const numCardsHeld = model.cardsHeldFlags.filter((f) => f).length;
  return numCardsHeld === model.cards.length;
}

function draw(
  model: DrawModel,
  setModel: Dispatch<SetStateAction<Model>>,
  playSound: ReturnType<typeof useSoundPlayer>["playSound"],
) {
  const deck = [...model.deck];
  const cards = [...model.cards];
  for (let i = 0; i < cards.length; i++) {
    if (!model.cardsHeldFlags[i]) {
      deck.push(cards[i]);
      cards[i] = deck.shift()!;
    }
  }
  const winningHandInfo = calculateWinningHandInfo(cards);
  let winnings: Winnings | null;
  let winningCardFlags: readonly boolean[];
  let pennies = model.pennies;
  let creditLines = model.creditLines;
  let creditLineIssued = false;
  if (winningHandInfo) {
    winnings = {
      hand: winningHandInfo.hand,
      quantity: payTable[winningHandInfo.hand][model.betMultiplier - 1],
    };
    winningCardFlags = cards.map((c) => winningHandInfo.cards.includes(c));
    window.setTimeout(() => playSound("win"), 200);
    pennies += winnings.quantity * model.betSize;
  } else {
    winnings = null;
    winningCardFlags = [false, false, false, false, false];
    if (pennies === 0) {
      pennies = INITIAL_PENNIES;
      creditLines++;
      creditLineIssued = true;
      playAlertBeep(playSound);
    }
  }
  setModel({
    ...model,
    status: "deal",
    deck,
    cards,
    winnings,
    winningCardFlags,
    pennies,
    creditLines,
    winningHandHint: null,
    alert: creditLineIssued ? "creditLineIssued" : undefined,
  });
}

function playAlertBeep(playSound: ReturnType<typeof useSoundPlayer>["playSound"]): void {
  window.setTimeout(() => playSound("beep"), 250);
}

type WinningHandInfo = {
  readonly hand: WinningHand,
  readonly cards: readonly Card[],
};

function calculateWinningHandInfo(cards: readonly Card[]): WinningHandInfo | null {
  if (isFlush(cards)) {
    if (isStraight(cards)) {
      if (cards.find((c) => c.rank === "A")) {
        return { hand: "royalFlush", cards };
      }
      return { hand: "straightFlush", cards };
    }
    return { hand: "flush", cards };
  }
  let winningCards: readonly Card[] | null;
  winningCards = findFourOfAKind(cards);
  if (winningCards) {
    return { hand: "fourOfAKind", cards: winningCards };
  }
  if (isFullHouse(cards)) {
    return { hand: "fullHouse", cards };
  }
  if (isStraight(cards)) {
    return { hand: "straight", cards };
  }
  winningCards = findThreeOfAKind(cards);
  if (winningCards) {
    return { hand: "threeOfAKind", cards: winningCards };
  }
  winningCards = findTwoPair(cards);
  if (winningCards) {
    return { hand: "twoPair", cards: winningCards };
  }
  winningCards = findJacksOrBetter(cards);
  if (winningCards) {
    return { hand: "jacksOrBetter", cards: winningCards };
  }
  return null;
}

function isFlush(cards: readonly Card[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].suit !== cards[0].suit) {
      return false;
    }
  }
  return true;
}

function isStraight(cards: readonly Card[]): boolean {
  return isStraightByRanks(cards, ranksHighAce) || isStraightByRanks(cards, ranksLowAce);
}

function isStraightByRanks(cards: readonly Card[], ranks: typeof ranksHighAce | typeof ranksLowAce): boolean {
  const sortedCards = [...cards].sort(
    (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank)
  );
  for (let i = 1; i < sortedCards.length; i++) {
    if (ranks.indexOf(sortedCards[i].rank) - ranks.indexOf(sortedCards[i - 1].rank) !== 1) {
      return false;
    }
  }
  return true;
}

function findFourOfAKind(cards: readonly Card[]): readonly Card[] | null {
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 4) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}

function isFullHouse(cards: readonly Card[]): boolean {
  // This implementation assumes that better hands have been ruled out.
  const set = new Set<Rank>();
  for (const card of cards) {
    set.add(card.rank);
  }
  return set.size === 2;
}

function findThreeOfAKind(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 3) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}

function findTwoPair(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const map = new Map<Rank, Card[]>();
  for (const card of cards) {
    const cardsOfRank = map.get(card.rank) ?? [];
    cardsOfRank.push(card);
    map.set(card.rank, cardsOfRank);
  }
  if (map.size === 3) {
    return [...map.values()]
      .filter((cardsOfRank) => cardsOfRank.length !== 1)
      .flat();
  }
  return null;
}

function findJacksOrBetter(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const jackIndex = ranksHighAce.indexOf("J");
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 2 && ranksHighAce.indexOf(card.rank) >= jackIndex) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}
