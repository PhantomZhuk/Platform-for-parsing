"use strict";
let data = [];
const urlData = {
    laptops: `https://rozetka.com.ua/ua/notebooks/c80004/`,
    smartphones: `https://rozetka.com.ua/ua/mobile-phones/c80003/`,
    tablets: `https://rozetka.com.ua/ua/tablets/c130309/`,
    guns: `https://rozetka.com.ua/ua/search/?text=%D0%97%D0%B1%D1%80%D0%BE%D1%8F`,
    clothingAndFootwear: `https://rozetka.com.ua/ua/search/?text=%D0%9E%D0%B4%D1%8F%D0%B3%20%D1%96%20%D0%B2%D0%B7%D1%83%D1%82%D1%82%D1%8F`,
    computers: `https://hard.rozetka.com.ua/ua/computers/c80095/`,
    televisions: `https://rozetka.com.ua/ua/all-tv/c80037/`,
    businessProducts: `https://rozetka.com.ua/ua/search/?text=%D0%9F%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D1%96%D0%B7%D0%BD%D0%B5%D1%81%D1%83`,
};
let traceableProductsPopup = false;
let searchProduct = [];
function getRandomProducts() {
    axios.get("/api/getRandomProducts")
        .then((res) => {
        let id = 0;
        data = [];
        $(".productContainer").empty();
        res.data.forEach((el) => {
            data.push(el);
            $(".productContainer").append(`
                <div class="product" id="${id}">
                    <div class="imgBlock">
                        <img src="${el.photo}" alt="${el.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${el.productName}</div>
                        <div class="price">${el.price}</div>
                        <div class="status">${el.status}</div>
                        <div class="btnContainer">
                            <button class="goSite" id="${el.pageLink}">Перейти на сайт</button>
                            <div class="moreInfoBtn" id="${id}"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                        </div>
                    </div>
                </div>
            `);
            id++;
        });
        data.forEach((el, index) => {
            el.id = index;
        });
        $(".spinerContainer").css("display", "none");
        $(`#catalogTitle`).text("Популярні продукти");
    })
        .catch((error) => console.log(error));
}
getRandomProducts();
function notification(text) {
    $(".notification").text(text);
    $(".notificationPopup").css("display", "flex");
    setTimeout(() => {
        $(".notificationPopup").css("display", "none");
    }, 3000);
}
$(".productContainer").on("click", ".goSite", function () {
    const ID = $(this).attr("id");
    axios.post(`/api/addServiceVisit`, { serviceName: `Rozetka` })
        .then((res) => console.log(res));
    window.location.href = ID;
});
$(".productContainer").on("click", ".moreInfoBtn", function () {
    const ID = $(this).attr("id");
    console.log(data);
    data.forEach((el) => {
        if (el.id === parseInt(ID)) {
            $(".TrackProduct").empty();
            $(".TrackProduct").append(`
                <div class="product" id="${el.id}">
                    <div class="imgBlock">
                        <img src="${el.photo}" alt="${el.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${el.productName}</div>
                        <div class="status">${el.status}</div>
                        <div class="price">${el.price}</div>
                        <div class="btnContainer">
                            <button class="track" id="${el.id}">Track</button>
                        </div>
                    </div>
                </div>
            `);
            $(`.addTraceableProductPopup`).css(`display`, `flex`);
        }
    });
});
$(`.closeAddTraceableProductPopup`).on(`click`, () => {
    $(`.addTraceableProductPopup`).css(`display`, `none`);
});
$(".TrackProduct").on("click", ".track", function () {
    const ID = Number($(this).attr("id"));
    $(`.addTraceableProductPopup`).css(`display`, `none`);
    axios.post(`/api/addTraceableProduct`, { product: data[ID] })
        .then((res) => {
        console.log(res);
        $(`.traceableProductsContainer`).empty();
        res.data.user.observedProducts.forEach((el) => {
            $(`.traceableProductsContainer`).append(`
                    <div class="traceableProduct" id="${el._id}">
            <div class="photoContainer">
            <img src="${el.photo}" alt="Traceable products photo">
            </div>
            <div class="productInfo">
            <div class="productName">${el.productName}</div>
            <div class="productStatus">${el.status}</div>
            <div class="productPrice">${el.price}</div>
            <div class="btnContainer">
                <button class="deletetraceableProduct" id="${el._id}">Delete <i class="fa-solid fa-trash-can"></i></button>
            </div>
            </div>
            </div>
                    `);
        });
    });
});
$(`#trackableProductsBtn`).on(`click`, () => {
    if (traceableProductsPopup) {
        $(`.traceableProductsPopup`).css(`display`, `none`);
        $(`#trackableProductsBtn`).css(`background-color`, `#452497`);
        $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #452497`);
        $(`.wrap header`).css(`border-bottom-right-radius`, `20px`);
        $(`.traceableProductsPopup`).css(`display`, `none`);
        $(`#trackableProductsBtnUser`).css(`background-color`, `#452497`);
        $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #452497`);
        $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `20px`);
        traceableProductsPopup = false;
    }
    else {
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtn`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.wrap header`).css(`border-bottom-right-radius`, `0px`);
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtnUser`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `0px`);
        traceableProductsPopup = true;
    }
});
$(`#trackableProductsBtnUser`).on(`click`, () => {
    if (traceableProductsPopup) {
        $(`.traceableProductsPopup`).css(`display`, `none`);
        $(`#trackableProductsBtn`).css(`background-color`, `#452497`);
        $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #452497`);
        $(`.wrap header`).css(`border-bottom-right-radius`, `20px`);
        $(`.traceableProductsPopup`).css(`display`, `none`);
        $(`#trackableProductsBtnUser`).css(`background-color`, `#452497`);
        $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #452497`);
        $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `20px`);
        traceableProductsPopup = false;
    }
    else {
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtn`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.wrap header`).css(`border-bottom-right-radius`, `0px`);
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtnUser`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `0px`);
        traceableProductsPopup = true;
    }
});
$(".catalogElement").on("click", function () {
    $(`.spinerContainer`).css(`display`, `flex`);
    const ID = $(this).attr("id");
    let id = 0;
    data = [];
    axios.post(`/api/getProductByUrl/`, { url: urlData[ID] })
        .then((res) => {
        $(".productContainer").empty();
        res.data.forEach((el) => {
            data.push(el);
            $(".productContainer").append(`
                    <div class="product" id="${id}">
                        <div class="imgBlock">
                            <img src="${el.photo}" alt="${el.productName}">
                        </div>
                        <div class="infoBlock">
                            <div class="name">${el.productName}</div>
                            <div class="status">${el.status}</div>
                            <div class="price">${el.price}</div>
                            <div class="btnContainer">
                                <button class="goSite" id="${id}">Перейти на сайт</button>
                                <div class="moreInfoBtn" id="${id}"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                            </div>
                        </div>
                    </div>
                `);
            id++;
        });
        data.forEach((el, index) => {
            el.id = index;
        });
        console.log(data);
        $(".randomProductContainer").css("display", "none");
        $(".catalogProductContainer").css("display", "flex");
        $(`.catalogTitle`).text(urlData[ID]);
        $(`.spinerContainer`).css(`display`, `none`);
    });
});
$(`#userBtn`).on(`click`, () => {
    if ($(`#userBtn`).hasClass(`logIn`)) {
        $(`.authPopup`).css(`display`, `flex`);
        $(`.wrap`).css(`filter`, `blur(1.5px)`);
    }
    else if ($(`#userBtn`).hasClass(`openUserInfo`)) {
        $(`.userAccountContainer`).css(`display`, `flex`);
        $(`.wrap`).css(`display`, `none`);
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtn`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.wrap header`).css(`border-bottom-right-radius`, `0px`);
        $(`.traceableProductsPopup`).css(`display`, `flex`);
        $(`#trackableProductsBtnUser`).css(`background-color`, `#753efe`);
        $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #753efe`);
        $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `0px`);
        traceableProductsPopup = true;
    }
});
$(`.traceableProductsContainer`).on(`click`, `.deletetraceableProduct`, function () {
    const ID = $(this).attr("id");
    console.log(ID);
    axios.post(`/api/deleteTraceableProduct`, { productID: ID })
        .then((res) => {
        console.log(res);
        $(`.traceableProductsContainer`).empty();
        res.data.user.observedProducts.forEach((el) => {
            $(`.traceableProductsContainer`).append(`
                    <div class="traceableProduct" id="${el._id}">
            <div class="photoContainer">
            <img src="${el.photo}" alt="Traceable products photo">
            </div>
            <div class="productInfo">
            <div class="productName">${el.productName}</div>
            <div class="productStatus">${el.status}</div>
            <div class="productPrice">${el.price}</div>
            <div class="btnContainer">
                <button class="deletetraceableProduct" id="${el._id}">Delete <i class="fa-solid fa-trash-can"></i></button>
            </div>
            </div>
        </div>
                    `);
        });
    });
});
$(`#searchBtn`).on(`click`, () => {
    axios.post(`/api/getProductInfoByUrl`, { url: $(`.searchInput`).val() })
        .then((res) => {
        console.log(res);
        $(".TrackProduct").empty();
        $(".TrackProduct").append(`
                <div class="product">
                    <div class="imgBlock">
                        <img src="${res.data.photo}" alt="${res.data.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${res.data.productName}</div>
                        <div class="status">${res.data.status}</div>
                        <div class="price">${res.data.price}</div>
                        <div class="btnContainer">
                            <button class="trackSearchProduct">Track</button>
                        </div>
                    </div>
                </div>
            `);
        $(`.addTraceableProductPopup`).css(`display`, `flex`);
        searchProduct.push({
            photo: res.data.photo,
            productName: res.data.productName,
            status: res.data.status,
            price: res.data.price
        });
        $(`.searchInput`).val('');
    });
});
$(`#userSearchBtn`).on(`click`, () => {
    axios.post(`/api/getProductInfoByUrl`, { url: $(`.userSearchInput`).val() })
        .then((res) => {
        console.log(res);
        $(".TrackProduct").empty();
        $(".TrackProduct").append(`
                <div class="product">
                    <div class="imgBlock">
                        <img src="${res.data.photo}" alt="${res.data.productName}">
                    </div>
                    <div class="infoBlock">
                        <div class="name">${res.data.productName}</div>
                        <div class="status">${res.data.status}</div>
                        <div class="price">${res.data.price}</div>
                        <div class="btnContainer">
                            <button class="trackSearchProduct">Track</button>
                        </div>
                    </div>
                </div>
            `);
        $(`.addTraceableProductPopup`).css(`display`, `flex`);
        searchProduct.push({
            photo: res.data.photo,
            productName: res.data.productName,
            status: res.data.status,
            price: res.data.price
        });
        $(`.searchInput`).val('');
    });
});
$(`.TrackProduct`).on(`click`, `.trackSearchProduct`, () => {
    $(`.addTraceableProductPopup`).css(`display`, `none`);
    axios.post(`/api/addTraceableProduct`, { product: searchProduct[searchProduct.length - 1] })
        .then((res) => {
        console.log(res);
        $(`.traceableProductsContainer`).empty();
        res.data.user.observedProducts.forEach((el) => {
            $(`.traceableProductsContainer`).append(`
                    <div class="traceableProduct" id="${el._id}">
            <div class="photoContainer">
            <img src="${el.photo}" alt="Traceable products photo">
            </div>    
            <div class="productInfo">
            <div class="productName">${el.productName}</div>
            <div class="productStatus">${el.status}</div>
            <div class="productPrice">${el.price}</div>
            <div class="btnContainer">
                <button class="deletetraceableProduct" id="${el._id}">Delete <i class="fa-solid fa-trash-can"></i></button>
            </div>
            </div>
            </div>
                    `);
        });
    });
});
//# sourceMappingURL=index.js.map