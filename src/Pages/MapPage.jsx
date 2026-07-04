import Map from "../Components/Map"
import FilterSelector from "../Components/FilterSelector"
import { useState } from "react"

export default function ProfilePage() {
    const [filterBy, setFilterBy] = useState([""])
    const [filterPostByMe, setFilterPostsByMe] = useState(true)

    return (
        <>
            <section className="w-screen h-[calc(100vh-92px)] flex justify-start items-start space-y-5 p-10 bg-black flex-col">
                <h1 className="text-white unbounded text-3xl border-b border-amber-600 w-full">Активности</h1>
                <div className="w-full h-fit min-h-15 p-2 text-white unbounded flex flex-col lg:flex-row space-x-5 space-y-3 items-center">
                    <button onClick={() => { setFilterPostsByMe(!filterPostByMe) }} className={`max-w-70 w-full rounded-lg p-1 px-3 transition-all duration-200 hover:-translate-y-0.75 cursor-pointer
                            ${filterPostByMe ? "hover:bg-emerald-500 bg-emerald-600 " : "hover:bg-sky-600 bg-sky-700 "}`}>
                        {filterPostByMe ? "От мен" : "От други"}
                    </button>
                    <h1 className="shrink-0">Филтрирай по: </h1>
                    <FilterSelector setFilterBy={setFilterBy} />
                </div>
                <div className="w-full h-full rounded-lg">
                    <Map />
                </div>

            </section>
        </>
    )
}