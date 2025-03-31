import { useState } from "react";
import "./App.css";
import { random } from "lodash";

type CheckoutsType = Record<string, string[]>;

const checkouts: CheckoutsType = {
  "41": ["9", "D16"],
  "42": ["10", "D16"],
  "43": ["3", "D20"],
  "44": ["4", "D20"],
  "45": ["13", "D16"],
  "46": ["6", "D20"],
  "47": ["7", "D20"],
  "48": ["16", "D16"],
  "49": ["17", "D16"],
  "50": ["18", "D16"],
  "51": ["19", "D16"],
  "52": ["20", "D16"],
  "53": ["13", "D20"],
  "54": ["14", "D20"],
  "55": ["15", "D20"],
  "56": ["16", "D20"],
  "57": ["17", "D20"],
  "58": ["18", "D20"],
  "59": ["19", "D20"],
  "60": ["20", "D20"],
};
const checkoutKeys = Object.keys(checkouts).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

function App() {
  const [minCheckoutValue, setCheckoutMinValue] = useState(firstKey);
  const [maxCheckoutValue, setCheckoutMaxValue] = useState(lastKey);

  const [showCheckout, setShowCheckout] = useState(false);
  const [checkout, setCheckout] = useState(firstKey);

  const calculateCheckout = () => {
    const rand = random(firstKey, lastKey);
    setCheckout(rand);
    setShowCheckout(false);
  };

  return (
    <>
      <h4>{checkout}</h4>
      <p>
        Min: {minCheckoutValue}
        <input
          onChange={(e) => {
            setCheckoutMinValue(Number(e.target.value));
            calculateCheckout();
          }}
          type="range"
          step="1"
          id="range"
          name="range"
          value={minCheckoutValue}
          min={firstKey}
          max={maxCheckoutValue - 1}
        />
        Max: {maxCheckoutValue}
        <input
          onChange={(e) => {
            setCheckoutMaxValue(Number(e.target.value));
            calculateCheckout();
          }}
          type="range"
          step="1"
          id="range"
          name="range"
          value={maxCheckoutValue}
          min={minCheckoutValue + 1}
          max={lastKey}
        />
      </p>
      {showCheckout && <p>Checkout: {JSON.stringify(checkouts[checkout])}</p>}
      <p>
        <button onClick={calculateCheckout}>Next Checkout</button>
        <button onClick={() => setShowCheckout(true)}>Show Checkout</button>
      </p>
    </>
  );
}

export default App;
