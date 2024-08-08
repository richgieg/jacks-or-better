import { Howl } from "howler";
import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

const volumes = ["off", "low", "medium", "high"] as const;

type Volume = typeof volumes[number];

const volumeMap: { [V in typeof volumes[number]]: number } = {
  off: 0,
  low: 0.2,
  medium: 0.5,
  high: 1,
};

const sounds = {
  beep: "/sounds/beep.mp3",
  click: "/sounds/click.wav",
  hint: "/sounds/hint.mp3",
  shuffle: "/sounds/shuffle.mp3",
  win: "/sounds/win.mp3",
} as const;

// Preload audio files.
for(const src of Object.values(sounds)) {
  new Howl({ src });
}

export default function useSoundPlayer() {
  const [volumeIndex, setVolumeIndex] = useLocalStorage("volumeIndex", volumes.indexOf("high"));

  const playSound = useCallback((soundKey: keyof typeof sounds, volumeOverride?: Volume) => {
    const sound = new Howl({ src: sounds[soundKey] });
    sound.volume(volumeOverride ? volumeMap[volumeOverride] : volumeMap[volumes[volumeIndex]]);
    sound.play();
  }, [volumeIndex]);

  const changeToNextVolume = useCallback(() => {
    const newVolumeIndex = (volumeIndex + 1) % volumes.length;
    setVolumeIndex(newVolumeIndex);
    return volumes[newVolumeIndex];
  }, [volumeIndex, setVolumeIndex]);

  return {
    volume: volumes[volumeIndex],
    changeToNextVolume,
    playSound,
  } as const;
}
