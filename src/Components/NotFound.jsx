import { useEffect } from "react";
import { BsXCircle } from "react-icons/bs";

const NotFound = () => {
    useEffect(()=>{
        document.title = "Not found"
    },[])

    return(
        <div className="text-center my-16">
            <BsXCircle className="text-9xl mx-auto animate-spin" />
            <h2 className="text-4xl my-6">Not found!</h2>
            <p className="text-lg my-2">Sorry, you won't get anything here, its 404!</p>
            <p className="text-lg my-2">Check the URL if typed manually or enjoy the latest posts.</p>
        </div>
    )
}

export default NotFound;