import setAttributes from "./utils/setAttributes.js";
import {
  DEFAULT_CIRCLE_ATTR,
  DEFAULT_TEXT_ATTR,
  DEFAULT_SVG_ATTR,
} from "./constants/DEFAULT_ATTR.js";

export default class SpinWheel {
  /**
   * @type {SVGElement} - svgElement
   */
  svgEl;

  /**
   * Represents a spinning wheel with sectors.
   * @param {Object} props - SpinWheel props
   * @param {string} props.size - px
   * @param {number} props.radius
   * @param {Array<{ id: string, ratio: number, text: string, sectorColor:string, fontSize:number, fontColor:string }>} props.sectorData - Data representing sectors of the spinning wheel.
   * @param {HTMLElement} props.container - SpinWheel Conatiner
   * @param {HTMLOrSVGElement} svgEL
   */
  constructor({ size, radius, sectorData, container }) {
    this.size = size;
    this.radius = radius;
    this.sectorData = sectorData;
    this.totalSector = sectorData.length;
    this.container = container;
    this.circumference = 2 * Math.PI * this.radius;
    this.sectorGroup = [];
    this.draw();
  }

  draw() {
    this.svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setAttributes(this.svgEl, {
      ...DEFAULT_SVG_ATTR,
      viewBox: `0 0 ${this.size} ${this.size}`,
      width: `${this.size}px`,
      height: `${this.size}px`,
    });

    this.container.appendChild(this.svgEl);

    this.drawSector();
  }

  drawSector() {
    this.sectorData.forEach(
      ({ id, ratio, sectorColor, text, fontColor, fontSize }, index) => {
        const sectorRatio = ratio / this.sectorData.length;
        const sectorPercent = Number((sectorRatio * 100).toFixed(1));

        const groupEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        groupEl.setAttribute(
          "transform",
          `rotate(-${360 * sectorRatio * index})`
        );

        const circleEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );

        setAttributes(circleEl, {
          ...DEFAULT_CIRCLE_ATTR,
          r: this.radius,
          ["stroke-width"]: this.radius * 2,
          ["stroke-dasharray"]: `${
            (sectorPercent * this.circumference) / 100
          } ${this.circumference}`,
          stroke: sectorColor,
          id,
        });

        const textEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );

        textEl.textContent = text;

        setAttributes(textEl, {
          ...DEFAULT_TEXT_ATTR,
          transform: `rotate(${((360 * sectorRatio) / 2).toFixed(
            1
          )}) translate(${this.radius})`,
        });

        groupEl.append(circleEl, textEl);

        this.sectorGroup.push(groupEl);
      }
    );

    this.svgEl.append(...this.sectorGroup);
  }

  update() {
    this.remove();
    this.draw();
  }

  remove() {
    this.container.innerHTML = "";
  }

  rotate() {
    this.svgEl.classList.add("rotating");
  }

  stopRotate() {
    this.svgEl.classList.remove("rotating");
  }
}
