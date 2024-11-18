import { BiCheckCircle, BiErrorCircle, BiXCircle } from "react-icons/bi";

const Note = ({data, type, removeFunction}) => {
    return(
        <div className="flex items-center justify-between bg-white dark:border-cyan-400 mx-1 my-3 p-3 w-full rounded border-2 border-neutral-700 dark:bg-neutral-800 dark:text-white">
            <div className="flex items-center text-lg">
                {type === "error"?<BiErrorCircle className="block min-w-7 w-7 h-7 mr-1" />:<BiCheckCircle className="block w-7 h-7 mr-1" />}
                <span className="block ml-1 text-sm">{data}</span>
            </div>
            <button className="text-xl" onClick={removeFunction}>
                <BiXCircle />
            </button>
        </div>
    )
}

export default Note;