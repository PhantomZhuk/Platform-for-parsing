interface IRandimProduct {
    productName: string;
    price: string;
    photo: string;
    pageLink: string;
}

let data: any = [];

const urlData: { [key: string]: string } = {
    laptops: `https://rozetka.com.ua/ua/notebooks/c80004/`,
    smartphones: `https://rozetka.com.ua/ua/mobile-phones/c80003/`,
    tablets: `https://rozetka.com.ua/ua/tablets/c130309/`,
    guns: `https://rozetka.com.ua/ua/search/?text=%D0%97%D0%B1%D1%80%D0%BE%D1%8F`,
    clothingAndFootwear: `https://rozetka.com.ua/ua/search/?text=%D0%9E%D0%B4%D1%8F%D0%B3%20%D1%96%20%D0%B2%D0%B7%D1%83%D1%82%D1%82%D1%8F`,
    computers: `https://hard.rozetka.com.ua/ua/computers/c80095/`,
    televisions: `https://rozetka.com.ua/ua/all-tv/c80037/`,
    businessProducts: `https://rozetka.com.ua/ua/search/?text=%D0%9F%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D1%96%D0%B7%D0%BD%D0%B5%D1%81%D1%83`,
}

axios.get("/api/getRandomProducts")
    .then((res) => {
        let id = 0;
        res.data.forEach((el: IRandimProduct) => {
            data.push(el);
            $(".popularProductContainer").append(`
                <div class="product" id="${id}">
                    <div class="imgBlock">
                        <img src="${el.photo}" alt="${el.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${el.productName}</div>
                        <div class="price">${el.price}</div>
                        <div class="btnContainer">
                            <button class="goSite" id="${el.pageLink}">Перейти на сайт</button>
                            <div class="moreInfoBtn" id="${id}"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                        </div>
                    </div>
                </div>
            `);
            id++;
        });

        data.forEach((el: IRandimProduct & { id: number }, index: number) => {
            el.id = index;
        });

        $(".spinerContainer").css("display", "none");
    })
    .catch((error) => console.log(error));

$(".popularProductContainer").on("click", ".goSite", function () {
    const ID = $(this).attr("id");
    axios.post(`/api/addServiceVisit`, { serviceName: `Rozetka` })
        .then((res) => console.log(res));
    (window as any).location.href = ID;
});

$(".popularProductContainer").on("click", ".moreInfoBtn", function () {
    const ID: string = $(this).attr("id")!;
    data.forEach((el: IRandimProduct & { id: number }) => {
        if (el.id === parseInt(ID)) {
            $(".TrackProduct").empty();
            $(".TrackProduct").append(`
                <div class="product" id="${el.id}">
                    <div class="imgBlock">
                        <img src="${el.photo}" alt="${el.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${el.productName}</div>
                        <div class="price">${el.price}</div>
                        <div class="btnContainer">
                            <button class="track" id="${el.id}">Track</button>
                        </div>
                    </div>
                </div>
            `);
            $(`.addProductFreezerPopup`).css(`display`, `flex`);
        }
    });
});

$(`.header i`).on(`click`, () => {
    $(`.addProductFreezerPopup`).css(`display`, `none`);
})

$(".TrackProduct").on("click", ".track", function () {
    const ID = $(this).attr("id");
    axios.post(`/api/goodSubscription`, { goodId: ID })
        .then((res) => console.log(res));
});

$(".catalogElement").on("click", function () {
    const ID: string = $(this).attr("id")!;
    let id = 0;
    data = [];
    axios.post(`/api/getProductByUrl/`, { url: urlData[ID] })
        .then((res) => {
            $(".productContainer").empty();
            res.data.forEach((el: IRandimProduct & { id: number }) => {
                $(".productContainer").append(`
                    <div class="product" id="${id}">
                        <div class="imgBlock">
                            <img src="${el.photo}" alt="${el.productName}">
                        </div>
                        <div class="infoBlock">
                            <div class="name">${el.productName}</div>
                            <div class="price">${el.price}</div>
                            <div class="addToCart">
                                <button class="goSite" id="${id}">Перейти на сайт</button>
                                <div class="moreInfoBtn" id="${id}"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                            </div>
                        </div>
                    </div>
                `);
                id++;
            });

            data.forEach((el: IRandimProduct & { id: number }, index: number) => {
                el.id = index;
            });

            $(".randomProductContainer").css("display", "none");
            $(".catalogProductContainer").css("display", "flex");
            $(`.catalogTitle`).text(urlData[ID]);
        });
});