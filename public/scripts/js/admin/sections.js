var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const today = new Date();
const DEFAULT_VISITS = [
    { count: 1, date: today.toISOString().split("T")[0] },
    { count: 0, date: "" },
    { count: 1, date: "" },
    { count: 0, date: "" },
    { count: 1, date: "" },
    { count: 0, date: "" },
];
export default class Sections {
    constructor() {
        Object.defineProperty(this, "dashboard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Dashboard()
        });
        Object.defineProperty(this, "users", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Users()
        });
        Object.defineProperty(this, "services", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Services()
        });
    }
    render(servicesInDB) {
        this.dashboard.render(servicesInDB);
        this.services.render(servicesInDB);
        this.users.render();
    }
    switch(event, sectionName) {
        if (!sectionName)
            sectionName = this.getSectionNameFromClick(event);
        if (!sectionName)
            return;
        if (this.services.servicesList.querySelector(`.editing`))
            return alert("You can't change sections while editing a service");
        document
            .querySelectorAll(`[id*=template-]`)
            .forEach((section) => {
            if (section.id === `template-${sectionName}`)
                section.removeAttribute("style");
            else
                section.style.display = "none";
        });
    }
    getSectionNameFromClick(event) {
        const target = event.target;
        const label = target.closest("label");
        if (!label)
            return null;
        return label.textContent.trim().toLowerCase();
    }
}
function useSwitches(disable) {
    document
        .querySelectorAll("[name=opened-section]")
        .forEach((input) => {
        input.disabled = disable;
    });
}
class Dashboard {
    constructor() {
        Object.defineProperty(this, "htmlEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: document.getElementById(`template-dashboard`)
        });
        Object.defineProperty(this, "servicesList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.htmlEl.querySelector(".dashboard__services-list")
        });
    }
    createServiceCard(serviceInDB) {
        const visits = serviceInDB.visits || DEFAULT_VISITS;
        const increase = visits[visits.length - 1].count - visits[0].count;
        const color = increase > 0 ? "rgb(89 255 0)" : "rgb(255 87 87)";
        const allAmount = visits.reduce((prev, v) => prev + v.count, 0);
        return /*html*/ `<li class="dashboard__service">
      <h4 class="dashboard__service-name">${serviceInDB.serviceName}</h4>
      <p class="dashboard__service-increase" style="color: ${color}">
      ${increase > 0 ? `+${increase}` : `${increase}`}
      </p>
      <div class="dashboard__service-visits">
        <span>Last visits</span>
        <span style="font-size:18px; color: ${color}">
        ${allAmount}
        </span>
      </div>
      <canvas id="dashboard__service-chart-${serviceInDB.serviceName}"></canvas>
    </li>`;
    }
    paintCharts(servicesInDB) {
        this.servicesList
            .querySelectorAll("canvas")
            .forEach((canvas, index) => {
            const visits = servicesInDB[index].visits || DEFAULT_VISITS;
            const CANVAS_WIDTH = 83;
            const CANVAS_HEIGHT = 33;
            const LEFT = 5;
            const TOP = 5;
            const xPerWeek = CANVAS_WIDTH / (visits.length + 1);
            const max = Math.max(...visits.map((visit) => visit.count));
            const yPerVisit = CANVAS_HEIGHT / max;
            const increase = visits[0].count >= visits[visits.length - 1].count ? false : true;
            function sketch(p) {
                p.setup = () => {
                    p.createCanvas(CANVAS_WIDTH + 2 * LEFT, CANVAS_HEIGHT + 2 * TOP, canvas);
                    p.noLoop();
                };
                p.draw = () => {
                    p.stroke(...(increase ? [122, 158, 68] : [255, 87, 87]));
                    p.strokeWeight(2);
                    p.beginShape();
                    p.noFill();
                    for (const visit of visits)
                        p.vertex(xPerWeek * (visits.indexOf(visit) + 1) + LEFT, CANVAS_HEIGHT + TOP - visit.count * yPerVisit);
                    p.endShape();
                };
            }
            new p5(sketch);
        });
    }
    render(servicesInDB) {
        this.servicesList.innerHTML = !servicesInDB.length
            ? /*html*/ `<div>No services found</div>`
            : servicesInDB.reduce((prev, service) => prev + this.createServiceCard(service), "");
        this.paintCharts(servicesInDB);
    }
}
class Users {
    render() { }
}
class Services {
    constructor() {
        Object.defineProperty(this, "htmlEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: document.getElementById("template-services")
        });
        Object.defineProperty(this, "servicesList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.htmlEl.querySelector(".services__list")
        });
        Object.defineProperty(this, "searchInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.htmlEl.querySelector(".services__header-search")
        });
    }
    createServiceCardField(info, className, description, readonly = true) {
        return /*html*/ `
    <div>
      <span>${description}</span>
      <textarea rows="1" type="text" data-info="${info}" class="services__item--${className}" 
      ${readonly && "readonly"}>${info}</textarea>
    </div>
    `;
    }
    createServiceCard(serviceInDB, isNotEditing) {
        return /*html*/ `
        <li id="${serviceInDB.serviceName}">
        <div class="service-fns"><div class="service-fns__standard"><button class="service-fns__edit">🖉</button><button class="service-fns__delete">🗑</button></div>
        <div class="service-fns__editing">
        <button class="service-fns__save">💾</button>
        <button class="service-fns__cancel">❌</button>
        </div>
        </div>
        ${this.createServiceCardField(serviceInDB.serviceName, "name", "Service name :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.domain, "domain", "Domain :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.name, "html__name", "html name class :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.ul, "html__ul", "html ul class :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.image, "html__image", "html image class :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.pageLink, "html__pageLink", "html pageLink class :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.price, "html__price", "html price class :", isNotEditing)}
        ${this.createServiceCardField(String(serviceInDB.html.availability.exists), "html__availability__exists", "Shows availability :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.html.availability.className, "html__availability__className", "Availability class :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.search.normalText, "search__normalText", "Search normal text :", isNotEditing)}
        ${this.createServiceCardField(serviceInDB.search.additionalText, "search__additionalText", "Search additional text :", isNotEditing)}
        </li>
        `;
    }
    render(servicesInDB) {
        this.servicesList.innerHTML = !servicesInDB.length
            ? /*html*/ `
        <div class="services__list-empty">No services found</div>
      `
            : servicesInDB.reduce((prev, service) => prev + this.createServiceCard(service, true), "");
    }
    saveService(servicesInDB_1, serviceInDB_1) {
        return __awaiter(this, arguments, void 0, function* (servicesInDB, serviceInDB, newService = false) {
            if (!confirm("Are you sure about saving?"))
                return;
            const serviceChanges = this.getServiceChanges();
            if (!Object.keys(serviceChanges).length && !newService)
                return alert("Nothing to save");
            const serviceEl = this.servicesList.querySelector(".editing");
            if (!serviceEl)
                return alert("Get out of our console!");
            if (!serviceInDB && !newService)
                return alert("What are you saving?");
            if (!newService) {
                serviceChanges.serviceName = serviceChanges.name;
                delete serviceChanges.name;
                const res = yield fetch(`/admin/updateServices/}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(Object.assign({ previousName: serviceInDB.serviceName }, serviceChanges)),
                });
                if (!res.ok)
                    return alert("Something went wrong");
                this.updateServiceWithStructure(serviceChanges, serviceInDB);
                for (const key in this.getServiceChanges()) {
                    const textAreaClassName = "services__item--" + key.replaceAll(".", "__");
                    const textArea = serviceEl.querySelector(`.${textAreaClassName}`);
                    textArea.dataset.info = textArea.value;
                }
                serviceEl.id = serviceInDB.serviceName;
                this.cancelEditingService();
                return alert("Service saved");
            }
            serviceChanges.serviceName = serviceChanges.name;
            delete serviceChanges.name;
            const service = this.updateServiceWithStructure(serviceChanges);
            const res = yield fetch(`/admin/createServices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(service),
            });
            if (!res.ok) {
                console.log(yield res.json());
                return alert("Something went wrong");
            }
            servicesInDB.push(serviceChanges);
            return alert("Service saved");
        });
    }
    deleteService(servicesInDB, serviceInDB, serviceEl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.servicesList.querySelector(".editing") ||
                !confirm("Are you sure about deletion?"))
                return;
            const res = yield fetch(`/admin/deleteServices/${serviceInDB._id}`, {
                method: "DELETE",
            });
            if (!res.ok)
                return alert("Service not deleted");
            serviceEl.remove();
            servicesInDB.splice(servicesInDB.indexOf(serviceInDB), 1);
            alert("Service deleted");
        });
    }
    startEditingService(service) {
        if (this.servicesList.querySelector(".editing"))
            return;
        service.className = "editing";
        service.querySelectorAll("textarea").forEach((textarea) => {
            textarea.readOnly = false;
        });
        useSwitches(true);
    }
    cancelEditingService() {
        const service = this.servicesList.querySelector(".editing");
        if (!service)
            return;
        if (!service.id)
            return service.remove();
        service.removeAttribute("class");
        service.querySelectorAll("textarea").forEach((textarea) => {
            textarea.readOnly = true;
            if (textarea.value !== textarea.dataset.info)
                textarea.value = textarea.dataset.info;
        });
        useSwitches(false);
    }
    getServiceChanges() {
        const textAreas = Array.from(this.servicesList.querySelector(".editing").querySelectorAll("textarea"));
        const changes = {};
        textAreas.forEach(function (textArea) {
            if (textArea.dataset.info === textArea.value)
                return;
            const key = textArea.className
                .replace("services__item--", "")
                .replaceAll("__", ".");
            this[key] = textArea.value;
        }, changes);
        return changes;
    }
    updateServiceWithStructure(structure, serviceInDB = {
        serviceName: "",
        domain: "",
        html: {
            name: "",
            availability: {
                exists: false,
                className: "",
            },
            ul: "",
            image: "",
            pageLink: "",
            price: "",
        },
        search: {
            normalText: "",
            additionalText: "",
        },
    }) {
        /* structure may look like {"serviceName": string, "html.availability.exists":boolean,*/
        Object.keys(structure).forEach(function (key) {
            const keyParts = key.split(".");
            if (keyParts.length === 1)
                return (serviceInDB[key] = structure[key]);
            function goToPath(obj, path) {
                if (!path)
                    return obj;
                const properties = path.split(".");
                const nextProperty = properties.shift();
                if (typeof obj[nextProperty] == "string")
                    return (obj[nextProperty] = structure[key]);
                return goToPath(obj[nextProperty], properties.join("."));
            }
            goToPath(serviceInDB, key);
        });
        console.log(serviceInDB);
        return serviceInDB;
    }
    searchServices() {
        const servicesEls = this.htmlEl.querySelectorAll(".services__list>li");
        const searchRegex = new RegExp(`${this.searchInput.value}`, "i");
        servicesEls.forEach((serviceEl) => {
            if (searchRegex.test(serviceEl.id))
                serviceEl.removeAttribute("style");
            else
                serviceEl.style.display = "none";
        });
    }
    addService() {
        var _a;
        if (this.servicesList.querySelector(".editing"))
            return alert("Save first");
        this.servicesList.insertAdjacentHTML("afterbegin", this.createServiceCard({
            serviceName: "",
            html: {
                name: "",
                availability: {
                    exists: false,
                    className: "",
                },
                pageLink: "",
                price: "",
                ul: "",
                image: "",
            },
            search: {
                normalText: "",
                additionalText: "",
            },
            _id: "",
            domain: "",
            visits: [
                { count: 0, date: "" },
                { count: 0, date: "" },
                { count: 0, date: "" },
                { count: 0, date: "" },
                { count: 0, date: "" },
                { count: 0, date: "" },
            ],
        }, false));
        this.servicesList.querySelector("li").className = "editing";
        (_a = this.servicesList
            .querySelector("services__item--name")) === null || _a === void 0 ? void 0 : _a.focus();
        useSwitches(true);
    }
}
//# sourceMappingURL=sections.js.map