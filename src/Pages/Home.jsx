import { useRef } from "react"


export default function Home() {
    const aboutRef = useRef()

    return (
        <>
            <section className="w-screen h-[calc(100vh-92px)] flex justify-center items-center bg-black flex-col space-y-1">
                <h1 className="text-amber-600 text-5xl unbounded h-15 font-bold">
                    FitMate
                </h1>
                <h2 className="text-white text-2xl unbounded">
                    лозонг лозонг лозонг
                </h2>
                <button onClick={() => {
                    aboutRef.current.scrollIntoView({
                        behavior: 'smooth'
                    })
                }}
                    className="w-25 h-10 unbounded text-white bg-amber-600 mt-5 rounded-2xl treansition-all duration-200 hover:-translate-y-1 hover:bg-amber-500 cursor-pointer hover:scale-110">За нас</button>
            </section>
            <section ref={aboutRef} className="w-screen h-fit min-h-1/2 text-3xl p-15 unbounded flex flex-col justify-baseline">
                <h1 className="overflow-x-hidden h-fit min-h-15 mb-3">Какво е <a className="text-amber-600 overflow-hidden font-bold">FitMate</a>?</h1>
                <p className="text-xl font-light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum harum aperiam obcaecati quibusdam voluptatum neque, dolores blanditiis quas tenetur, nesciunt consectetur? Impedit iure sed itaque. Laborum labore modi nihil? Nemo.</p>
            </section>
        </>
    )
}