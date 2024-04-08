import { DEFAULT_EDITABLE_STYLE } from "../constants/DEFAULT_ATTR.js";
import setAttributes from "../utils/setAttributes.js";

export default class EditableDiv {
  /**
   * @private {string} #id
   */
  #id;

  /**
   * @private {HTMLElement} #container
   */
  #container;

  /**
   * @private {HTMLDivElement} #divEl
   */
  #divEl;

  /**
   * @param {Object} props - EditableDiv Props
   * @param {string} props.id - element id
   * @param {HTMLElement} props.container - editable div container
   * @param {string} text
   */
  constructor({ id, container, text = "" }) {
    this.#id = id;
    this.#container = container;
    this.text = text;
    this.#divEl = document.createElement("div");
    this.#setAttrs();
    this.setText(text);
    this.#render();
  }
  get element() {
    return this.#divEl;
  }

  #setAttrs() {
    setAttributes(this.#divEl, {
      contenteditable: true,
      ["data-contenteditable"]: true,
      id: this.#id,
    });
    Object.assign(this.#divEl.style, DEFAULT_EDITABLE_STYLE);
  }

  setText(text) {
    if (!text) return;
    this.#divEl.textContent = text;
  }

  clear() {
    this.#divEl.textContent = "";
  }

  #render() {
    this.#container.appendChild(this.#divEl);
  }
}
