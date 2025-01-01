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
function registrationCheck() {
    axios.get('/api/protected', { withCredentials: true })
        .then(res => {
        console.log(res.data);
        $(`#userBtn`).removeClass(`logIn`);
        $(`#userBtn`).addClass(`openUserInfo`);
        $(`#userBtn`).html(`<i class="fa-solid fa-user"></i>`);
        $(`#userBtn`).css(`width`, `40px`);
        $(`.userName`).html(`Name: <span> ${res.data.user.login}</span>`);
        $(`.userEmail`).html(`Email: <span> ${res.data.user.email}</span>`);
        $(`.userPhone`).html(`Phone: <span> ${res.data.user.phone}</span>`);
        $(`#nameInputUndate`).val(res.data.user.login);
        $(`#emailInputUpdate`).val(res.data.user.email);
        $(`#telInputUpdate`).val(res.data.user.phone);
    })
        .catch(err => {
        axios.post('/api/refreshToken', {}, { withCredentials: true })
            .then(res => {
            console.log(`Refresh token: ${res.data.refreshToken}`);
            console.log(res.data);
            registrationCheck();
        })
            .catch(err => console.error(err));
        console.log(err);
    });
}
registrationCheck();
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
// getRandomProducts();
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
$(`.closeAddProductFreezerPopup`).on(`click`, () => {
    $(`.addProductFreezerPopup`).css(`display`, `none`);
});
$(".TrackProduct").on("click", ".track", function () {
    const ID = $(this).attr("id");
    axios.post(`/api/goodSubscription`, { goodId: ID })
        .then((res) => console.log(res));
});
$(".catalogElement").on("click", function () {
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
        $(".randomProductContainer").css("display", "none");
        $(".catalogProductContainer").css("display", "flex");
        $(`.catalogTitle`).text(urlData[ID]);
    });
});
$(`#openRegisterPopup`).on(`click`, () => {
    $(`.registerForm`).css(`display`, `flex`);
    $(`.logInForm`).css(`display`, `none`);
});
$(`#openLogInPopup`).on(`click`, () => {
    $(`.registerForm`).css(`display`, `none`);
    $(`.logInForm`).css(`display`, `flex`);
});
$(`.closeAuthPopup`).on(`click`, () => {
    $(`.registerForm`).css(`display`, `none`);
    $(`.logInForm`).css(`display`, `flex`);
    $(`.authPopup`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `blur(0)`);
});
$(`#userBtn`).on(`click`, () => {
    if ($(`#userBtn`).hasClass(`logIn`)) {
        $(`.authPopup`).css(`display`, `flex`);
        $(`.wrap`).css(`filter`, `blur(1.5px)`);
    }
    else if ($(`#userBtn`).hasClass(`openUserInfo`)) {
        $(`.userAccountContainer`).css(`display`, `flex`);
        $(`.wrap`).css(`display`, `none`);
    }
});
$(`#logInBtn`).on(`click`, () => {
    console.log($(`#emailLogInInput`).val(), $(`#passwordLogInInput`).val());
    axios.post(`/api/signIn`, { email: $(`#emailLogInInput`).val(), password: $(`#passwordLogInInput`).val() })
        .then((res) => {
        $(`.authPopup`).css(`display`, `none`);
        $(`.wrap`).css(`filter`, `blur(0)`);
        $(`#userBtn`).removeClass(`logIn`);
        $(`#userBtn`).addClass(`openUserInfo`);
        $(`#userBtn`).html(`<i class="fa-solid fa-user"></i>`);
        $(`#userBtn`).css(`width`, `40px`);
        $(`.userName`).html(`Name: <span> ${res.data.user.login}</span>`);
        $(`.userEmail`).html(`Email: <span> ${res.data.user.email}</span>`);
        $(`.userPhone`).html(`Phone: <span> ${res.data.user.phone}</span>`);
        $(`#nameInputUndate`).val(res.data.user.login);
        $(`#emailInputUpdate`).val(res.data.user.email);
        $(`#telInputUpdate`).val(res.data.user.phone);
        $(`#emailLogInInput`).val(``);
        $(`#passwordLogInInput`).val(``);
        console.log(res.data);
    })
        .catch((err) => {
        notification(`Email or password is incorrect`);
        console.log(err);
    });
});
$(`#sendCodeOnEmail`).on(`click`, () => {
    const regexLogin = /^[a-zA-Z0-9]{3,20}$/;
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexTel = /^\+?[1-9]\d{1,14}$/;
    const regexPassword = /^[a-zA-Z0-9]{8,20}$/;
    const login = $(`#loginRegisterInput`).val();
    const email = $(`#emailRegisterInput`).val();
    const tel = $(`#telRegisterInput`).val();
    const password = $(`#passwordRegisterInput`).val();
    if (regexLogin.test(login)) {
        if (regexEmail.test(email)) {
            if (regexTel.test(tel)) {
                if (regexPassword.test(password)) {
                    axios.post(`/api/mailConfirmation`, { email: $(`#emailRegisterInput`).val() })
                        .then((res) => {
                        $(`.authPopup`).css(`display`, `none`);
                        $(`.verifyCodePopup`).css(`display`, `flex`);
                        $(`.wrap`).css(`filter`, `blur(1.5px)`);
                        console.log(res.data);
                    });
                }
                else {
                    notification(`Password should be 8-20 characters long and consist of uppercase and lowercase letters and numbers`);
                }
            }
            else {
                notification(`Phone is not valid`);
            }
        }
        else {
            notification(`Email is not valid`);
        }
    }
    else {
        notification(`Login is not valid`);
    }
});
$(`#registerBtn`).on(`click`, () => {
    axios.post(`/api/signUp`, { login: $(`#loginRegisterInput`).val(), email: $(`#emailRegisterInput`).val(), password: $(`#passwordRegisterInput`).val(), phone: $(`#telRegisterInput`).val(), userRandomCode: $(`#verifyCodeInput`).val() })
        .then((res) => {
        $(`.verifyCodePopup`).css(`display`, `none`);
        $(`.wrap`).css(`filter`, `blur(0)`);
        $(`#userBtn`).removeClass(`logIn`);
        $(`#userBtn`).addClass(`openUserInfo`);
        $(`#userBtn`).html(`<i class="fa-solid fa-user"></i>`);
        $(`.userName`).html(`Name: <span> ${res.data.user.login}</span>`);
        $(`.userEmail`).html(`Email: <span> ${res.data.user.email}</span>`);
        $(`.userPhone`).html(`Phone: <span> ${res.data.user.phone}</span>`);
        $(`#nameInputUndate`).val(res.data.user.login);
        $(`#emailInputUpdate`).val(res.data.user.email);
        $(`#telInputUpdate`).val(res.data.user.phone);
        $(`#emailRegisterInput`).val(``);
        $(`#passwordRegisterInput`).val(``);
        $(`#loginRegisterInput`).val(``);
        $(`#telRegisterInput`).val(``);
        console.log(res.data);
    });
});
$(`.closeUserAccountContainer`).on(`click`, () => {
    $(`.userAccountContainer`).css(`display`, `none`);
    $(`.wrap`).css(`display`, `flex`);
});
$(`#editProfileBtn`).on(`click`, () => {
    $(`.updateUserInfo`).css(`display`, `flex`);
    $(`.infoContainer`).css(`display`, `none`);
    registrationCheck();
});
$(`#cancelUpdateUserInfo`).on(`click`, () => {
    $(`.updateUserInfo`).css(`display`, `none`);
    $(`.infoContainer`).css(`display`, `flex`);
});
$(`#updateUserInfoBtn`).on(`click`, () => {
    axios.post(`/api/updateUserInfo`, { login: $(`#nameInputUndate`).val(), email: $(`#emailInputUpdate`).val(), phone: $(`#telInputUpdate`).val() }, { withCredentials: true })
        .then((res) => {
        $(`.updateUserInfo`).css(`display`, `none`);
        $(`.infoContainer`).css(`display`, `flex`);
        $(`.userName`).html(`Name: <span> ${res.data.user.login}</span>`);
        $(`.userEmail`).html(`Email: <span> ${res.data.user.email}</span>`);
        $(`.userPhone`).html(`Phone: <span> ${res.data.user.phone}</span>`);
        $(`#nameInputUndate`).val(res.data.user.login);
        $(`#emailInputUpdate`).val(res.data.user.email);
        $(`#telInputUpdate`).val(res.data.user.phone);
        console.log(res.data);
    })
        .catch((err) => {
        console.log(err);
    });
});
$(`#logOutBtn`).on(`click`, () => {
    axios.post(`/api/logOut`, {}, { withCredentials: true })
        .then((res) => {
        $(`#userBtn`).removeClass(`openUserInfo`);
        $(`#userBtn`).addClass(`logIn`);
        $(`#userBtn`).html(`Log in`);
        $(`.userAccountContainer`).css(`display`, `none`);
        $(`.wrap`).css(`display`, `flex`);
        $(`#userBtn`).css(`width`, `80px`);
        console.log(res.data);
    })
        .catch((err) => {
        console.log(err);
    });
});
$(`#deleteUserBtn`).on(`click`, () => {
    axios.post(`/api/deleteUser`, {}, { withCredentials: true })
        .then((res) => {
        $(`#userBtn`).removeClass(`openUserInfo`);
        $(`#userBtn`).addClass(`logIn`);
        $(`#userBtn`).html(`Log in`);
        $(`.userAccountContainer`).css(`display`, `none`);
        $(`.wrap`).css(`display`, `flex`);
        console.log(res.data);
    });
});
//# sourceMappingURL=index.js.map