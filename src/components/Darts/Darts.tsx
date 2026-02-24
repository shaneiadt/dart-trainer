import { getDartsRemaining } from "../../features/checkoutTrainer/selectors";
import { useAppSelector } from "../../store";
import Dart from "../Dart/Dart";

const Darts = () => {
  const dartsRemaining = useAppSelector(getDartsRemaining);

  if (dartsRemaining === 0) {
    return <span className="h-8 content-end">No Darts Remaining</span>;
  }

  return (
    <>
      <Dart disabled={dartsRemaining <= 2} />
      <Dart disabled={dartsRemaining <= 1} />
      <Dart disabled={dartsRemaining == 0} />
    </>
  );
};

export default Darts;
