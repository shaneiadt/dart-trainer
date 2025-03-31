/* eslint-disable @typescript-eslint/no-namespace */
import './dartbot-dartboard'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Board, getRandomPoint, getSectorValue } from './draw-board/board'
import { PolarPoint } from './utils'
import { CHECKOUTS, CheckoutsType } from './constants/checkouts'
import { random } from 'lodash'

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'dartbot-dartboard': unknown
    }
  }
}

interface DBoard extends HTMLElement {
  board: Board
  hits: PolarPoint[]
}

let isListenersAttached = false;
const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

function App() {
  const ref = useRef<DBoard | null>(null)
    const [minCheckoutValue, setCheckoutMinValue] = useState(firstKey);
    const [maxCheckoutValue, setCheckoutMaxValue] = useState(lastKey);
  
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkout, setCheckout] = useState(firstKey);
  
    const calculateCheckout = () => {
      const rand = random(firstKey, lastKey);
      setCheckout(rand);
      setShowCheckout(false);
    };

  useEffect(() => {
    if (ref) {
      const dartboard = ref.current;
      const board = dartboard?.board;

      if (!board) {
        return
      }

      if (!isListenersAttached) {
        isListenersAttached = true;
        dartboard.addEventListener('dartboard-click', (e) => {
          const { detail } = e as CustomEvent<{
            event: Event;
            point: {
              x: number;
              y: number;
            };
            polar: PolarPoint;
            sector: number;
            ring: number;
          }>
          console.log({ detail });

          dartboard.hits = [...dartboard.hits, detail.polar];
          if (detail.ring === 0) {
            console.log('BULL HIT');
            return
          }
          if (detail.ring === 1) {
            console.log('SINGLE BULL HIT');
            return
          }

          const multiplier = getMultiplier(detail.ring);

          console.log(`MULTIPLIER: ${multiplier}`);

          const val = getSectorValue(board, detail.sector);
          console.log(`VALUE: ${val}*${multiplier} = ${val * multiplier}`);

          dartboard.hits = [...dartboard.hits, detail.polar];
        })
      }
    }
  }, [])

  const getMultiplier = (ring: number) => {
    if (ring === 3) {
      return 3;
    }
    if (ring === 5) {
      return 2;
    }

    return 1;
  }

  const createRandomPoint = () => {
    const dartboard = ref.current;
    const board = dartboard?.board;


    if (!board) {
      return
    }

    const randomPoint = getRandomPoint(board, 5, 3, () => 0.9);
    dartboard.hits = [...dartboard.hits, randomPoint];
  }

  return (
    <>
      <button onClick={createRandomPoint}>Random Point</button>
      <div style={{ height: '800px', width: '800px' }}>
        <dartbot-dartboard ref={ref}></dartbot-dartboard>
      </div>
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
      {showCheckout && <p>Checkout: {JSON.stringify(CHECKOUTS[checkout])}</p>}
      <p>
        <button onClick={calculateCheckout}>Next Checkout</button>
        <button onClick={() => setShowCheckout(true)}>Show Checkout</button>
      </p>
    </>
  )
}

export default App
