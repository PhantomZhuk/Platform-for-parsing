type sectionNameT = "dashboard" | "users" | "services";
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
  dashboard: Dashboard = new Dashboard();
  users: Users = new Users();
  services: Services = new Services();
  render(servicesInDB: ServiceInDBI[]): void {
    this.dashboard.render(servicesInDB);
    this.services.render(servicesInDB);
    this.users.render();
  }
  switch(event: MouseEvent, sectionName: null): void;
  switch(event: null, sectionName: sectionNameT): void;
  switch(event: MouseEvent | null, sectionName: sectionNameT | null): void {
    if (!sectionName) sectionName = this.getSectionNameFromClick(event!);
    if (!sectionName) return;
    if (this.services.servicesList.querySelector(`.editing`))
      return alert("You can't change sections while editing a service");

    document
      .querySelectorAll<HTMLDivElement>(`[id*=template-]`)
      .forEach((section) => {
        if (section.id === `template-${sectionName}`)
          section.removeAttribute("style");
        else section.style.display = "none";
      });
  }
  getSectionNameFromClick(event: MouseEvent): sectionNameT | null {
    const target: HTMLLabelElement = event!.target as HTMLLabelElement;
    const label = target.closest("label");
    if (!label) return null;
    return label.textContent!.trim().toLowerCase() as sectionNameT;
  }
}
function useSwitches(disable: boolean): void {
  document
    .querySelectorAll<HTMLInputElement>("[name=opened-section]")
    .forEach((input) => {
      input.disabled = disable;
    });
}

