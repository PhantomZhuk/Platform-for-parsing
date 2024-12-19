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
void (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield (yield fetch("/admin/getServices", { method: "GET" })).json();
        function fillAllSections() {
            function fillServicesSection() {
                const servicesListEl = document.querySelector(".services__list");
                function setHTMLPart(info, className, desc) {
                    return /*html*/ `
                  <div class="services__item services__item--${className}">
                    <span>${desc}</span>
                    <textarea rows="1" type="text" readonly>${info}</textarea>
                  </div>
                  `;
                }
                if (services.length == 0)
                    servicesListEl.innerHTML = /*html*/ `<ul class="services__list"><div class="services__table-empty">No services found</div></div><div class="services__visits">`;
                else
                    servicesListEl.innerHTML = services.reduce((prev, service) => {
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
                    }, "");
            }
            function fillDashboardSection() {
                const dashboardEl = document.getElementById("template-dashboard");
                console.log(dashboardEl);
                const servicesListEl = dashboardEl.querySelector(".dashboard__services-list");
                if (services.length == 0)
                    servicesListEl.innerHTML = /*html*/ `<div class="services__table-empty">No services found</div>`;
                else
                    servicesListEl.innerHTML = services.reduce((prev, service) => {
                        return (prev +
                            /*html*/ `<li class="dashboard__service">
                <h4 class="dashboard__service-name">${service.serviceName}</h4>
                <p class="dashboard__service-increase">+10</p>
                <div class="dashboard__service-visits">
                  <span>Visitors</span>
                  <span style="font-size: 18px">100</span>
                </div>
                <canvas id="dashboard__service-chart-${service.serviceName}"></canvas>
              </li>`);
                    }, "");
            }
            fillDashboardSection();
            fillServicesSection();
        }
        function switchSection(event, SectionName) {
            const sectionName = (() => {
                if (SectionName)
                    return SectionName;
                const target = event.target;
                const label = target.closest("label");
                if (!label)
                    return null;
                return label.textContent.trim().toLowerCase();
            })();
            if (!sectionName)
                return;
            document
                .querySelectorAll(`[id*=template-]`)
                .forEach((template) => {
                if (template.id === `template-${sectionName}`)
                    template.removeAttribute("style");
                else
                    template.style.display = "none";
            });
        }
        document
            .querySelector("aside ul")
            .addEventListener("click", function (e) {
            switchSection(e, null);
        });
        fillAllSections();
    }
    catch (e) {
        alert(e);
    }
}))();
//# sourceMappingURL=admin.js.map