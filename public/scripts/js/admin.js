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
(() => {
    try {
        function fillServicesTable(html) {
            return __awaiter(this, void 0, void 0, function* () {
                const services = [];
                const data = yield (yield fetch("/admin/getServices", { method: "GET" })).json();
                data.length > 0 && services.push(...data);
                const regex = /(<div class="services__table">)\n?.*\n.*\n.*\n.*\n.*\n.*\n.*/g;
                if (services.length == 0)
                    return html.replace(regex, 
                    /*html*/ `<div class="services__table"><div class="services__table-empty">No services found</div></div><div class="services__visits">`);
                return html.replace(regex, services.reduce((prev, service) => {
                    return (prev +
                        /*html*/ `<div class="services__table-row">
                <span>${service.name}</span>
                <span>${service.domain}</span>
                <div class="services__table-actions">
                  <button class="services__table-edit">Edit</button>
                  <button class="services__table-delete">Delete</button>
                </div>
              </div>`);
                }, ""));
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
                        sectionHTML = yield fillServicesTable(sectionHTML);
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
})();
//# sourceMappingURL=admin.js.map