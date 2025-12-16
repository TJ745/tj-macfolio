"use client";

import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import React, { useEffect, useState } from "react";

interface BtnProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const Btn = ({ label, onClick, className = "" }: BtnProps) => (
  <button
    onClick={onClick}
    className={`h-12 rounded-xl text-lg font-medium active:scale-95 transition ${className}`}
  >
    {label}
  </button>
);

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  /* ---------------- Logic ---------------- */

  const input = (n: string) => {
    setDisplay((d) => (d === "0" || reset ? n : d + n));
    setReset(false);
  };

  const dot = () => {
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setReset(false);
  };

  const setOperator = (o: string) => {
    if (prev !== null && op) calculate();
    setPrev(Number(display));
    setOp(o);
    setReset(true);
  };

  const calculate = () => {
    if (prev === null || !op) return;
    const cur = Number(display);
    let result = 0;

    switch (op) {
      case "+":
        result = prev + cur;
        break;
      case "-":
        result = prev - cur;
        break;
      case "×":
        result = prev * cur;
        break;
      case "÷":
        if (cur === 0) return setDisplay("Error");
        result = prev / cur;
        break;
    }

    setHistory((h) => [`${prev} ${op} ${cur} = ${result}`, ...h]);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setReset(true);
  };

  /* ---------------- Scientific ---------------- */

  const sci = (type: string) => {
    const v = Number(display);
    let r = v;

    switch (type) {
      case "sin":
        r = Math.sin(v);
        break;
      case "cos":
        r = Math.cos(v);
        break;
      case "tan":
        r = Math.tan(v);
        break;
      case "√":
        r = Math.sqrt(v);
        break;
      case "x²":
        r = v * v;
        break;
      case "log":
        r = Math.log10(v);
        break;
    }

    setHistory((h) => [`${type}(${v}) = ${r}`, ...h]);
    setDisplay(String(r));
    setReset(true);
  };

  /* ---------------- Keyboard ---------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/\d/.test(e.key)) input(e.key);
      if (e.key === ".") dot();
      if (e.key === "Enter") calculate();
      if (e.key === "Backspace") clear();
      if (["+", "-"].includes(e.key)) setOperator(e.key);
      if (e.key === "*") setOperator("×");
      if (e.key === "/") setOperator("÷");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [display, prev, op]);

  /* ---------------- UI ---------------- */

  return (
    <>
      <div id="window-header">
        <WindowControls target="calculator" />
      </div>
      <div className="flex h-full">
        {/* Calculator */}
        <div className="flex-1 flex flex-col bg-neutral-900 text-white rounded-b-xl">
          <div className="px-4 py-3 text-right text-4xl truncate">
            {display}
          </div>

          <div className="px-4 pb-3 flex justify-between text-sm text-white/60">
            <span>⌨ Keyboard Enabled</span>
            <button onClick={() => setScientific(!scientific)}>
              {scientific ? "Basic" : "Scientific"}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            <Btn label="C" onClick={clear} className="bg-gray-600 col-span-2" />
            <Btn
              label="÷"
              onClick={() => setOperator("÷")}
              className="bg-orange-500"
            />
            <Btn
              label="×"
              onClick={() => setOperator("×")}
              className="bg-orange-500"
            />

            {["7", "8", "9"].map((n) => (
              <Btn
                key={n}
                label={n}
                onClick={() => input(n)}
                className="bg-gray-700"
              />
            ))}
            <Btn
              label="-"
              onClick={() => setOperator("-")}
              className="bg-orange-500"
            />

            {["4", "5", "6"].map((n) => (
              <Btn
                key={n}
                label={n}
                onClick={() => input(n)}
                className="bg-gray-700"
              />
            ))}
            <Btn
              label="+"
              onClick={() => setOperator("+")}
              className="bg-orange-500"
            />

            {["1", "2", "3"].map((n) => (
              <Btn
                key={n}
                label={n}
                onClick={() => input(n)}
                className="bg-gray-700"
              />
            ))}

            <Btn
              label="="
              onClick={calculate}
              className="bg-orange-500 row-span-2"
            />

            <Btn
              label="0"
              onClick={() => input("0")}
              className="bg-gray-700 col-span-2"
            />
            <Btn label="." onClick={dot} className="bg-gray-700" />
          </div>

          {scientific && (
            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              {["sin", "cos", "tan", "√", "x²", "log"].map((f) => (
                <Btn
                  key={f}
                  label={f}
                  onClick={() => sci(f)}
                  className="bg-slate-700 text-sm"
                />
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="w-56 bg-black/40 border-l border-white/10 p-3 text-sm overflow-y-auto text-white">
          <p className="text-white/60 mb-2">History</p>
          {history.length === 0 && (
            <p className="text-white/30">No calculations</p>
          )}
          {history.map((h, i) => (
            <div key={i} className="mb-1 text-white/80">
              {h}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const CalculatorWindow = WindowWrapper(Calculator, "calculator");

export default CalculatorWindow;
