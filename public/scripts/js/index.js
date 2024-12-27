"use strict";
axios.get("/api/getRandomProducts")
    .then((res) => {
    for (let el of res.data) {
        document.querySelector(`.popularProductContainer`).insertAdjacentHTML("beforeend", ( /*html*/`
                <div class="product"id="${el._id}">
        <div class="imgBlock">
            <img src="${el.photo}" alt="${el.productName}">
        </div>
        <div class="infoBlock">
            <div class="name">${el.productName}</div>
            <div class="price">${el.price}</div>
            <div class="addToCart">
                <button class="goSite" id="${el.pageLink}">Перейти на сайт</button>
            </div>
        </div>
        </div>
            `));
    }
    document.querySelector(`.spinerContainer`).style.display = "none";
}).catch(error => console.log(error));
document.querySelector('.popularProductContainer').addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('goSite')) {
        const ID = target.id;
        axios.post(`/api/addServiceVisit`, { serviceName: `Rozetka` })
            .then(res => console.log(res));
        window.location.href = ID;
    }
});
document.querySelector(`.catalogElement`).addEventListener("click", (e) => {
    const ID = e.target.id;
    const searchText = document.querySelector(`#${ID}`).textContent;
    axios.post(`/api/getProductsFromSearch/`, { searchText })
        .then((res) => {
        document.querySelector(`.productContainer`).innerHTML = "";
        for (let el of res.data) {
            document.querySelector(`.productContainer`).insertAdjacentHTML("beforeend", ( /*html*/`
                        <div class="product" id="${el._id}">
                            <div class="imgBlock">
                                <img src="${el.photo}" alt="${el.productName}">
                            </div>
                            <div class="infoBlock">
                                <div class="name">${el.productName}</div>
                                <div class="price">${el.price}</div>
                                <div class="addToCart">
                                    <button class="goSite" id="${el._id}">Перейти на сайт</button>
                                </div>
                            </div>
                        </div>
                    `));
        }
        document.querySelector(`.randomProductContainer`).style.display = "none";
        document.querySelector(`.catalogProductContainer`).style.display = "flex";
    });
});
//# sourceMappingURL=index.js.map