export class Graphe {
  static #all: Set<Graphe> = new Set();
  #points: Set<Graphe> = new Set();
  #origin: Graphe | null = null;
  constructor(public x: number = 0, public y: number = 0, public rotation: number = 0, public form: 'circle' | 'rect' = 'circle', public type: 'fill' | 'stroke' = 'stroke', public width: number = 30, public height: number = 30) {
    Graphe.#all.add(this);
  }
  set origin(v) {
    if (this.#origin) this.#origin.#points.delete(this);
    this.#origin = v instanceof Graphe ? v : null;
    if (this.#origin) this.#origin.#points.add(this);
  }
  get origin() {
    return this.#origin;
  }
  get points() {
    return Array.from(this.#points);
  }
  get origins(): Graphe[] {
    return this.#origin ? [...this.#origin.origins, this.#origin] : [];
  }
  get absolute(): [number, number] {
    var x = 0;
    var y = 0;
    var some = 0;
    [...this.origins, this].forEach(graphe => {
      const { origin } = graphe;
      var d = (graphe.x ** 2 + graphe.y ** 2) ** (1 / 2);
      d = graphe.x < 0 ? -d : d;
      if (origin) some += origin.rotation;
      var rotation = Math.atan(graphe.y / graphe.x);
      var xAxis = d * Math.cos(some + rotation);
      var yAxis = d * Math.sin(some + rotation);
      x += xAxis;
      y += yAxis;
    });
    return [x, y];
  }
  static get all() {
    return Array.from(this.#all);
  }
  static get origins(): Graphe[] {
    return this.all.filter(({ origin }) => !origin);
  }
  copy(): Graphe {
    var { origin, x, y, rotation, form, width, height, type } = this;
    const result = new Graphe(x, y, rotation, form, type, width, height);
    result.origin = origin;
    return result;
  }
  draw(context: CanvasRenderingContext2D) {
    var [x, y] = this.absolute;
    context.beginPath();
    if (this.form == 'circle') context.ellipse(x, y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    else context.rect(x + this.width / 2, y + this.height / 2, this.width, this.height);
    context[`${this.type}Style`] = 'red';
    context[`${this.type}`]();
    context.closePath();
  }
  static draw(context: CanvasRenderingContext2D) {
    function recursion(origin: Graphe, X: number, Y: number, some: number = 0) {
      X += origin.x;
      Y += origin.y;
      context.beginPath();
      if (origin.form == 'circle') context.ellipse(X, Y, origin.width / 2, origin.height / 2, 0, 0, Math.PI * 2);
      else context.rect(X + origin.width / 2, Y + origin.height / 2, origin.width, origin.height);
      context[`${origin.type}Style`] = 'red';
      context[`${origin.type}`]();
      context.closePath();
      origin.#points.forEach(graphe => {
        var d = (graphe.x ** 2 + graphe.y ** 2) ** (1 / 2);
        d = graphe.x < 0 ? -d : d;
        some += origin.rotation;
        var rotation = Math.atan(graphe.y / graphe.x);
        var xAxis = d * Math.cos(some + rotation);
        var yAxis = d * Math.sin(some + rotation);
        recursion(graphe, X + xAxis, Y + yAxis, some);
      });
    }
    this.origins.forEach(g => recursion(g, 0, 0, 0));
  }
}
