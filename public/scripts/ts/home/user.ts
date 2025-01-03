function registrationCheck(): void {
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
            $(`.traceableProductsContainer`).empty();
            res.data.user.observedProducts.forEach((el: IProduct) => {
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
                    `)
            })
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
        })
})

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
        })
})

$(`.closeUserAccountContainer`).on(`click`, () => {
    $(`.userAccountContainer`).css(`display`, `none`);
    $(`.wrap`).css(`display`, `flex`);
    $(`.traceableProductsPopup`).css(`display`, `none`);
    $(`#trackableProductsBtn`).css(`background-color`, `#452497`);
    $(`#trackableProductsBtn`).css(`box-shadow`, `0 0 5px 1px #452497`);
    $(`.wrap header`).css(`border-bottom-right-radius`, `20px`);
    $(`.traceableProductsPopup`).css(`display`, `none`);
    $(`#trackableProductsBtnUser`).css(`background-color`, `#452497`);
    $(`#trackableProductsBtnUser`).css(`box-shadow`, `0 0 5px 1px #452497`);
    $(`.userAccountContainer header`).css(`border-bottom-right-radius`, `20px`);
    traceableProductsPopup = false;
})

$(`#editProfileBtn`).on(`click`, () => {
    $(`.updateUserInfo`).css(`display`, `flex`);
    $(`.infoContainer`).css(`display`, `none`);
    registrationCheck();
})

$(`#cancelUpdateUserInfo`).on(`click`, () => {
    $(`.updateUserInfo`).css(`display`, `none`);
    $(`.infoContainer`).css(`display`, `flex`);
})

$(`#deleteUserBtn`).on(`click`, () => {
    axios.post(`/api/deleteUser`, {}, { withCredentials: true })
        .then((res) => {
            $(`#userBtn`).removeClass(`openUserInfo`);
            $(`#userBtn`).addClass(`logIn`);
            $(`#userBtn`).html(`Log in`);
            $(`.userAccountContainer`).css(`display`, `none`);
            $(`.wrap`).css(`display`, `flex`);
            console.log(res.data);
        })
})