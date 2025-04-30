import { getDartsRemaining } from "../../features/checkoutTrainer/selectors";
import { useAppSelector } from "../../store";
import Dart from "../Dart/Dart";


const Darts = () => {
    const dartsRemaining = useAppSelector(getDartsRemaining);

    return (
        <>
            <Dart disabled={dartsRemaining <= 2} />
            <Dart disabled={dartsRemaining <= 1} />
            <Dart disabled={dartsRemaining == 0} />
        </>
    )
}

export default Darts;