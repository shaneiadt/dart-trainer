import Header from "../Header/Header";
import Dartboard from "../Dartboard/Dartboard";
import Footer from "../Footer/Footer";
import { WelcomeDialog } from "../WelcomeDialog/WelcomeDialog";

function App() {
  return (
    <div className="lock-screen bg-gray-700">
      <WelcomeDialog />
      <Header />
      <Dartboard />
      <Footer />
    </div>
  );
}

export default App;
