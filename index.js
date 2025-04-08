const input = document.querySelector("#todo-input")
const addBtn = document.querySelector("#add-todo")
const list = document.querySelector("#todo-list")

//Fetch background image
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.getElementById("background-filtered").style.backgroundImage = `url(${data.urls.regular})`
		document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.getElementById("background-filtered").backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
		// document.getElementById("author").textContent = `By: Dodi Achmad`
    })

//
// fetch("https://api.coingecko.com/api/v3/coins/dogecoin")
//     .then(res => {
//         if (!res.ok) {
//             throw Error("Something went wrong")
//         }
//         return res.json()
//     })
//     .then(data => {
//         document.getElementById("crypto-top").innerHTML = `
//             <img src=${data.image.small} />
//             <span>${data.name}</span>
//         `
//         document.getElementById("crypto").innerHTML += `
//             <p>🎯: $${data.market_data.current_price.usd}</p>
//             <p>👆: $${data.market_data.high_24h.usd}</p>
//             <p>👇: $${data.market_data.low_24h.usd}</p>
//         `
//     })
//     .catch(err => console.error(err))

//Get the current time
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "medium"})
}

setInterval(getCurrentTime, 1000)

//Get the current location for weather
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
          console.log(data)
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

//Get the current news
fetch(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${NEWS_API}`)
  .then(res => res.json())
  .then(data =>{

    const articles = data.articles
    .slice(0, 5)
    .map(article => {
      return`

          <h3>${article.title}</h3>
          <a href="${article.url}" target="_blank" id="link">${article.url}</a>
      `
    }).join("")

    document.querySelector("#news-list").innerHTML += articles

  })

//Get the current exchange rate
fetch(`https://api.exchangerate.host/live?access_key=${EXCHANGE_API}&currencies=USD,JPY`)
  .then(res => res.json())
  .then(data => {
    console.log(data.quotes.USDJPY)
    document.querySelector("#exchange").innerHTML = `
      <p>1 USD = ${data.quotes.USDJPY.toFixed(2)} JPY</p>
    `

  })

//Add a to do list

//get the list from local storage
let todos = JSON.parse(localStorage.getItem("todos")) || []
renderTodos()

addBtn.addEventListener("click", function(){
    if (input.value) {
        todos.push(input.value)
        input.value = ""
        localStorage.setItem("todos", JSON.stringify(todos))
        renderTodos()
    }
})

function renderTodos(){
    list.innerHTML = todos.map((todo,index) => {
        return `
            <li>
                <input type="checkbox" class="todo-checkbox" data-index="${index}" />
                <span>${todo}</span>
                <button class="delete-btn">❌</button>
            </li>
        `
    }).join("")

    const deleteBtns = document.querySelectorAll(".delete-btn")
    deleteBtns.forEach((btn, index) => {
        btn.addEventListener("click", function(){
            todos.splice(index, 1)
            localStorage.setItem("todos", JSON.stringify(todos))
            renderTodos()
        })
    })
}

const checkboxes = document.querySelectorAll(".todo-checkbox")
checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", function () {
        const span = this.nextElementSibling
        if (this.checked) {
            span.classList.add("done")
        } else {
            span.classList.remove("done")
        }
    })
})
