const Categories = [
    { code: "advertisement", name: "Advertisement" },
    { code: "adult", name: "Adult" },
    { code: "development", name: "Development" },
    { code: "educational", name: "Educational" },
    { code: "entertainment", name: "Entertainment" },
    { code: "facts", name: "Facts" },
    { code: "fake-news", name: "Fake news" },
    { code: "news", name: "News" },
    { code: "programming", name: "Programming" },
    { code: "question", name: "Question" },
    { code: "timepass", name: "Timepass" },
]

const getCategoryByCode = (code) => {
    for(let i=0; i< Categories.length; i++){
        if(Categories[i]['code'].toUpperCase() === code.toUpperCase()){
            return  Categories[i]
        }
    }
}

export {Categories, getCategoryByCode}