/* eslint-disable @typescript-eslint/no-namespace */
import './dartbot-dartboard'
import './App.css'
import { useEffect, useRef } from 'react'
import { Board, getRandomPoint, getSectorIndex, getSectorValue, getTargetPoint } from './draw-board/board'
import { PolarPoint } from './utils'

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

function App() {
  const ref = useRef<DBoard | null>(null)

  // useEffect(() => {
  //   if (ref) {
  //     const dartboard = ref.current;
  //     const board = dartboard?.board;

  //     if (!board) {
  //       return
  //     }

  //     if (dartboard.hits.length === 0) {
  //       // t = setTimeout(() => {
  //       //   createRandomPoint()
  //       // }, 2000)

  //       // const sectorIndex = 12;
  //       // const ringIndex = 3;
  //       // const targetPoint = getTargetPoint(board, sectorIndex, ringIndex);
  //       // const randomPoint = getRandomPoint(board, 19, 5);

  //       // const polar = { angle: 0.5, radius: 50 };
  //       // const s = getSectorIndexFromPoint(board, randomPoint);
  //       // const r = getRingIndexFromPoint(board, randomPoint);
  //       // console.log(`Point (${randomPoint.angle},${randomPoint.radius}) lies within sector ${s} and ring ${r}`);

  //       // const val = getSectorValue(board, sectorIndex);
  //       // const idx = getSectorIndex(board, sectorIndex);
  //       // console.log(`Sector ${sectorIndex} has a value of ${val}`);
  //       // console.log(`Sector with value ${val} has a value of ${idx}`);

  //       // const detail = dartboard.translatePoint(x, y);
  //       // const { point, polar, sector, ring } = detail;
  //       // console.log({ point, sector, ring });
  //       // dartboard.hits = [...dartboard.hits, targetPoint];

  //       // dartboard.addEventListener('dartboard-click', () => {
  //       //   console.log('BOOM TUNE!!!');
  //       // })
  //     }

  //   }
  // }, []);

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
      <dartbot-dartboard ref={ref}></dartbot-dartboard>
    </>
  )
}

export default App
