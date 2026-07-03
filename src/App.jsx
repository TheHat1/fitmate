import { useEffect, useRef, useState } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import supabase from "./Backend/supabase"
import Home from "./Pages/Home"
import ProfilePage from "./Pages/ProfilePage"
import ProfileForm from "./Components/ProfileForm"
import MapPage from "./Pages/MapPage"
import RouteCheck from "./Components/RouteCheck"

function App() {
  const [showForm, setShowForm] = useState([false, false])
  //[boolean for opening the form, boolean for determining the forms type (login/signup)]
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const address = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    checkUserStatus()
    if (address.pathname == "/#") {
      setShowForm([true,false])
    }
  }, [address])

  async function checkUserStatus(){
    const {data, error} = await supabase.auth.getSession()

    if(data.session == null){
      setIsLoggedIn(false)
    }
    else setIsLoggedIn(true)
  }

  useEffect(()=>{
    checkUserStatus()
  },[showForm])

  return (
    <>

      <ProfileForm open={showForm[0]} isSignup={showForm[1]} setShowForm={setShowForm} />

      <div className='w-full h-23 bg-stone-700 border-b-8 border-amber-600 shadow-2xl flex justify-between p-2.5 items-center'>
        <img />
        <div className="h-full flex items-center pr-3 space-x-4 text-white unbounded font-light text-md">
          <button onClick={()=>{navigate('/map')}} className="hover:opacity-50 cursor-pointer transition-opacity duration-150 hover:border-b border-amber-700">Карта</button>
          {isLoggedIn ? 
          <img onClick={()=>{navigate('/profile')}} className="h-8 transition-all hover:-translate-y-1 cursor-pointer invert" src="/Icons/user.png"/>
          :
          <>
          <button onClick={() => { setShowForm([!showForm[0], false]) } } className="hover:opacity-50 cursor-pointer transition-opacity duration-150 hover:border-b border-amber-700">Вход</button>
          <button onClick={() => { setShowForm([!showForm[0], true]) } } className="bg-amber-600 rounded-lg p-1 px-3 transition-all duration-200 hover:bg-amber-500 hover:-translate-y-0.75 cursor-pointer">Регистрация</button>
          </>
          }
        </div>
      </div>

      <div className="w-screen h-[calc(100vh-92px)]">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/#" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>

        <footer className="w-screen h-fit bg-stone-700 border-amber-600 border-t-8 shadow-2xl p-8 flex justify-between items-center text-white unbounded">
          <div className="overflow-y-hidden flex flex-col font-extralight max-w-25 w-full ">
            <a className="font-normal border-b">Страници</a>
            <a className="pl-3 transition-all duration-150 hover:brightness-50 hover:translate-x-2 cursor-pointer"  onClick={()=>{navigate('/')}}>Начало</a>
            <a className="pl-3 transition-all duration-150 hover:brightness-50 hover:translate-x-2 cursor-pointer" onClick={()=>{isLoggedIn ? navigate('/profile'): setShowForm([true,false])}}>Профил</a>
            <a className="pl-3 transition-all duration-150 hover:brightness-50 hover:translate-x-2 cursor-pointer" onClick={()=>{navigate('/map')}}>Карта</a>
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
