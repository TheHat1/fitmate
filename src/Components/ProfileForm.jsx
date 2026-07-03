import { useEffect, useRef, useState } from "react"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"

export default function Form({ open, isSignup, setShowForm }) {
    const formRef = useRef()
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [inProgress, setInProgress] = useState(false)
    const [completed, setCompleted] = useState(false)
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function handleClickOutsideForm(e) {
        if (open && !formRef.current.contains(e.target)) {
            setShowForm([false, false])
        }
    }

    useEffect(() => {
        setInProgress(false)
        setCompleted(false)
        setIsError(false)
        setErrorMsg("")
    }, [open])

    function handleFormButton() {
        if (username.trim() == "") {
            if (isSignup) {
                setIsError(true)
                setErrorMsg("Името е задължително поле")
                return
            }
        }

        if (email.trim() == "") {
            setIsError(true)
            setErrorMsg("Е-mail е задължително поле")
            return
        }

        if (!emailRegex.test(email)) {
            setIsError(true)
            setErrorMsg("Невалиден e-mail формат")
            return
        }

        if (password.length < 8) {
            setIsError(true)
            setErrorMsg("Паролата е твърде къса")
            return
        }

        setErrorMsg("")
        setIsError(false)

        if (isSignup) {
            Signup()
        } else {
            Login()
        }
    }

    async function Login() {
        try {
            if (inProgress) return

            setInProgress(true)

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if(error){
                alert(error)
            }

            setShowForm([false, false])
            navigate('/profile')

        } catch (err) {
            console.error(err)
        }
    }

    async function Signup() {
        try {
            if (inProgress) return

            setInProgress(true)

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: username
                    }
                }
            })

            if (error) {

                return
            }

            setCompleted(true)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div onClick={handleClickOutsideForm} className={`fixed top-0 w-screen h-screen backdrop-blur-xs flex justify-center items-center transition-all duration-300 bg-black/55
        ${open ? "z-40 opacity-100" : "-z-50 opacity-0"}`}>
                <div ref={formRef} className={`bg-white max-w-150 w-[80vw] min-h-80 h-fit m-5 z-50 absolute rounded-lg duration-300 p-7 unbounded flex flex-col items-start space-y-4 justify-center
          ${open ? "translate-y-0 z-50" : "translate-y-56"} 
          ${inProgress ? "opacity-0 -translate-y-56 pointer-events-none" : "opacity-100"}`}>
                    <h1 className="text-amber-600 text-xl w-full border-b border-black mb-5">{isSignup ? "Регистрация" : "Вход"}</h1>
                    {isSignup ?
                        <div className="w-full h-fit flex-col items-start sm:flex-row">
                            <a className="text-black text-lg font-light unbounded">Име: </a>
                            <input
                                className="w-full max-w-75 border-b cursor-text pl-1 focus:outline-none"
                                type="text"
                                value={username}
                                placeholder="Иван Иванов"
                                name="username"
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                        </div>
                        : null}

                    <div className="w-full h-fit flex-col items-start sm:flex-row">
                        <a className="text-black text-lg font-light unbounded">E-mail: </a>
                        <input
                            className="w-full max-w-75 border-b cursor-text pl-1 focus:outline-none"
                            type="text"
                            value={email}
                            placeholder="ivan@mail.com"
                            name="email"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>

                    <div className="w-full h-fit flex-col items-start sm:flex-row focus:outline-none">
                        <a className="text-black text-lg font-light unbounded">Парола: </a>
                        <input
                            className="w-full max-w-75 border-b cursor-text pl-1 focus:outline-none"
                            type="password"
                            value={password}
                            placeholder="Поне 8 символа"
                            name="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>

                    <div className={`w-full h-5.5 transition-all duration-300 border-b border-red-800 text-red-800 overflow-hidden
                        ${isError ? " opacity-100" : "opacity-0"}`}>
                        {errorMsg}
                    </div>

                    <button onClick={handleFormButton} className="w-full h-fit p-2 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-500 transition-all duration-150 hover:-translate-y-1">
                        {isSignup ? "Регистрация" : "Вход"}
                    </button>
                </div>
                <div className={`bg-white max-w-150 w-[80vw] min-h-80 h-fit m-5 z-50 absolute rounded-lg duration-300 p-7 unbounded flex flex-col items-start space-y-4 justify-center
          ${inProgress ? "opacity-100 translate-y-0 pointer-events-auto z-50" : "opacity-0 translate-y-56 pointer-events-none"}`}>
                    {completed ?
                        <div className="w-full h-fit overflow-hidden flex flex-col justify-center items-center">
                            <img className="h-15 mb-7" src="/Icons/checked.png" />
                            <h1 className="text-2xl mb-3">Благодарим за регистрацията!</h1>
                            <p>Потвърдете Вашият e-mail през линкът изпратен на</p>
                            <p className="underline">{email}</p>
                        </div>
                        :
                        <div className="w-full h-fit overflow-hidden flex justify-center items-center">
                            <img className="h-35 animate-spin" src="/Icons/loading.png" />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}