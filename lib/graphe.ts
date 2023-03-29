import { CallbackStyle } from "./types.js";
export class Graphe {
  static #all: Set<Graphe> = new Set();
  static origin: Graphe = new Graphe("origi", 0, 0, 0, 3, null);
  #callbackStyle: CallbackStyle = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.strokeStyle = "red";
    context.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    context.stroke();
  };
  #points: Set<Graphe> = new Set();
  public relations: Set<Graphe> = new Set();
  #origin: Graphe | null = null;
  constructor(
    public label: string,
    public x: number,
    public y: number,
    public r: number,
    public width: number,
    origin: Graphe | null = Graphe.origin
  ) {
    this.origin = origin;
    Graphe.#all.add(this);
  }
  get origin() {
    return this.#origin;
  }
  get origins(): Graphe[] {
    return !this.#origin ? [] : [...this.#origin.origins, this.#origin];
  }
  set origin(v) {
    this.#origin && this.#origin.#points.delete(this);
    this.#origin = v;
    this.#origin && this.#origin.#points.add(this);
  }
  get relative(): [number, number, number] {
    var { origin, x, y, r } = this;
    while (origin) {
      x += origin.x;
      y += origin.y;
      r += origin.r;
      origin = origin.origin;
    }
    return [x, y, r];
  }
  draw(context: CanvasRenderingContext2D, showOrigins: boolean = false) {
    context.save();

    var { origins } = this;

    [...origins, this].forEach((graphe) => {
      var { x, y, r } = graphe;
      context.translate(x, y);
      context.rotate(r);
      if (showOrigins || graphe == this) {
        context.beginPath();
        graphe.#callbackStyle(context);
        context.closePath();
        this.relations.forEach((g) => {
          context.lineTo(0, 0);
        });
      }
    });

    context.restore();
  }

  setCallbackStyle(callback: CallbackStyle) {
    this.#callbackStyle = callback;
  }

  getCallbackStyle(): CallbackStyle {
    return this.#callbackStyle;
  }

  static create(
    x: number,
    y: number,
    origin: Graphe | null = null,
    label: string = `${this.#all.size}`
  ) {
    return new this(label, x, y, 0, 10, origin);
  }

  static get all() {
    return this.#all;
  }
}
