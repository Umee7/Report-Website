import { useEffect, useRef, useState } from "react";
import { AiOutlinePauseCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { BiFullscreen,  BiVolumeFull, BiVolumeMute } from "react-icons/bi";


const CarouselItem = ({postURL, postType}) => {
    const [objectFit, setObjectFit] = useState("cover")
    const [isRendered, setRendered] = useState(false)

    const [isVideoMuted, setVideoMuted] = useState(true)
    const [VideoOverlay, setVideoOverlay] = useState(true)
    const [videoStatus, setVideoStatus] = useState("pause")

    const videoReference = useRef()
    const itemReference = useRef()

    function isInViewport(element) {
        if(element){
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        return null
    }

    useEffect(()=>{
        if(isRendered === true){
            if (navigator && navigator.vibrate){
                navigator.vibrate(100);
            }
        }
        setRendered(true)
    },[objectFit])

    useEffect(()=>{
        if(videoStatus === "pause"){
            if(videoReference.current){
                videoReference.current.pause()
            }
        } else {
            if(videoReference.current){
                videoReference.current.play()
            }
        }
    },[videoStatus])

    const scrollListener = ()=> {
        const IsInView = isInViewport(itemReference.current)
        if(IsInView !== null){
            setVideoStatus(IsInView === true ? "play" : "pause")
        }
    }

    useEffect(()=>{
        if(itemReference.current){
            window.addEventListener('scroll', scrollListener)
        }
        return ()=>window.removeEventListener('scroll', scrollListener)
    },[])

    useEffect(()=>{
        if(VideoOverlay === true){
            setTimeout(()=>{
                setVideoOverlay(false)
            },1500)
        }
    }, [VideoOverlay])

    return (
        <div className="min-h-full min-w-full snap-center flex flex-col items-center justify-center overflow-hidden bg-neutral-800/40 dark:bg-neutral-900/70" style={{backgroundImage: `url('${postURL}')`}} 
            ref={itemReference}>
            {
                postType.startsWith("video") && VideoOverlay === true ?
                <div className="relative w-full">
                    <div className="absolute bg-neutral-900/50 h-96 w-full z-10 flex flex-col items-center justify-end">
                        <button
                            type="button"
                            onClick={e => {
                                e.preventDefault()
                                setVideoStatus(videoStatus === "pause" ? "play" : "pause")
                            }}
                            className="text-center rounded-full text-5xl p-1 m-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
                            { videoStatus === "pause" ? <AiOutlinePlayCircle /> : <AiOutlinePauseCircle /> } 
                        </button>

                        <button
                            type="button"
                            className="self-end border-2 rounded-full text-lg p-2 m-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
                            onClick={e=>{
                                e.preventDefault()
                                setObjectFit(objectFit === "cover" ? "contain" : "cover")
                            }}
                        >
                            <BiFullscreen />
                        </button>

                        <button
                            type="button"
                            onClick={e => {
                                e.preventDefault()
                                setVideoMuted(!isVideoMuted)
                            }}
                            className="self-end border-2 rounded-full text-lg p-2 m-2 bg-white text-black dark:bg-neutral-800 dark:text-white">
                            { isVideoMuted === true? <BiVolumeMute /> : <BiVolumeFull /> }
                        </button>
                    </div>
                </div>
                :
                []
            }

            {
                postType.startsWith("image") ?
                <img
                    src={postURL}
                    alt="New image to post"
                    className={`${objectFit === "contain"? "w-full h-full object-contain scale-100" : "object-cover min-w-full min-h-full scale-105"} backdrop-blur-2xl transition-all duration-300 ease-in-out`}
                    onClick={ ()=>setObjectFit(objectFit === "cover" ? "contain" : "cover") }
                    loading="lazy"
                />
                :
                postType.startsWith("video") ?
                <video
                    autoPlay
                    ref={videoReference}
                    muted={isVideoMuted}
                    loop={true}
                    className={`${objectFit === "contain"? "w-full h-full object-contain backdrop-blur-2xl": "object-cover min-w-full min-h-full backdrop-blur-2xl"}`}
                    onClick={ ()=>setVideoOverlay(!VideoOverlay)}>
                    <source src={postURL} autoPlay type={postType}></source>
                </video>
                :
                <strong>File type is not supported!</strong>
            }
        </div>
    )
}

export default CarouselItem;