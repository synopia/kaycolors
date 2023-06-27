import "./App.css";

import React, { useCallback, useEffect, useState } from "react";

import kayBlue from "./kay-blue.png";
import kayRed from "./kay-red.png";
import kayGreen from "./kay-green.png";
import * as _ from 'underscore'
type KayColor = "blue" | "red" | "green";
const KayColors: [KayColor, KayColor, KayColor] = ["blue", "red", "green"];

function checkColor(shown: KayColor, selected: KayColor) {
  switch (shown) {
    case "red":
      return selected === "blue";
    case "blue":
      return selected === "green";
    case "green":
      return selected === "red";
  }
}

interface KaySymbolProps {
  type: KayColor;
  size: number;
  onClick?: () => void;
}

function KaySymbol(props: KaySymbolProps) {
  const { type, size, onClick } = props;
  let image: string = kayBlue;
  switch (type) {
    case "blue":
      image = kayBlue;
      break;
    case "green":
      image = kayGreen;
      break;
    case "red":
      image = kayRed;
      break;
  }
  return (
    <img
      src={image} alt="shown" height={128 * size} width={128 * size}
      onClick={onClick}
    />);
}

function App() {
  const [colors, setColors] = useState(_.shuffle(KayColors));
  const [shown, setShown] = useState<KayColor>("red");
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(0);

  const randomize = useCallback(()=>{
    const idx = Math.floor(Math.random() * 3);
    setShown(KayColors[idx]);
    setColors(_.shuffle(KayColors));
  }, [setShown, setColors]);

  useEffect(() => {
    randomize();
  }, [setShown, setColors, randomize]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={()=>{
            setCount(0)
            setSuccess(0)
            randomize()
          }}>Reset</button>
        </div>
        <div>

          Correct: {success} &nbsp;
          Total: {count} &nbsp;
          Rate: {count!==0 ? Math.round(100*success/count): 0}%
        </div>
        <div>
          <KaySymbol type={shown} size={2} />
        </div>
        <div>
          {colors.map((color: KayColor) => {
            return <KaySymbol key={color} type={color} size={1} onClick={() => {
              setCount(count + 1);
              if (checkColor(shown, color)) {
                setSuccess(success + 1);
              }
              randomize()
            }} />;
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
