import '../Dartboard/dartbot-dartboard'
import { useCallback, useEffect, useRef } from 'react'
import { getSectorValue } from '../Dartboard/draw-board/board'
import { getBoardKey, getMultiplier, PolarPoint } from '../Dartboard/utils'
import { BOARD_VALUES, BoardKey, SectorNumbers } from '../../constants'
import Darts from '../Darts/Darts'
import { Dartboard } from '../Dartboard/Dartboard'
import Header from '../Header/Header'
import { useAppDispatch, useAppSelector } from '../../store'
import { addHit } from '../../features/hits/hitsSlice'
import { addPath } from '../../features/checkout/checkoutSlice'
import { getHits, getIsDartboardDisabled } from '../../features/hits/selectors'

let isListenersAttached = false;

function App() {
  const ref = useRef<Dartboard>(null)
  const dispatch = useAppDispatch()

  const hits = useAppSelector(getHits)
  const isDartBoardDisabled = useAppSelector(getIsDartboardDisabled);

  const registerPath = useCallback((point: PolarPoint, key: BoardKey, value: number) => {
    dispatch(addPath(key))
    dispatch(addHit({ point, key, value }));
  }, [dispatch])

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

    dartboard.hits = [...dartboard.hits, detail.polar];

    if (detail.ring === 0) {
      registerPath(detail.polar, 'DB', BOARD_VALUES.DB)
      return
    }
    if (detail.ring === 1) {
      registerPath(detail.polar, 'SB', BOARD_VALUES.SB)
      return
    }

    const multiplier = getMultiplier(detail.ring);
    const value = getSectorValue(board, detail.sector);
    const key = getBoardKey(value as SectorNumbers, multiplier)

    registerPath(detail.polar, key, value * multiplier)
  }, [registerPath]);

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

  return (
    <>
      <Header />
      <section className='dartboard'>
        <dartbot-dartboard ref={ref} validate-hits={String(true)} disabled={isDartBoardDisabled}></dartbot-dartboard>
      </section>
      <footer>
        <div className='darts'>
          <Darts dartsRemaining={3 - hits.length} />
        </div>
      </footer>
    </>
  )
}

export default App
