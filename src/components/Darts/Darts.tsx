import Dart from "../Dart/Dart";

export interface DartsProps {
    dartsRemaining: number;
}

const Darts = ({ dartsRemaining }: DartsProps) => {
    return (
        <>
            <Dart disabled={dartsRemaining <= 2} />
            <Dart disabled={dartsRemaining <= 1} />
            <Dart disabled={dartsRemaining == 0} />
        </>
    )
}

export default Darts;