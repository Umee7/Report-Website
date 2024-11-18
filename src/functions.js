import { init } from "@paralleldrive/cuid2"

const getChoice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const createUserId = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz_0987654321_ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890_"
    const d1 = parseInt(new Date(new Date().toUTCString()).getTime()/100).toString()
    let d2 = ""
    const randomNumber = Math.random()*999
    for(let i=randomNumber; i < randomNumber+32; i++){
        if(i > 0 && i%6 === 0 && i%8 === 0){
            d2 += "-"
        } else {
            d2 += letters[parseInt(Math.random()*letters.length)]
        }
    }
    const d3 = parseInt((new Date(new Date().toUTCString()).getTime()+getChoice(1111111, 999999999)/10000)*getChoice(1,32)).toString().split('').reverse().join("")
    return d1+"-"+d2+"-"+d3
}


const dateMapper = (timestamp) => {
    const currentDateTimestamp = new Date().getTime()
    const diff = (currentDateTimestamp-timestamp)
    const seconds = parseInt(diff/1000);
    const minutes = parseInt(seconds/60)
    const hours = parseInt(minutes/60)
    const days = parseInt(hours/24)
    const weeks = parseInt(days/7)
    const months = parseInt(weeks/4)
    const years = (months/12).toFixed(1)
    
    if(seconds < 60){
        return "Just now"
    }
    else if(minutes === 1){
        return "A minute ago"
    }
    else if(minutes > 1 && minutes < 60){
        return `${minutes} minutes ago`
    }
    else if(hours === 1){
        return 'An hour ago'
    }
    else if(hours < 24){
        return `${hours} hours ago`
    }
    else if(days === 1){
        return "A day ago"
    }
    else if(days < 7){
        return `${days} days ago`
    }
    else if(weeks === 1){
        return `A week ago`
    }
    else if(weeks < 4){
        return `${weeks} weeks ago`
    }
    else if(months === 1){
        return `A month ago`
    }
    else if(months < 12){
        return `${months} months ago`
    }
    else if(years === 1){
        return `A year ago`
    }
    else {
        return `${years} years ago`
    }
}


const formatNumber = (number) => {
    if(number < 1000){
        return number.toString()
    }
    else if(number < 99999){
        return `${(number/1000).toFixed(2)}T`
    }
    else if(number < 9999999){
        return `${(number/100000).toFixed(2)}L`
    } else {
        return '>1Cr'
    }
}


const createCUId = () => {
    return init({
        fingerprint: createUserId(),
        length: 32,
        counter: Math.random
    })()
}


export {createUserId, dateMapper, createCUId, formatNumber}