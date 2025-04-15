import Darts from '../Darts/Darts'
import Header from '../Header/Header'
import Dartboard from '../Dartboard/Dartboard'

function App() {
  return (
    <>
      <Header />
      <section className='dartboard'>
        <Dartboard />
      </section>
      <footer>
        <div className='darts'>
          <Darts />
        </div>
      </footer>
    </>
  )
}

export default App
