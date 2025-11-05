const url = "https://striveschool-api.herokuapp.com/books"

let carrello = []

const mostraCarrello = function () {
  const shop = document.getElementById("shop")
  shop.innerHTML = ""

  carrello.forEach((libro, index) => {
    const li = document.createElement("li")

    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    )
    li.innerHTML = `
      ${libro.title}
      <button class="btn btn-sm btn-danger rimuovi-btn">X</button>
    `
    shop.appendChild(li)
    //  Event listener al bottone rimuovi
    const btnRimuovi = li.querySelector(".rimuovi-btn")
    btnRimuovi.addEventListener("click", function () {
      // rimuove il libro giusto dall'array
      carrello.splice(index, 1)

      // aggiorna il localStorage
      localStorage.setItem("carrello", JSON.stringify(carrello))

      // aggiorna la UI
      mostraCarrello()
    })
  })
}

//  carico dal localStorage IN UN ARRAY
if (localStorage.getItem("carrello")) {
  carrello = JSON.parse(localStorage.getItem("carrello"))
  mostraCarrello()
}

const books = function () {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Errore nella risposta!")
      }
    })
    .then((libri) => {
      const container = document.getElementById("container")
      container.innerHTML = ""

      libri.forEach((libro, index) => {
        container.innerHTML += `
          <div class="col-12 col-md-6 col-lg-3 mb-4">
            <div class="card h-100">
              <img src="${libro.img}" class="card-img-top" alt="${libro.title}">
              <div class="card-body">
                <h5 class="card-title">${libro.title}</h5>
                <p class="card-text">${libro.price} €</p>
                <button class="btn btn-primary compra-btn" data-index="${index}">Compra ora</button>
                <button class="btn btn-danger scarta-btn">Scarta</button>
              </div>
            </div>
          </div>
        `
      })

      const compraBtns = document.querySelectorAll(".compra-btn")

      compraBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const index = btn.dataset.index
          const libro = libri[index]

          carrello.push(libro)

          localStorage.setItem("carrello", JSON.stringify(carrello))

          mostraCarrello()
        })
      })

      const btnScarta = document.querySelectorAll(".scarta-btn")
      btnScarta.forEach((btn) => {
        btn.addEventListener("click", function () {
          btn.closest(".col-12").remove()
        })
      })
    })
    .catch((err) => console.log(err))
}

books()
