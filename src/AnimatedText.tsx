import { useState, useEffect } from "react";

interface AnimatedTextProps {
    text: string;
    interval?: number;
}

const AnimatedText = ({ text, interval = 500 }: AnimatedTextProps) => {
  const [animatedText, setAnimatedText] = useState<string[]>([]);

  useEffect(() => {
    const textArray = text.split('');

    let currentIndex = 0;

    const timer = setInterval(() => {
      const nextIndex = currentIndex + 1;
      const nextText = textArray.slice(0, nextIndex);

      setAnimatedText(nextText);
      currentIndex = nextIndex;

      if (currentIndex === textArray.length) {
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [text]);

  return (
    <ul style={{ display: 'flex', flexDirection: 'row', listStyleType: 'none'}}>
      {animatedText.map((letter, i) => (
        <li key={i} style={{ margin: 5 }}>{letter}</li>
      ))}
    </ul>
  );
};

export default AnimatedText;
