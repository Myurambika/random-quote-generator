import React, { useState, useEffect } from "react"
import quotesData from "../data/quotes.json"
import "./Display.css"

const Display = () => {
    const [quote, setQuote] = useState("")
    const [author, setAuthor] = useState("")
    const [fade, setFade] = useState(false)
    const [category, setCategory] = useState("All")
    const [surpriseMe, setSurpriseMe] = useState(false)
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")
    const [quoteGenerated, setQuoteGenerated] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode)
        localStorage.setItem("darkMode", darkMode)
    }, [darkMode])

    const fetchQuote = () => {
        setFade(true)
        setLoading(true) 

        setTimeout(() => {
            let selectedCategory = surpriseMe ? getRandomCategory() : category
            let quotesArray = selectedCategory === "All" 
                ? Object.values(quotesData).flat() 
                : quotesData[selectedCategory]

            if (quotesArray.length > 0) {
                let randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)]
                setQuote(randomQuote.quote)
                setAuthor(randomQuote.author)
                setQuoteGenerated(true)
            } else {
                setQuote("No quotes available.")
                setAuthor("")
            }

            setFade(false)
            setLoading(false)
        }, 1000)
    }

    const getRandomCategory = () => {
        let categories = Object.keys(quotesData)
        return categories[Math.floor(Math.random() * categories.length)]
    }

    useEffect(() => {
        if (!quoteGenerated) {
            fetchQuote()
            setQuoteGenerated(true)
        }
    }, [])

    useEffect(() => {
        let interval
        if (surpriseMe) {
            interval = setInterval(fetchQuote, 10000)
        }
        return () => clearInterval(interval)
    }, [surpriseMe])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`"${quote}" - ${author}`)
        alert("Quote copied to clipboard!")
    }

    return (
        <div className={`quote-container ${darkMode ? "dark" : ""}`}>
            <div className="toggle-container">
                <span className="toggle-label">Dark Mode</span>
                <button className={`toggle-btn ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "ON" : "OFF"}
                </button>
            </div>

            <div className="category-filter">
                <label>Select Category: </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={surpriseMe}>
                    <option value="All">All</option>
                    {Object.keys(quotesData).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="toggle-container">
                <span className="toggle-label">Surprise Me!</span>
                <button className={`toggle-btn ${surpriseMe ? "active" : ""}`} onClick={() => setSurpriseMe(!surpriseMe)}>
                    {surpriseMe ? "ON" : "OFF"}
                </button>
            </div>

            <div className="quote-content">
                {loading ? (
                    <div className="spinner-container">
                        <div className="spinner show-spinner"></div>
                    </div>
                ) : (
                    <div className={`quote-text-container ${fade ? "fade-out" : "fade-in"}`}>
                        <p className="quote-text">"{quote}"</p>
                        {author && <p className="quote-author">- {author}</p>}
                    </div>
                )}
            </div>

            <div className="buttons-container">
                <button onClick={fetchQuote} className="newquote" disabled={surpriseMe}>
                    {loading && <div className="spinner button-spinner"></div>} Generate Quote
                </button>

                {quoteGenerated && (
                    <button onClick={copyToClipboard} className="copyquote">
                        Copy to Clipboard
                    </button>
                )}
            </div>
        </div>
    )
}

export default Display
