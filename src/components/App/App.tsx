import { useState } from 'react';

import Header from '../Header/Header'
import Dartboard from '../Dartboard/Dartboard'
import Footer from '../Footer/Footer'
import Dialog from '../Dialog/Dialog';
import Button from '../Button/Button';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const onCloseDialog = () => setIsDialogOpen(!isDialogOpen);
  return (
    <div className='lock-screen bg-gray-700'>
      {isDialogOpen && (
        <Dialog
          title="Welcome To Your Darts Checkout Trainer"
          disableClickAway
        >
          <p className='mb-4 px-10'>
            Practice your checkout routes by clicking on the dartboard.
            Click on the cog in the top right to customise your practice.
            Click the start button at the top when you're ready!
          </p>
          <Button onClick={() => onCloseDialog()} text='Got it!' />
        </Dialog>
      )}
      <Header />
      <Dartboard />
      <Footer />
    </div>
  )
}

export default App
