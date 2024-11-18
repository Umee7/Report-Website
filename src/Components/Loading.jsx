import { BiLoader } from "react-icons/bi";

const Loading = ({text}) => {
    return(
        <div className={`flex items-center my-1 mx-1 ${text ? "p-2 border-b": ""}`}>
            <BiLoader className="animate-spin" />
            {
                text ? <span className="block text-sm mx-1">{text}</span> : []
            }
        </div>
    )
}

export default Loading;