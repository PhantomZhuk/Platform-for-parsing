type Section = "dashboard" | "users" | "services";
declare class p5 {
  constructor(sketch: (p: sketchFns) => void);
  p: sketchFns;
}
interface sketchFns {
  createCanvas: (
    width: number,
    height: number,
    canvas?: HTMLCanvasElement
  ) => void;
  setup: () => void;
  background: (color: number, color2?: number, color3?: number) => void;
  draw: () => void;
  beginShape: () => void;
  endShape: () => void;
  vertex: (x: number, y: number) => void;
  strokeWeight: (weight: number) => void;
  stroke: (color: number, color2?: number, color3?: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  width: number;
  height: number;
}

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
void (async () => {
  try {
    const services: Service[] = await (
      await fetch("/admin/getServices", { method: "GET" })
    ).json();
    function fillAllSections(): void {
      function fillServicesSection(): void {
        const servicesListEl = document.querySelector(".services__list")!;
        function setHTMLPart(info: string, className: string, desc: string) {
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
          servicesListEl.innerHTML = services.reduce(
            (prev: string, service: Service): string => {
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
            },
            ""
          );
      }
      function fillDashboardSection(): void {
        const dashboardEl = document.getElementById("template-dashboard")!;
        console.log(dashboardEl);
        const servicesListEl = dashboardEl.querySelector(
          ".dashboard__services-list"
        )!;

        if (services.length == 0)
          servicesListEl.innerHTML = /*html*/ `<div class="services__table-empty">No services found</div>`;
        else
          servicesListEl.innerHTML = services.reduce(
            (prev: string, service: Service): string => {
              return (
                prev +
                /*html*/ `<li class="dashboard__service">
                <h4 class="dashboard__service-name">${service.serviceName}</h4>
                <p class="dashboard__service-increase">+10</p>
                <div class="dashboard__service-visits">
                  <span>Visitors</span>
                  <span style="font-size: 18px">100</span>
                </div>
                <canvas id="dashboard__service-chart-${service.serviceName}"></canvas>
              </li>`
              );
            },
            ""
          );
      }
      fillDashboardSection();
      fillServicesSection();
    }
    function switchSection(event: MouseEvent, SectionName: null): void;
    function switchSection(event: null, SectionName: Section): void;
    function switchSection(
      event: MouseEvent | null,
      SectionName: Section | null
    ): void {
      const sectionName = (() => {
        if (SectionName) return SectionName;
        const target: HTMLLabelElement = event!.target as HTMLLabelElement;
        const label = target.closest("label");
        if (!label) return null;
        return label.textContent!.trim().toLowerCase() as Section;
      })();
      if (!sectionName) return;
      document
        .querySelectorAll<HTMLDivElement>(`[id*=template-]`)
        .forEach((template) => {
          if (template.id === `template-${sectionName}`)
            template.removeAttribute("style");
          else template.style.display = "none";
        });
    }
    document
      .querySelector<HTMLUListElement>("aside ul")!
      .addEventListener("click", function (e) {
        switchSection(e, null);
      });
    fillAllSections();
  } catch (e) {
    alert(e);
  }
})();
