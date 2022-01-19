export const generateId = () => `i${Math.round(Math.random() * Date.now())}`

export const dateToText = (date) => {
    const months = ["January ",
        "February ",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December "
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`

}
export const reduceText = maxLength => text => {
    const words = text.slice(0, maxLength).split(" ")
    return words.length === 1 ? words[0] : words.slice(0, -1).join(" ")
}

export const getDatesFromText = (text) => {
    const regexp = /(0[1-9]|[1-9]|[12]\d|3[01])\/(0[1-9]|[1-9]|[12]\d|3[01])\/([12]\d{3})/g

    return text.match(regexp) || []
}