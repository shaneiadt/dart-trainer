import '../Dartboard/dartbot-dartboard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSectorValue } from '../Dartboard/draw-board/board'
import { PolarPoint } from '../Dartboard/utils'
import { CHECKOUTS, CheckoutsType } from '../../constants'
import { random } from 'lodash'
import Darts from '../Darts/Darts'
import { useSpeech } from '../../hooks'
import { Dartboard } from '../Dartboard/Dartboard'
import Header from '../Header/Header'

let isListenersAttached = false;
const checkoutKeys = Object.keys(CHECKOUTS).map((n: keyof CheckoutsType) => n);
const firstKey = Number(checkoutKeys[0]);
const lastKey = Number(checkoutKeys[checkoutKeys.length - 1]);

function App() {
  const ref = useRef<Dartboard>(null)
  const { sayCheckoutRequirement } = useSpeech();
  const [minCheckoutValue, setCheckoutMinValue] = useState(firstKey);
  const [maxCheckoutValue, setCheckoutMaxValue] = useState(lastKey);
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

    sayCheckoutRequirement(rand)
    setCheckout(rand);
    console.log({ checkout: rand }, JSON.stringify(CHECKOUTS[rand]));
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
      <Header
        checkout={checkout}
        minCheckoutValue={minCheckoutValue}
        maxCheckoutValue={maxCheckoutValue}
        calculateCheckout={calculateCheckout}
        setCheckoutMinValue={setCheckoutMinValue}
        setCheckoutMaxValue={setCheckoutMaxValue} />
      <section className='dartboard'>
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
