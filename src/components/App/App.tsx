import Darts from '../Darts/Darts'
import Header from '../Header/Header'
import Dartboard from '../Dartboard/Dartboard'

function App() {
  return (
    <>
      <Header />
      <section className='sm:pt-20 md:pt-[100px]'>
        <Dartboard />
      </section>
      <footer className='fixed w-full flex items-center justify-evenly content-center bottom-0'>
        <div className='bg-green-950 flex px-[15px] py-[5px] rounded-[20px_20px_0px_0px]'>
          <Darts />
        </div>
      </footer>
    </>
  )
}

export default App
