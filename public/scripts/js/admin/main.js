var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//type Section = "dashboard" | "users" | "services";
import Sections from "./sections.js";
void (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield (yield fetch("/admin/getServices", { method: "GET" })).json();
        console.log(services);
        const sections = new Sections();
        sections.render(services);
        document
            .querySelector("aside ul")
            .addEventListener("click", function (e) {
            sections.switch(e, null);
        });
        sections.services.servicesList.addEventListener("click", function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                const target = e.target;
                if (target.tagName !== "BUTTON")
                    return;
                const service = target.closest("li");
                if (!service)
                    return;
                if (target.className === "service-fns__cancel")
                    return sections.services.cancelEditingService();
                const serviceInDB = services.find((serviceInDB) => serviceInDB.serviceName === service.id);
                if (!serviceInDB && service.id !== "")
                    return alert("Service not found");
                switch (target.className) {
                    case "service-fns__edit":
                        return sections.services.startEditingService(service);
                    case "service-fns__save":
                        return yield sections.services.saveService(services, serviceInDB, service.id === "");
                    case "service-fns__delete":
                        return yield sections.services.deleteService(services, serviceInDB, service);
                }
            });
        });
        sections.services.htmlEl
            .querySelector(".services__header-search-btn")
            .addEventListener("click", () => sections.services.searchServices());
        sections.services.htmlEl
            .querySelector(".services__header-add")
            .addEventListener("click", () => sections.services.addService());
    }
    catch (e) {
        alert("Something went wrong");
        console.log(e);
    }
}))();
//# sourceMappingURL=main.js.map