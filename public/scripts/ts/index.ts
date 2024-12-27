axios.get("/api/getRandomProducts")
    .then((res) => {
        for (let el of res.data) {
            document.querySelector(`.popularProductContainer`)!.insertAdjacentHTML("beforeend", (/*html*/`
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
            `))
        }
        document.querySelector<HTMLElement>(`.spinerContainer`)!.style.display = "none";
    }).catch(error => console.log(error));

document.querySelector<HTMLElement>('.popularProductContainer')!.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('goSite')) {
        const ID: string = target.id;
        axios.post(`/api/addServiceVisit`, { serviceName: `Rozetka`})
        .then(res => console.log(res))
        window.location.href = ID;
    }
});


document.querySelector<HTMLElement>(`.catalogElement`)!.addEventListener("click", (e) => {
    const ID: string = (e.target as HTMLElement).id;
    const searchText: string = document.querySelector<HTMLInputElement>(`#${ID}`)!.textContent!;
    axios.post(`/api/getProductsFromSearch/`, { searchText })
        .then((res) => {
            document.querySelector(`.productContainer`)!.innerHTML = "";
            for (let el of res.data) {
                document.querySelector(`.productContainer`)!.insertAdjacentHTML("beforeend", (/*html*/`
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
                    `))
            }
            document.querySelector<HTMLElement>(`.randomProductContainer`)!.style.display = "none";
            document.querySelector<HTMLElement>(`.catalogProductContainer`)!.style.display = "flex";
        })
})