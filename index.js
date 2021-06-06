// Función para borrar productos
function removeCards() {
    // Obtengo todos los productos si hay
    const productEl = document.querySelectorAll(".result-item");

    // Si no hay ninguno, entonces no hay mucho más que hacer...
    if (productEl.length == 0) {
        return;
    }

    // Si hay...
    productEl.forEach((prod) => prod.remove());
}

// Función para mostrar los resultados de búsqueda
function showResults(results) {
    // Borro productos que hayan quedado de búsquedas previas
    removeCards();

    // Obtengo el template
    let template = document.querySelector(".product-item");

    // Elementos auxiliares
    const resultsContainerEl = document.querySelector(".results");
    const resultCountEl = document.querySelector(".results-count");

    // En caso de no haber resultados, sólo altero la cantidad de resultados de búsqueda
    if (results.length == 0) {
        resultCountEl.textContent = "0";

        return;
    }

    // Si hay resultados, entonces primero muestro la cantidad de resultados
    resultCountEl.textContent = results.length.toString();

    // Recorro el array con todos los productos, y creo las "cartas"
    for (let product of results) {
        // Principal: el link de la publicación
        let aEl = template.content.querySelector(".prod-link");
        aEl.setAttribute("href", product.permalink);

        // Al template, le agrego el atributo src de la imagen
        let imgEl = template.content.querySelector(".result-item-img");
        imgEl.setAttribute("src", product.thumbnail);

        // Ahora, el título
        let titleEl = template.content.querySelector(".result-item-title");
        titleEl.textContent = product.title;

        // La condición
        let conditionEl = template.content.querySelector(
            ".result-item-condition"
        );
        let conditionText = product.condition;

        // Reemplazo a español y agrego
        conditionText = conditionText.replace("new", "Nuevo");
        conditionText = conditionText.replace("used", "Usado");
        conditionEl.textContent = conditionText;

        // Agrego la cantidad de vendidos
        let soldCountEl = template.content.querySelector(
            ".result-item-sold-count"
        );
        soldCountEl.textContent = product["sold_quantity"].toString();

        // Agrego el precio
        let priceEl = template.content.querySelector(".result-item-price");
        priceEl.textContent = "$" + product.price.toString();

        // Finalmente, creo una copia de el template, y le hago un append desde el contenedor
        let clone = document.importNode(template.content, true);
        resultsContainerEl.appendChild(clone);
    }
}

// Función para obtener los datos de búsqueda
function processSearch(formEl) {
    // Ahora creo un event listener para obtener los datos del form
    formEl.addEventListener("submit", (e) => {
        // Quito el comportamiento por defecto
        e.preventDefault();

        // Obtengo los datos
        const data = new FormData(e.target);
        const object = Object.fromEntries(data.entries());
        const searchQuery = object.search.trim();

        // Con los datos de búsqueda ya listos, hago el fetch
        fetch("https://api.mercadolibre.com/sites/MLA/search?q=" + searchQuery)
            .then((resp) => resp.json())
            .then((results) => showResults(results.results));
    });
}

// Función principal
function main() {
    // Obtengo el form
    const formEl = document.querySelector(".search-form");

    // Proceso la búsqueda, y muestro en pantalla
    processSearch(formEl);
}

// EJECUCIÓN
main();
