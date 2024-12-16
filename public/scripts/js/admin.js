"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield (yield fetch("/admin/getServices", { method: "GET" })).json();
        function fillServicesList(html) {
            return __awaiter(this, void 0, void 0, function* () {
                if (services.length == 0)
                    return html.replace(/<ul class="services__list"><\/ul>/g, 
                    /*html*/ `<ul class="services__list"><div class="services__table-empty">No services found</div></div><div class="services__visits">`);
                function setHTMLPart(info, className, desc) {
                    return /*html*/ `
                <div class="services__item services__item--${className}">
                  <span>${desc}</span>
                  <textarea rows="1" type="text" readonly>${info}</textarea>
                </div>
                `;
                }
                return html.replace(/<ul class="services__list"><\/ul>/g, 
                /*html*/ `<ul class="services__list">` +
                    services.reduce((prev, service) => {
                        return (prev +
                            /*html*/ `
              <li id="${service.serviceName}">
              <div class="service-fns"><button class="service-fns__edit">🖉</button><button class="service-fns__delete">🗑</button></div>
              ${setHTMLPart(service.serviceName, "name", "Service name :")}
              ${setHTMLPart(service.domain, "domain", "Domain :")}
              ${setHTMLPart(service.html.name, "html__name", "html name class :")}
              ${setHTMLPart(service.html.ul, "html__ul", "html ul class :")}
              ${setHTMLPart(service.html.image, "html__image", "html image class :")}
              ${setHTMLPart(service.html.pageLink, "html__link", "html pageLink class :")}
              ${setHTMLPart(service.html.price, "html__price", "html price class :")}
              ${setHTMLPart(String(service.html.availability.exists), "html__availability-exists", "Shows availability :")}
              ${setHTMLPart(service.html.availability.className, "html__availability-class", "Availability class :")}
              ${setHTMLPart(service.search.normalText, "search__normal", "Search normal text :")}
              ${setHTMLPart(service.search.additionalText, "search__additional", "Search additional text :")}
              </li>
              `);
                    }, "") +
                    "</ul>");
            });
        }
        function switchSection(event) {
            return __awaiter(this, void 0, void 0, function* () {
                const target = event.target;
                if (target.tagName !== "LABEL")
                    return;
                const sectionName = target.textContent.trim();
                const sectionNode = document.querySelector("section");
                sectionNode.innerHTML = "";
                let sectionHTML = document.getElementById(`template-${sectionName.toLowerCase()}`).innerHTML;
                switch (sectionName) {
                    case "Dashboard":
                        break;
                    case "Users":
                        break;
                    case "Services":
                        sectionHTML = yield fillServicesList(sectionHTML);
                        break;
                }
                sectionNode.insertAdjacentHTML("afterbegin", sectionHTML);
            });
        }
        document
            .querySelector("aside ul")
            .addEventListener("click", switchSection);
    }
    catch (e) {
        alert(e);
    }
}))();
//# sourceMappingURL=admin.js.map