class Dashboard {
  htmlEl: HTMLElement = document.getElementById(`template-dashboard`)!;
  servicesList: HTMLElement = this.htmlEl.querySelector(
    ".dashboard__services-list"
  )!;
  createServiceCard(serviceInDB: ServiceInDBI): string {
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
  paintCharts(servicesInDB: ServiceInDBI[]): void {
    this.servicesList
      .querySelectorAll("canvas")
      .forEach((canvas: HTMLCanvasElement, index: number) => {
        const visits = servicesInDB[index].visits || DEFAULT_VISITS;
        const CANVAS_WIDTH = 83;
        const CANVAS_HEIGHT = 33;
        const LEFT = 5;
        const TOP = 5;
        const xPerWeek: number = CANVAS_WIDTH / (visits.length + 1);
        const max = Math.max(...visits.map((visit) => visit.count));
        const yPerVisit: number = CANVAS_HEIGHT / max;
        const increase =
          visits[0].count >= visits[visits.length - 1].count ? false : true;
        function sketch(p: sketchFns) {
          p.setup = () => {
            p.createCanvas(
              CANVAS_WIDTH + 2 * LEFT,
              CANVAS_HEIGHT + 2 * TOP,
              canvas
            );
            p.noLoop();
          };
          p.draw = () => {
            p.stroke(
              ...((increase ? [122, 158, 68] : [255, 87, 87]) as [
                number,
                number,
                number
              ])
            );
            p.strokeWeight(2);
            p.beginShape();
            p.noFill();
            for (const visit of visits)
              p.vertex(
                xPerWeek * (visits.indexOf(visit) + 1) + LEFT,
                CANVAS_HEIGHT + TOP - visit.count * yPerVisit
              );

            p.endShape();
          };
        }
        new p5(sketch);
      });
  }
  render(servicesInDB: ServiceInDBI[]): void {
    this.servicesList.innerHTML = !servicesInDB.length
      ? /*html*/ `<div>No services found</div>`
      : servicesInDB.reduce(
          (prev: string, service: ServiceInDBI): string =>
            prev + this.createServiceCard(service),
          ""
        );
    this.paintCharts(servicesInDB);
  }
}
class Users {
  render(): void {}
}
class Services {
  htmlEl: HTMLElement = document.getElementById("template-services")!;
  servicesList: HTMLElement = this.htmlEl.querySelector(".services__list")!;
  searchInput: HTMLInputElement = this.htmlEl.querySelector<HTMLInputElement>(
    ".services__header-search"
  )!;
  createServiceCardField(
    info: string,
    className: string,
    description: string,
    readonly: boolean = true
  ): string {
    return /*html*/ `
    <div>
      <span>${description}</span>
      <textarea rows="1" type="text" data-info="${info}" class="services__item--${className}" 
      ${readonly && "readonly"}>${info}</textarea>
    </div>
    `;
  }
  createServiceCard(serviceInDB: ServiceInDBI, isNotEditing: boolean): string {
    return /*html*/ `
        <li id="${serviceInDB.serviceName}">
        <div class="service-fns"><div class="service-fns__standard"><button class="service-fns__edit">🖉</button><button class="service-fns__delete">🗑</button></div>
        <div class="service-fns__editing">
        <button class="service-fns__save">💾</button>
        <button class="service-fns__cancel">❌</button>
        </div>
        </div>
        ${this.createServiceCardField(
          serviceInDB.serviceName,
          "name",
          "Service name :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.domain,
          "domain",
          "Domain :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.name,
          "html__name",
          "html name class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.ul,
          "html__ul",
          "html ul class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.image,
          "html__image",
          "html image class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.pageLink,
          "html__pageLink",
          "html pageLink class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.price,
          "html__price",
          "html price class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          String(serviceInDB.html.availability.exists),
          "html__availability__exists",
          "Shows availability :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.html.availability.className,
          "html__availability__className",
          "Availability class :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.search.normalText,
          "search__normalText",
          "Search normal text :",
          isNotEditing
        )}
        ${this.createServiceCardField(
          serviceInDB.search.additionalText,
          "search__additionalText",
          "Search additional text :",
          isNotEditing
        )}
        </li>
        `;
  }
  render(servicesInDB: ServiceInDBI[]): void {
    this.servicesList.innerHTML = !servicesInDB.length
      ? /*html*/ `
        <div class="services__list-empty">No services found</div>
      `
      : servicesInDB.reduce(
          (prev: string, service: ServiceInDBI): string =>
            prev + this.createServiceCard(service, true),
          ""
        );
  }
  async saveService(
    servicesInDB: ServiceInDBI[],
    serviceInDB: ServiceInDBI | undefined,
    newService: boolean = false
  ): Promise<void> {
    if (!confirm("Are you sure about saving?")) return;
    const serviceChanges = this.getServiceChanges();
    if (!Object.keys(serviceChanges).length && !newService)
      return alert("Nothing to save");
    const serviceEl = this.servicesList.querySelector(".editing");
    if (!serviceEl) return alert("Get out of our console!");
    if (!serviceInDB && !newService) return alert("What are you saving?");
    if (!newService) {
      serviceChanges.serviceName = serviceChanges.name;
      delete serviceChanges.name;
      const res = await fetch(`/admin/updateServices/}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousName: serviceInDB!.serviceName,
          ...serviceChanges,
        }),
      });
      if (!res.ok) return alert("Something went wrong");
      this.updateServiceWithStructure(serviceChanges, serviceInDB!);
      for (const key in this.getServiceChanges()) {
        const textAreaClassName =
          "services__item--" + key.replaceAll(".", "__");
        const textArea = serviceEl.querySelector(
          `.${textAreaClassName}`
        ) as HTMLTextAreaElement;
        textArea.dataset.info = textArea.value;
      }
      serviceEl!.id = serviceInDB!.serviceName;
      this.cancelEditingService();
      return alert("Service saved");
    }
    serviceChanges.serviceName = serviceChanges.name;
    delete serviceChanges.name;
    const service = this.updateServiceWithStructure(serviceChanges);
    const res = await fetch(`/admin/createServices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!res.ok) {
      console.log(await res.json());
      return alert("Something went wrong");
    }
    servicesInDB.push(serviceChanges as any);
    return alert("Service saved");
  }
  async deleteService(
    servicesInDB: ServiceInDBI[],
    serviceInDB: ServiceInDBI,
    serviceEl: HTMLLIElement
  ): Promise<void> {
    if (
      this.servicesList.querySelector(".editing") ||
      !confirm("Are you sure about deletion?")
    )
      return;
    const res = await fetch(`/admin/deleteServices/${serviceInDB._id}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Service not deleted");
    serviceEl.remove();
    servicesInDB.splice(servicesInDB.indexOf(serviceInDB), 1);
    alert("Service deleted");
  }
  startEditingService(service: HTMLLIElement): void {
    if (this.servicesList.querySelector(".editing")) return;
    service.className = "editing";
    service.querySelectorAll("textarea").forEach((textarea) => {
      textarea.readOnly = false;
    });
    useSwitches(true);
  }
  cancelEditingService(): void {
    const service = this.servicesList.querySelector(".editing");
    if (!service) return;
    if (!service.id) return service.remove();
    service.removeAttribute("class");
    service.querySelectorAll("textarea").forEach((textarea) => {
      textarea.readOnly = true;
      if (textarea.value !== textarea.dataset.info!)
        textarea.value = textarea.dataset.info!;
    });
    useSwitches(false);
  }
  getServiceChanges(): { [key: string]: string };
  getServiceChanges(): Array<string> | { [key: string]: string } {
    const textAreas = Array.from(
      this.servicesList.querySelector(".editing")!.querySelectorAll("textarea")
    );
    const changes: { [key: string]: string } = {};
    textAreas.forEach(function (
      this: typeof changes,
      textArea: HTMLTextAreaElement
    ): void {
      if (textArea.dataset.info === textArea.value) return;
      const key = textArea.className
        .replace("services__item--", "")
        .replaceAll("__", ".");
      this[key] = textArea.value;
    },
    changes);
    return changes;
  }
  updateServiceWithStructure(
    structure: { [key: string]: string },
    serviceInDB: ServiceInDBI = {
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
    }
  ): ServiceInDBI {
    /* structure may look like {"serviceName": string, "html.availability.exists":boolean,*/
    Object.keys(structure).forEach(function (key): any {
      const keyParts = key.split(".");
      if (keyParts.length === 1)
        return ((serviceInDB as any)[key] = structure[key]);
      function goToPath(obj: any, path: string) {
        if (!path) return obj;
        const properties = path.split(".");
        const nextProperty = properties.shift()!;
        if (typeof obj[nextProperty] == "string")
          return (obj[nextProperty] = structure[key]);
        return goToPath(obj[nextProperty], properties.join("."));
      }
      goToPath(serviceInDB, key);
    });
    console.log(serviceInDB);
    return serviceInDB;
  }
  searchServices(): void {
    const servicesEls =
      this.htmlEl.querySelectorAll<HTMLLIElement>(".services__list>li");
    const searchRegex = new RegExp(`${this.searchInput.value}`, "i");
    servicesEls.forEach((serviceEl) => {
      if (searchRegex.test(serviceEl.id)) serviceEl.removeAttribute("style");
      else serviceEl.style.display = "none";
    });
  }
  addService(): void {
    if (this.servicesList.querySelector(".editing")) return alert("Save first");
    this.servicesList.insertAdjacentHTML(
      "afterbegin",
      this.createServiceCard(
        {
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
        },
        false
      )
    );
    this.servicesList.querySelector("li")!.className = "editing";
    this.servicesList
      .querySelector<HTMLTextAreaElement>("services__item--name")
      ?.focus();
    useSwitches(true);
  }
}
