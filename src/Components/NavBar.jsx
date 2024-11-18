import { NavLink } from "react-router-dom";
import { MdOutlineArticle } from "react-icons/md"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { BsQuestionCircle } from "react-icons/bs";

const NavBar = () => {
    return(
        <nav className="flex flex-col p-5 top-0 max-md:top-auto h-fit sticky max-md:flex-row max-md:bottom-0 max-md:fixed max-md:left-0 max-md:right-0 max-md:items-end max-md:justify-between max-md:border-t max-md:p-1 max-md:grid-cols-[50%_50%] z-50 max-md:bg-white max-md:dark:bg-neutral-700">
            <NavLink to={'/'} className={e => {
                return `transition duration-300 flex items-center text-lg rounded-3xl w-max px-5 py-2.5 mt-10 mb-3 max-md:my-0 max-md:mx-auto border-2 ${e.isActive ? "dark:bg-cyan-300 dark:border-cyan-300 dark:text-black border-neutral-600 bg-neutral-800/90 text-white" : "bg-neutral-300/50 dark:bg-neutral-700/50 dark:text-white"}`
            }}>
                <MdOutlineArticle className="text-2xl mx-1" />
                <span className="mx-1 max-md:hidden">Posts</span>
            </NavLink>

            <NavLink to={'/new'} className={e => {
                return `transition duration-300 flex items-center text-lg rounded-3xl w-max px-5 py-2.5 my-3 max-md:my-0 max-md:mx-auto border-2 ${e.isActive ? "dark:bg-cyan-300 dark:border-cyan-300 dark:text-black border-neutral-600 bg-neutral-800/90 text-white" : "bg-neutral-300/50 dark:bg-neutral-700/50 dark:text-white"}`
            }}>
                <AiOutlinePlusCircle className="text-2xl mx-1" />
                <span className="mx-1 max-md:hidden">New post</span>
            </NavLink>

            <NavLink to={'/faqs'} className={e => {
                return `transition duration-300 flex items-center text-lg rounded-3xl w-max px-5 py-2.5 my-3 max-md:my-0 max-md:mx-auto border-2 ${e.isActive ? "dark:bg-cyan-300 dark:border-cyan-300 dark:text-black border-neutral-600 bg-neutral-800/90 text-white" : "bg-neutral-300/50 dark:bg-neutral-700/50 dark:text-white"}`
            }}>
                <BsQuestionCircle className="text-2xl mx-1" />
                <span className="mx-1 max-md:hidden">FAQs</span>
            </NavLink>
        </nav>
    )
}

export default NavBar;