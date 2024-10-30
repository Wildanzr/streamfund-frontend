import React, { useEffect } from "react";
import useSound from "use-sound";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SoundProps {
  name: string;
  value: string;
  src: string;
  selected: string;
  handleChange: (value: string) => void;
}

const Sound = ({ handleChange, name, src, value, selected }: SoundProps) => {
  const [play, { stop }] = useSound(src);

  const handlePlay = () => {
    play();
    handleChange(value);
  };

  useEffect(() => {
    if (selected !== value) {
      stop();
    }
  }, [selected, stop, value]);

  return (
    <Button
      onClick={handlePlay}
      variant="default"
      type="button"
      className={`${cn(
        selected === value
          ? "border-2 border-aqua"
          : "border-2 border-transparent"
      )}`}
    >
      {name}
    </Button>
  );
};

export default Sound;
