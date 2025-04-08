import '../Dartboard/dartbot-dartboard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSectorValue } from '../Dartboard/draw-board/board'
import { PolarPoint } from '../Dartboard/utils'
import { BOARD_VALUES, CHECKOUTS, CheckoutsType, SectorNumbers } from '../../constants'
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
  const [selectedCheckoutPath, setSelectedCheckoutPath] = useState<(keyof typeof BOARD_VALUES)[]>([]);

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
    setSelectedCheckoutPath([])
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
      setSelectedCheckoutPath((prevState) => [...prevState, 'DB']);
      return
    }
    if (detail.ring === 1) {
      setSelectedCheckoutPath((prevState) => [...prevState, 'SB']);
      return
    }

    const multiplier = getMultiplier(detail.ring);
    const val = getSectorValue(board, detail.sector);
    const boardKey = getBoardKey(val as SectorNumbers, multiplier)

    setSelectedCheckoutPath((prevState) => [...prevState, boardKey]);
  }, []);

  console.log({ selectedCheckoutPath });

  const getBoardKey = (val: SectorNumbers, multiplier: number): keyof typeof BOARD_VALUES => {
    let sym: keyof typeof BOARD_VALUES = `S${val}`;

    if (multiplier === 3) {
      sym = `T${val}`;
    } else if (multiplier === 2) {
      sym = `D${val}`
    }

    console.log(sym);

    return sym
  }

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
      {/* TODO: DIALOG FOR SETTING */}
      {/* <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100%' }}>
        <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <dialog open>
            <button>Close</button>
            <p>This modal dialog has a groovy backdrop!</p>
          </dialog>
        </div>
      </div> */}
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
