export default class Div {
  constructor({ container, style, dataSet }) {
    this.container = container;
    this.style = style;
    this.dataSet = dataSet;
    this.divEl = document.createElement("div");
    this.#setAttrs();
    this.render();
  }

  get element() {
    return this.divEl;
  }

  #setAttrs() {
    this.dataSet && this.divEl.setAttribute("data-id", this.dataSet);
    Object.assign(this.divEl.style, this.style);
  }

  render() {
    this.container.appendChild(this.divEl);
  }
}
