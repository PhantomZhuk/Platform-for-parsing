//type Section = "dashboard" | "users" | "services";
import Sections from "./sections.js";

void (async () => {
  try {
    const services: ServiceInDBI[] = await (
      await fetch("/admin/getServices", { method: "GET" })
    ).json();
    console.log(services);
    const sections = new Sections();
    sections.render(services);
    document
      .querySelector<HTMLUListElement>("aside ul")!
      .addEventListener("click", function (e) {
        sections.switch(e, null);
      });

    sections.services.servicesList.addEventListener("click", async function (
      this: HTMLUListElement,
      e: MouseEvent
    ): Promise<void> {
      const target = e.target as HTMLElement;
      if (target.tagName !== "BUTTON") return;
      const service = target.closest("li");
      if (!service) return;
      if (target.className === "service-fns__cancel")
        return sections.services.cancelEditingService();
      const serviceInDB = services.find(
        (serviceInDB) => serviceInDB.serviceName === service.id
      );
      if (!serviceInDB) return alert("Service not found");
      switch (target.className) {
        case "service-fns__edit":
          return sections.services.startEditingService(service);
        case "service-fns__save":
          return await sections.services.saveService(services);
        case "service-fns__delete":
          return await sections.services.deleteService(
            services,
            serviceInDB,
            service
          );
      }
    } as any);
    sections.services.htmlEl
      .querySelector(".services__header-search-btn")!
      .addEventListener("click", () => sections.services.searchServices());
  } catch (e) {
    alert("Something went wrong");
    console.log(e);
  }
})();
