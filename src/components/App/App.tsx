/* eslint-disable @typescript-eslint/no-namespace */
import '../Dartboard/dartbot-dartboard'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Board, getSectorValue } from '../Dartboard/draw-board/board'
import { PolarPoint } from '../Dartboard/utils'
import { CHECKOUTS, CheckoutsType } from '../../constants'
import { random } from 'lodash'
import Darts from '../Darts/Darts'
import { useDebounce } from '../../hooks'

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
const synth = window.speechSynthesis;

function App() {
  const ref = useRef<DBoard | null>(null)
  const [minCheckoutValue, setCheckoutMinValue] = useState(firstKey);
  const [maxCheckoutValue, setCheckoutMaxValue] = useState(lastKey);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSliderError, setCheckoutSliderError] = useState<string | null>(null)
  const [checkout, setCheckout] = useState(random(firstKey, lastKey));
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
    const rand = random(minCheckoutValue, maxCheckoutValue);

    const utterThis = new SpeechSynthesisUtterance(`you require ${rand} `);

    utterThis.onend = function (event) {
      console.log({ event });
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.log({ event });
      console.error("SpeechSynthesisUtterance.onerror");
    };

    const voice = synth.getVoices().find((v) => v.name === 'Google UK English Male')
    const defaultVoice = synth.getVoices()[0]
    utterThis.voice = voice ?? defaultVoice;
    utterThis.pitch = 0;
    utterThis.rate = 1.1;
    synth.speak(utterThis);

    setCheckoutSliderError(null)
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

  const debouncedCheckoutCalulation = useDebounce(() => {
    if (minCheckoutValue >= maxCheckoutValue) {
      setCheckoutSliderError('Invalid Checkout Range')
    } else {
      calculateCheckout()
    }
  });

  const onMinRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckoutMinValue(Number(e.target.value))
    debouncedCheckoutCalulation()
  }

  const onMaxRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckoutMaxValue(Number(e.target.value))
    debouncedCheckoutCalulation()
  }

  return (
    <>
      <header>
        <div className='toolbar-primary'>
          <div className='range'>
            {minCheckoutValue}
            <input
              onChange={onMinRangeChange}
              type="range"
              step="1"
              id="range"
              name="range"
              value={minCheckoutValue}
              min={firstKey}
            /></div>
          <div className='checkout'>
            <h2>{checkout}</h2>
          </div>
          <div className='range'>
            {maxCheckoutValue}
            <input
              onChange={onMaxRangeChange}
              type="range"
              step="1"
              id="range"
              name="range"
              value={maxCheckoutValue}
              max={lastKey}
            />
          </div>
        </div>
        <div className='toolbar-secondary'>
          <div className='checkout-buttons'>
            <button onClick={calculateCheckout}>Next Checkout</button>
            <button onClick={() => setShowCheckout(true)}>Show Checkout</button>
          </div>
        </div>
      </header>
      <section className='dartboard'>
        {checkoutSliderError && <p>{checkoutSliderError}</p>}
        {showCheckout && <p>Checkout: {JSON.stringify(CHECKOUTS[checkout])}</p>}
        <dartbot-dartboard ref={ref} validate-hits={String(true)} disabled={isDartBoardDisabled}></dartbot-dartboard>
      </section>
      <footer>
        <div className='darts'>
          <Darts dartsRemaining={dartsRemaining} />
        </div>
      </footer>
    </>
  )
}

export default App
