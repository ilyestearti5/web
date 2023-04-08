export class Graphe {
  static #all: Set<Graphe> = new Set();
  static origin: Graphe = Graphe.create(0, 0, "origin", null);
  #points: Set<Graphe> = new Set();
  public relations: { graphe: Graphe; color: string }[] = [];
  #origin: Graphe | null = null;
  #indexCopyed: number = 0;
  constructor(
    public label: string,
    public x: number,
    public y: number,
    public r: number,
    public width: number,
    public height: number,
    public form: "circle" | "rect",
    public color: string,
    origin: Graphe | null = Graphe.origin
  ) {
    if (Graphe.all.find(({ label: lbl }) => lbl === label))
      throw Error("cannot be used the same label in diffrente Graphe");
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
  get absolute(): [number, number] {
    var origins = [...this.origins.reverse(), this];
    var x = 0;
    var y = 0;
    var some = 0;
    for (let i = 0; i < origins.length; i++) {
      var origin = origins[i - 1];
      var child = origins[i];
      var d = (child.x ** 2 + child.y ** 2) ** (1 / 2);
      d = child.x < 0 ? -d : d;
      if (origin) some += origin.r;
      var rotation = Math.atan(child.y / child.x);
      var xAxisRotation = d * Math.cos(some + rotation);
      var yAxisRotation = d * Math.sin(some + rotation);
      x += xAxisRotation;
      y += yAxisRotation;
    }
    return [x, y];
  }
  get points() {
    return Array.from(this.#points);
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
        if (graphe.form == "circle")
          context.ellipse(
            0,
            0,
            graphe.width / 2,
            graphe.height / 2,
            0,
            0,
            Math.PI * 2
          );
        else
          context.rect(
            -graphe.width / 2,
            -graphe.height / 2,
            graphe.width,
            graphe.height
          );
        context.strokeStyle = graphe.color;
        context.stroke();
        context.closePath();
        context.beginPath();
        graphe.relations.forEach(({ color, graphe: grp }) => {
          var { diffX, diffY } = Graphe.info(grp, graphe);
          context.lineTo(0, 0);
          context.lineTo(diffX, diffY);
          context.setLineDash([5, 5]);
          context.strokeStyle = color;
          context.stroke();
        });
        context.closePath();
        context.setLineDash([]);
      }
    });
    context.restore();
  }
  static info(g1: Graphe, g2: Graphe = this.origin) {
    var [x1, y1] = g1.absolute;
    var [x2, y2] = g2.absolute;
    var diffX: number = x1 - x2;
    var diffY: number = y1 - y2;
    return {
      diffX,
      diffY,
      diff: (diffX ** 2 + diffY ** 2) ** (1 / 2),
      rotation: Math.atan(diffY / diffX),
    };
  }
  static create(
    x: number,
    y: number,
    label: string = `point - ${this.#all.size}`,
    origin: Graphe | null = this.origin
  ) {
    return new this(
      label,
      x,
      y,
      0,
      10,
      10,
      "circle",
      label.includes("origin") ? "#F33" : "white",
      origin
    );
  }
  copy() {
    var { x, y, r, width, height, form, color, origin } = this;
    this.#indexCopyed++;
    var result = new Graphe(
      `${this.label} - version(${this.#indexCopyed})`,
      x,
      y,
      r,
      width,
      height,
      form,
      color,
      origin
    );
    var points: Set<Graphe> = new Set();
    this.points.forEach((point) => {
      var graphe = point.copy();
      graphe.origin = result;
      points.add(graphe);
    });
    result.#points = points;
    return result;
  }
  static get absolutes() {
    return Array.from(this.#all).filter((graphe) => !graphe.#points.size);
  }
  static draw(context: CanvasRenderingContext2D) {
    this.absolutes.forEach((graphe) => graphe.draw(context, true));
  }
  get from(): null | Graphe {
    return Graphe.from(this);
  }
  get components() {
    return Graphe.components(this);
  }
  static label(label: string): Graphe | null {
    var fd = this.all.find(({ label: lbl }) => lbl == label);
    return fd || null;
  }
  static clear() {
    this.#all = new Set([this.origin]);
  }
  static from(graphe: Graphe) {
    return Graphe.label(graphe.label.replace(/ - version\([1-9]+\)/gi, ""));
  }
  static components(graphe: Graphe) {
    var result = [graphe];
    graphe.points.forEach((g) => result.push(...this.components(g)));
    return result;
  }
  static get all() {
    return Array.from(this.#all);
  }
}