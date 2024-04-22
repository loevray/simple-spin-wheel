import setAttributes from "../utils/setAttributes.js";
import {
  DEFAULT_CIRCLE_ATTR,
  DEFAULT_TEXT_ATTR,
  DEFAULT_SVG_ATTR,
} from "../constants/DEFAULT_ATTR.js";

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
  constructor({
    size,
    radius,
    sectorData,
    container,
    onStopRotate,
    onStartRotate,
  }) {
    this.size = size;
    this.radius = radius;
    this.circumference = 2 * Math.PI * this.radius;
    this.container = container;
    this.onStopRotate = onStopRotate;
    this.onStartRotate = onStartRotate;
    this.sectorData = sectorData;
    this.totalSector = sectorData.reduce((acc, cur) => cur.ratio + acc, 0);
    this.sectorGroup = [];
    this.draw();
    this.addEvent();
  }

  /**
   * Renders the spinning wheel.
   */
  draw() {
    this.svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setAttributes(this.svgEl, {
      ...DEFAULT_SVG_ATTR,
      viewBox: `0 0 ${this.size} ${this.size}`,
      width: `${this.size}px`,
      height: `${this.size}px`,
      id: "svg-container",
    });

    this.container.appendChild(this.svgEl);

    this.#drawSector();
  }

  #drawSector() {
    let accRatio = 0;
    this.sectorData.forEach(
      ({ id, ratio, sectorColor, text, fontColor, fontSize }) => {
        const sectorRatio = ratio / this.totalSector;
        const sectorPercent = sectorRatio * 100;

        const groupEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        groupEl.setAttribute(
          "transform",
          `rotate(${(360 / this.totalSector) * accRatio})`
        );

        accRatio += ratio;

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

        setAttributes(textEl, {
          ...DEFAULT_TEXT_ATTR,
          transform: `rotate(${((360 * sectorRatio) / 2).toFixed(
            1
          )}) translate(${this.radius} 10)`,
        });

        textEl.textContent = text;

        groupEl.append(circleEl, textEl);

        this.sectorGroup.push(groupEl);
      }
    );

    this.svgEl.append(...this.sectorGroup);
  }

  update({ sectorData = this.sectorData }) {
    this.sectorData = sectorData;
    this.totalSector = sectorData.reduce((acc, cur) => cur.ratio + acc, 0);
    this.sectorGroup = [];
    this.#remove();
    this.draw();
    this.addEvent();
  }

  #remove() {
    this.container.removeChild(this.svgEl);
  }

  rotate() {
    this.svgEl.classList.remove("paused");
    this.svgEl.classList.add("rotating");
  }

  stopRotate() {
    this.svgEl.classList.add("paused");
  }

  addEvent() {
    this.svgEl.addEventListener("transitionend", (e) => {
      this.onStopRotate?.(e);
    });

    this.svgEl.addEventListener("animationstart", (e) => {
      this.onStartRotate?.(e);
      console.log("animation start");
    });
  }
}
