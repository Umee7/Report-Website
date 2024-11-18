import { Link } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const Header = ({currentTheme, updateTheme}) => {
    return(
        <header className="dark:bg-cyan-300 dark:text-black font-bold bg-neutral-800 text-white z-50">
            <div className="max-w-frame mx-auto flex items-center justify-between">
                <h1><Link to={"/"} className="block p-5 text-lg text-center mx-2">SafeSpace</Link></h1>
                <button type="button" className="border-2 dark:border-black p-1 text-xl rounded-full mx-2" onClick={updateTheme}>
                    {
                        currentTheme === 'light'?
                        <MdOutlineDarkMode />
                        :
                        <MdOutlineLightMode />
                    }
                </button>
            </div>
        </header>
    )
}

export default Header;
