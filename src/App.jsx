import { useState } from "react"
import Home from "./Pages/Home"
import ProfilePage from "./Pages/ProfilePage"
import { Route, Routes } from "react-router-dom"

function App() {
  const [navigateTo, setNavigateTo] = useState('/login')

  return (
    <>
      <div className='w-full h-23 bg-stone-700 border-b-8 border-amber-600 shadow-2xl flex justify-between p-2.5 items-center'>
        <img/>
        <div className="h-full flex items-center pr-3">
          <img className="w-10 invert cursor-pointer transition-all duration-150 hover:scale-110" src='/Icons/user.png'/>
        </div>
      </div>

      <div className="w-screen h-[calc(100vh-92px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>

        <footer className="w-screen h-23 bg-stone-700 border-amber-600 border-t-8 shadow-2xl p-8 flex justify-between text-white unbounded">
          <div className="overflow-y-hidden">
            map
          </div>
          <div className="overflow-hidden">
            ©FitMate
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
