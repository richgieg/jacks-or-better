import { useEffect, useState } from "react";
import GameScreen from "@/components/GameScreen";
import useGame from "@/hooks/useGame";
import BetSizeScreen from "@/components/BetSizeScreen";
import BetMultiplierScreen from "@/components/BetMultiplierScreen";
import MenuScreen from "@/components/MenuScreen";
import { useDarkMode } from "usehooks-ts";
import PayTableScreen from "@/components/PayTableScreen";
import ContactScreen from "@/components/ContactScreen";

export type Screen = "game" | "betSize" | "betMultiplier" | "menu" | "payTable" | "contact";

export default function Home() {
  const { isDarkMode } = useDarkMode();
  const game = useGame();
  const [screen, setScreen] = useState<Screen>("game");
  const [introModalShown, setIntroModalShown] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (game) {
    switch (screen) {
      case "game":
        return (
          <GameScreen
            game={game}
            introModalShown={introModalShown}
            setIntroModalShown={setIntroModalShown}
            setScreen={setScreen}
          />
        );
      case "betMultiplier":
        return (
          <BetMultiplierScreen game={game} setScreen={setScreen} />
        );
      case "betSize":
        return (
          <BetSizeScreen game={game} setScreen={setScreen} />
        );
      case "menu":
        return (
          <MenuScreen setScreen={setScreen} />
        );
      case "payTable":
        return (
          <PayTableScreen setScreen={setScreen} />
        );
      case "contact":
        return (
          <ContactScreen setScreen={setScreen} />
        );
    }
  }
}
