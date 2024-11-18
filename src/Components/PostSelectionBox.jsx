import { useRef } from "react";
import { BiLeftArrow, BiRightArrow, BiXCircle } from "react-icons/bi";

const PostSelectionBox = ({ objectWithCodeAndName, onClickFunction, activeItem }) => {
    const barReference = useRef()

    const goLeft = () => {
        if(barReference.current.scrollLeft > 0){
            barReference.current.scrollBy({
                left: -(barReference.current.clientWidth - 50),
                behavior: "smooth"
            })
        }
    }

    const goRight = () => {
        if(barReference.current.scrollLeft < barReference.current.scrollWidth){
            barReference.current.scrollBy({
                left: barReference.current.clientWidth - 50,
                behavior: "smooth"
            })
        }
    }

    return (
        <div className="flex flex-row items-center justify-start whitespace-nowrap max-w-full py-3 my-1 bg-white dark:bg-transparent">
            <button onClick={goLeft} className="ml-48 rounded-full p-2 border max-md:hidden">
                <BiLeftArrow />
            </button>
            <div className="flex flex-row items-center justify-start whitespace-nowrap max-w-full overflow-auto no-scrollbar bg-white dark:bg-transparent" ref={barReference}>
                <div className="flex flex-row items-center max-md:ml-20">
                    {
                        objectWithCodeAndName.map(item => {
                            return (
                                <button key={item.code} className={`block mx-2 rounded-3xl py-2 px-3 border bg-white border-zinc-800 dark:bg-neutral-800 dark:border-white ${activeItem === item.code ? "bg-zinc-700 text-white dark:bg-white dark:text-black" : ""}`} onClick={() => onClickFunction(item.code)}>
                                    {item.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <button onClick={goRight} className="ml-2 rounded-full p-2 border max-md:hidden">
                <BiRightArrow />
            </button>
            <div className="border-r border-zinc-700 dark:border-white absolute bg-white dark:bg-zinc-800 p-3 py-1">
                <button className={`flex items-center rounded-3xl py-2 px-3 border border-zinc-800 dark:border-white bg-white dark:bg-neutral-800`} onClick={() => onClickFunction('all')}>
                    <BiXCircle className="w-5 h-5 mx-0.5 block" />
                    <span className="block max-md:hidden">Clear selection</span>
                </button>
            </div>
        </div>
    )
}

export default PostSelectionBox;