// API ENDPOINT :

const form = document.querySelector('form')
const input = document.querySelector('input')
const errorMsg = document.querySelector('.error-message')
const loader = document.querySelector('.loader')
const resultsDisplay = document.querySelector('.results-display')

form.addEventListener('submit', handleSubmit)

function handleSubmit(e) {
    e.preventDefault()

    if (input.value === "") {
        errorMsg.textContent = "Oops, veuillez remplir l'input"
        return
    }
    errorMsg.textContent = ""
    loader.style.display = "flex"
    resultsDisplay.textContent = ""
    wikiApiCall(input.value)
}

async function wikiApiCall(searchInput) {
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }
        const data = await response.json()

        createCards(data.query.search)
    } catch (e) {
        errorMsg.textContent = `${e}`
        loader.style.display = "none"
    }
}

function createCards(data) {
    if (!data.length) {
        errorMsg.textContent = "Oops, aucun résultat"
        loader.style.display = "none"
        return
    }
    data.forEach(el => {
        const url = `https://en.wikipedia.org/?curid=${el.pageid}`
        const card = document.createElement('div')
        card.className = "result-item"
        card.innerHTML = `
            <h3 class="result-title">
                <a href="${url}" target="_blank">${el.title}</a>    
            </h3>
            <a href="${url}" class="result-link" target="_blank">${url}</a>
            <span class="result-snippet">${el.snippet}</span>
            <br>
        `
        resultsDisplay.appendChild(card)
    })
    loader.style.display = "none"
}
