"use strict";
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
//# sourceMappingURL=auth.js.map