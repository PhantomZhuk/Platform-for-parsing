type Sections = "Dashboard" | "Users" | "Services";
interface Service {
  serviceName: string;
  domain: string;
  html: {
    name: string;
    pageLink: string;
    price: string;
    ul: string;
    image: string;
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
(async () => {
  try {
    const services: Service[] = await (
      await fetch("/admin/getServices", { method: "GET" })
    ).json();
    async function fillServicesList(html: string): Promise<string> {
      if (services.length == 0)
        return html.replace(
          /<ul class="services__list"><\/ul>/g,
          /*html*/ `<ul class="services__list"><div class="services__table-empty">No services found</div></div><div class="services__visits">`
        );
      function setHTMLPart(info: string, className: string, desc: string) {
        return /*html*/ `
                <div class="services__item services__item--${className}">
                  <span>${desc}</span>
                  <textarea rows="1" type="text" readonly>${info}</textarea>
                </div>
                `;
      }
      return html.replace(
        /<ul class="services__list"><\/ul>/g,
        /*html*/ `<ul class="services__list">` +
          services.reduce((prev, service) => {
            return (
              prev +
              /*html*/ `
              <li id="${service.serviceName}">
              <div class="service-fns"><button class="service-fns__edit">🖉</button><button class="service-fns__delete">🗑</button></div>
              ${setHTMLPart(service.serviceName, "name", "Service name :")}
              ${setHTMLPart(service.domain, "domain", "Domain :")}
              ${setHTMLPart(
                service.html.name,
                "html__name",
                "html name class :"
              )}
              ${setHTMLPart(service.html.ul, "html__ul", "html ul class :")}
              ${setHTMLPart(
                service.html.image,
                "html__image",
                "html image class :"
              )}
              ${setHTMLPart(
                service.html.pageLink,
                "html__link",
                "html pageLink class :"
              )}
              ${setHTMLPart(
                service.html.price,
                "html__price",
                "html price class :"
              )}
              ${setHTMLPart(
                String(service.html.availability.exists),
                "html__availability-exists",
                "Shows availability :"
              )}
              ${setHTMLPart(
                service.html.availability.className,
                "html__availability-class",
                "Availability class :"
              )}
              ${setHTMLPart(
                service.search.normalText,
                "search__normal",
                "Search normal text :"
              )}
              ${setHTMLPart(
                service.search.additionalText,
                "search__additional",
                "Search additional text :"
              )}
              </li>
              `
            );
          }, "") +
          "</ul>"
      );
    }
    async function switchSection(event: MouseEvent): Promise<void> {
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
          sectionHTML = await fillServicesList(sectionHTML);

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
