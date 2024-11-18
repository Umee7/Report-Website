import { useEffect, useRef, useState } from "react";
import CarouselItem from "./CarouselItem";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi"

const Carousel = ({ posts }) => {
    const [currentPosts, setCurrentPosts] = useState(posts)
    const [clientWidth, setClientWidth] = useState(0)
    const [currentLeftScroll, setCurrentLeftScroll] = useState(0)
    const [currentFileItem, setCurrentFileItem] = useState(0)

    const scrollingElement = useRef()

    useEffect(()=>{
        let matches = 0
        posts.forEach(post => {
            currentPosts.forEach(currentPost => {
                if(post.name === currentPost.name && post.size === currentPost.size){
                    matches += 1
                }
            })
        })
        if(matches !== posts.length){
            setCurrentPosts(posts)
        }
    },[posts])

    useEffect(()=>{
        setClientWidth(scrollingElement.current.clientWidth)
        scrollingElement.current.addEventListener('scroll', e=>{
            setCurrentLeftScroll(scrollingElement.current.scrollLeft)
        })
    },[])

    useEffect(()=>{
        const num = parseInt(currentLeftScroll/clientWidth)+1
        setCurrentFileItem(num || 1)
    },[currentLeftScroll])

    const swipeRight = () => {
        scrollingElement.current.scrollBy({
            left: clientWidth,
            behavior: "smooth"
        })
    }

    const swipeLeft = () => {
        scrollingElement.current.scrollBy({
            left: -clientWidth,
            behavior: "smooth"
        })
    }

    return (
        <div>
            <div className="h-96 max-h-96 flex overflow-auto snap-x snap-mandatory no-scrollbar" ref={scrollingElement}>
                {currentPosts.map(post => <CarouselItem {...post} key={currentPosts.indexOf(post)} />)}
            </div>
            {
                currentPosts.length > 1 ?
                <div className="flex justify-between items-center text-3xl p-2 text-neutral-700/95 dark:text-white/90">
                    <button type="button" className="rounded-full" onClick={swipeLeft}>
                        <BiLeftArrowCircle />
                    </button>
                    <div className="text-sm font-hand">
                        {currentFileItem}/{currentPosts.length}
                    </div>
                    <button type="button" className="rounded-full" onClick={swipeRight}>
                        <BiRightArrowCircle />
                    </button>
                </div>
                :
                []
            }
        </div>
    )
}

export default Carousel;