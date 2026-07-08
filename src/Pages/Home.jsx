import { useRef } from "react"
import { useNavigate } from "react-router-dom"


export default function Home() {
    const aboutRef = useRef()
    const navigate = useNavigate()

    return (
        <>
            <section className="w-screen h-[calc(100vh-92px)] flex justify-center items-center bg-black flex-col space-y-1">
                <h1 className="text-amber-600 text-5xl unbounded h-15 font-bold">
                    FitMate
                </h1>
                <h2 className="text-white text-2xl unbounded">
                    Спортувай заедно.
                </h2>
                <div className="flex flex-wrap space-x-4">
                    <button onClick={() => {
                        aboutRef.current.scrollIntoView({
                            behavior: 'smooth'
                        })
                    }}
                        className="w-25 h-10 unbounded text-white bg-amber-600 mt-5 rounded-2xl treansition-all duration-200 hover:-translate-y-1 hover:bg-amber-500 cursor-pointer hover:scale-110">За нас</button>
                    <button onClick={() => {navigate('/map')}}
                        className="w-25 h-10 unbounded text-white bg-stone-500 mt-5 rounded-2xl treansition-all duration-200 hover:-translate-y-1 hover:bg-stone-400 cursor-pointer hover:scale-110">Карта</button>
                </div>

            </section>
            <section ref={aboutRef} className="w-screen h-fit min-h-1/2 text-3xl p-15 unbounded flex flex-col justify-baseline bg-stone-100">
                <h1 className="overflow-x-hidden h-fit min-h-15 mb-3">Какво е <a className="text-amber-600 overflow-hidden font-bold">FitMate</a>?</h1>
                <div className="flex flex-col space-y-3 indent-10">
                    <p className="text-xl font-light ">FitMate е мястото, където спортът среща хората. Създадохме платформата, за да направим намирането на съотборници и организирането на спортни активности бързо, лесно и достъпно.</p>
                    <p className="text-xl font-light">Липсва ви още един човек за футбол? Търсите компания за баскетбол, волейбол, тенис или бягане? Публикувайте активност с няколко клика, посочете мястото, часа и колко участници са ви нужни, а останалото оставете на общността.</p>
                    <p className="text-xl font-light">FitMate помага да прекарвате по-малко време в търсене на хора и повече време в игра. Независимо дали организирате редовни тренировки или спонтанен мач след работа или училище, тук винаги можете да откриете хора със същата енергия и желание за движение.</p>
                </div>
            </section>
        </>
    )
}