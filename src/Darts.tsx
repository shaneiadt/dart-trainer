import Dart from "./Dart";

export interface DartsProps {
    dartsRemaining: number;
}

const Darts = ({ dartsRemaining }: DartsProps) => {
    return (
        <div className='darts'>
            <Dart disabled={dartsRemaining <= 2} />
            <Dart disabled={dartsRemaining <= 1} />
            <Dart disabled={dartsRemaining == 0} />
        </div>
    )
}

export default Darts;