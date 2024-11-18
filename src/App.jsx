import { observable } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import Header from "./Components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Components/NavBar";
import NewPost from "./Components/NewPost";
import Posts from "./Components/Posts";
import Notes from "./Components/Notes";
import cuid2 from "@paralleldrive/cuid2";
import SpecificPost from "./Components/SpecificPost";
import Questions from "./Components/Questions";
import NotFound from "./Components/NotFound";



const AppState = observable({
    isLoaded: false,
    themeMode: null,
    notes: [],
    setLoaded: ()=>AppState.isLoaded = true,
    setThemeMode: (themeName) => AppState.themeMode = themeName,
    updateThemeMode: () => {
        AppState.setThemeMode(AppState.themeMode === "light" ? "dark" : "light")
    },
    addNote: (note, type) => {
        AppState.notes.unshift({
            data:note,
            type:type,
            id: cuid2.createId()
        })
    },
    removeNote: (id) => {
        AppState.notes = AppState.notes.filter(note => note.id !== id)
    }
})

const App = observer(() => {
    useEffect(()=>{
        const theme = window.localStorage.getItem("themeMode") || "light"
        AppState.setThemeMode(theme)
        AppState.setLoaded()
    },[])

    useEffect(()=>{
        if(AppState.themeMode === "dark"){
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("themeMode", AppState.themeMode)
    },[AppState.themeMode])

    return (
        AppState.isLoaded === true ?
        <section className="font-regular min-h-screen bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white transition duration-300">
            <BrowserRouter>
                <Header currentTheme={AppState.themeMode} updateTheme={AppState.updateThemeMode} />
                <div className="max-w-frame mx-auto grid grid-cols-[25%_75%] max-md:grid-cols-1">
                    <NavBar />
                    <div className="border-l max-md:border-0 border-neutral-400 dark:border-neutral-200">
                        <Routes>
                            <Route path="/" element={<Posts addNote={AppState.addNote} />} />
                            <Route path="/p/:referenceId" element={<SpecificPost addNote={AppState.addNote} />} />
                            <Route path="/new" element={<NewPost addNote={AppState.addNote} />} />
                            <Route path="/faqs" element={<Questions addNote={AppState.addNote} />} />
                            <Route path="*" element={<NotFound addNote={AppState.addNote} />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
            <Notes notes={AppState.notes} removeNote={AppState.removeNote} />
        </section>
        :
        []
    )
})

export default App;
