/* eslint-disable @typescript-eslint/no-namespace */
import './dartbot-dartboard'
import './App.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Board, getSectorValue } from './draw-board/board'
import { PolarPoint } from './utils'
import { CHECKOUTS, CheckoutsType } from './constants'
import { random } from 'lodash'
import Darts from './Darts'

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
  const [dartsRemaining, setDartsRemaining] = useState(3);

  const isDartBoardDisabled = dartsRemaining === 0;

  const resetHits = () => {
    const dartboard = ref.current;
    const board = dartboard?.board;

    if (!board) {
      return
    }
    dartboard.hits = [];
  }

  const calculateCheckout = () => {
    const rand = random(firstKey, lastKey);
    setCheckout(rand);
    setShowCheckout(false);
    setDartsRemaining(3)
    resetHits()
  };


  const onDartboardClick = useCallback((e: Event) => {
    const dartboard = ref.current;
    const board = dartboard?.board;

    if (!board) {
      return
    }

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

    setDartsRemaining((prevState) => prevState - 1)

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
  }, []);

  useEffect(() => {
    if (ref) {
      const dartboard = ref.current;
      const board = dartboard?.board;

      if (!board) {
        return
      }

      if (!isListenersAttached) {
        isListenersAttached = true;
        dartboard.addEventListener('dartboard-click', onDartboardClick)
      }
    }
  }, [onDartboardClick])

  const getMultiplier = (ring: number) => {
    if (ring === 3) {
      return 3;
    }
    if (ring === 5) {
      return 2;
    }

    return 1;
  }

  return (
    <>
      <h2>Checkout: {checkout}</h2>
      <Darts dartsRemaining={dartsRemaining} />
      <div style={{ height: '800px', width: '800px' }}>
        <dartbot-dartboard ref={ref} validate-hits={String(true)} disabled={isDartBoardDisabled}></dartbot-dartboard>
      </div>
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
