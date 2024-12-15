type Sections = "Dashboard" | "Users" | "Services";
interface Service {
  name: string;
  domain: string;
  html: {
    name: string;
    pageLink: string;
    price: string;
    ul: string;
    availability: {
      exists: boolean;
      className: string;
    };
  };
  search: {
    normalText: string;
    additionalText: string;
  };
}
(() => {
  try {
    async function fillServicesTable(html: string): Promise<string> {
      const services = [];
      const data: Service[] = await (
        await fetch("/admin/getServices", { method: "GET" })
      ).json();
      data.length > 0 && services.push(...data);
      const regex =
        /(<div class="services__table">)\n?.*\n.*\n.*\n.*\n.*\n.*\n.*/g;
      if (services.length == 0)
        return html.replace(
          regex,
          /*html*/ `<div class="services__table"><div class="services__table-empty">No services found</div></div><div class="services__visits">`
        );
      return html.replace(
        regex,
        services.reduce((prev, service) => {
          return (
            prev +
            /*html*/ `<div class="services__table-row">
                <span>${service.name}</span>
                <span>${service.domain}</span>
                <div class="services__table-actions">
                  <button class="services__table-edit">Edit</button>
                  <button class="services__table-delete">Delete</button>
                </div>
              </div>`
          );
        }, "")
      );
    }
    async function switchSection(event: MouseEvent) {
      const target: HTMLLabelElement = event.target as HTMLLabelElement;
      if (target.tagName !== "LABEL") return;
      const sectionName = target.textContent!.trim() as Sections;
      const sectionNode = document.querySelector("section")!;
      sectionNode.innerHTML = "";
      let sectionHTML = (
        document.getElementById(
          `template-${sectionName.toLowerCase()}`
        )! as HTMLTemplateElement
      ).innerHTML;
      switch (sectionName) {
        case "Dashboard":
          break;
        case "Users":
          break;
        case "Services":
          sectionHTML = await fillServicesTable(sectionHTML);
          break;
      }
      sectionNode.insertAdjacentHTML("afterbegin", sectionHTML);
    }
    document
      .querySelector<HTMLUListElement>("aside ul")!
      .addEventListener("click", switchSection);
  } catch (e) {
    alert(e);
  }
})();
