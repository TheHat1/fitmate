import { useEffect, useRef, useState } from "react"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"


export default function ProfilePage() {
    const [pfp, setPfp] = useState('/Icons/user.png')
    const [username, setUsername] = useState('user')
    const [email, setEmail] = useState("abc@abc.abc")
    const [file, setFile] = useState(null)
    const inputRef = useRef()
    const navigate = useNavigate()
    const [filterPostByMe, setFilterPostsByMe] = useState(false)

    function handlePFPupload() {
        inputRef.current.click()
    }

    async function getUserData() {
        try {
            const { data, error } = await supabase.auth.getUser()
            setUsername(data?.user?.user_metadata.full_name)
            setEmail(data?.user?.user_metadata.email)
        } catch (err) {
            console.error(err)
        }
    }

    async function logOut(){
        const {} = await supabase.auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <>
            <section className="w-screen h-[calc(100vh-92px)] bg-black">
                <div className="w-full h-fit p-10 flex flex-col space-y-5">
                    <div className="w-full h-fit flex flex-col sm:flex-row space-x-10 p-5 justify-center md:justify-start md:items-center pb-15">
                        <div onClick={() => { inputRef.current.click() }} onChange={(e) => { setFile(e.target.files[0]) }} className="relative shrink-0 w-64 h-64 group cursor-pointer">
                            <img className="w-64 h-64 bg-stone-300 p-1 rounded-full border-3 border-stone-500" src={pfp} />
                            <img className="w-11 z-10 absolute left-27.5 top-27.5 invert opacity-0 group-hover:opacity-100 transition-all duration-150" src="/Icons/edit.png" />
                            <div className="w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 backdrop-blur-xs absolute top-0 left-0 transition-all duration-150">
                                <input ref={inputRef} type="file" className="absolute hidden" />
                            </div>
                        </div>
                        <div className="flex flex-col unbounded text-white md:h-full justify-start shrink-0">
                            <h1 className="text-4xl overflow-hidden">{username}</h1>
                            <h1 className="text-2xl font-light break-all">{email}</h1>
                            <button onClick={logOut} className="max-w-90 mt-15 bg-amber-600 rounded-lg p-1 px-3 transition-all duration-200 hover:bg-amber-500 hover:-translate-y-0.75 cursor-pointer">Излез</button>
                        </div>
                    </div>
                    <div className="w-full h-fit flex flex-col sm:flex-row p-2 justify-center md:justify-start md:items-center border-b border-stone-600 unbounded text-white space-x-5 text-2xl">
                        Постове
                    </div>
                    <div className="w-full p-2 text-white unbounded flex space-x-5 items-center">
                        <button onClick={() => { setFilterPostsByMe(!filterPostByMe) }} className={`max-w-70 w-full rounded-lg p-1 px-3 transition-all duration-200 hover:-translate-y-0.75 cursor-pointer
                            ${filterPostByMe ? "hover:bg-emerald-500 bg-emerald-600 " : "hover:bg-sky-600 bg-sky-700 "}`}>
                            {filterPostByMe ? "От мен" : "От други"}
                        </button>
                        <h1 className="">Филтрирай по: </h1>
                        <select className="w-50 focus:outline-none pl-1 rounded-lg">
                            <option value={1} >Футбол</option>
                            <option value={2} >Баскетбол</option>
                        </select>
                    </div>
                </div>
            </section>
        </>
    )
}