var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Graphe_all, _Graphe_points, _Graphe_origin, _Graphe_indexCopyed;
export class Graphe {
    constructor(label, x, y, r, width, height, form, color, origin = Graphe.origin) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.r = r;
        this.width = width;
        this.height = height;
        this.form = form;
        this.color = color;
        _Graphe_points.set(this, new Set());
        this.relations = [];
        _Graphe_origin.set(this, null);
        _Graphe_indexCopyed.set(this, 0);
        if (Graphe.all.find(({ label: lbl }) => lbl === label))
            throw Error("cannot be used the same label in diffrente Graphe");
        this.origin = origin;
        __classPrivateFieldGet(Graphe, _a, "f", _Graphe_all).add(this);
    }
    get origin() {
        return __classPrivateFieldGet(this, _Graphe_origin, "f");
    }
    get origins() {
        return !__classPrivateFieldGet(this, _Graphe_origin, "f") ? [] : [...__classPrivateFieldGet(this, _Graphe_origin, "f").origins, __classPrivateFieldGet(this, _Graphe_origin, "f")];
    }
    set origin(v) {
        __classPrivateFieldGet(this, _Graphe_origin, "f") && __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").delete(this);
        __classPrivateFieldSet(this, _Graphe_origin, v, "f");
        __classPrivateFieldGet(this, _Graphe_origin, "f") && __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").add(this);
    }
    get relative() {
        var { origin, x, y, r } = this;
        while (origin) {
            x += origin.x;
            y += origin.y;
            r += origin.r;
            origin = origin.origin;
        }
        return [x, y, r];
    }
    get points() {
        return Array.from(__classPrivateFieldGet(this, _Graphe_points, "f"));
    }
    draw(context, showOrigins = false) {
        context.save();
        const { origins } = this;
        [...origins, this].forEach((graphe) => {
            var { x, y, r } = graphe;
            context.translate(x, y);
            context.rotate(r);
            if (showOrigins || graphe == this) {
                context.beginPath();
                if (graphe.form == "circle")
                    context.ellipse(0, 0, graphe.width / 2, graphe.height / 2, 0, 0, Math.PI * 2);
                else
                    context.rect(-graphe.width / 2, -graphe.height / 2, graphe.width, graphe.height);
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
    static info(g1, g2 = this.origin) {
        const [x1, y1] = g1.relative;
        const [x2, y2] = g2.relative;
        const diffX = x1 - x2;
        const diffY = y1 - y2;
        return {
            diffX,
            diffY,
            diff: (diffX ** 2 + diffY ** 2) ** (1 / 2),
            rotation: Math.atan(diffY / diffX),
        };
    }
    static create(x, y, label = `point - ${__classPrivateFieldGet(this, _a, "f", _Graphe_all).size}`, origin = this.origin) {
        return new this(label, x, y, 0, 10, 10, "circle", label.includes("origin") ? "#F33" : "white", origin);
    }
    copy() {
        var _b;
        var { x, y, r, width, height, form, color, origin } = this;
        __classPrivateFieldSet(this, _Graphe_indexCopyed, (_b = __classPrivateFieldGet(this, _Graphe_indexCopyed, "f"), _b++, _b), "f");
        var result = new Graphe(`${this.label} - version(${__classPrivateFieldGet(this, _Graphe_indexCopyed, "f")})`, x, y, r, width, height, form, color, origin);
        var points = new Set();
        this.points.forEach((point) => {
            var graphe = point.copy();
            graphe.origin = result;
            points.add(graphe);
        });
        __classPrivateFieldSet(result, _Graphe_points, points, "f");
        return result;
    }
    static get noOrigin() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _Graphe_all)).filter((graphe) => !__classPrivateFieldGet(graphe, _Graphe_points, "f").size);
    }
    static draw(context) {
        this.noOrigin.forEach((graphe) => graphe.draw(context, true));
    }
    get from() {
        return Graphe.from(this);
    }
    get components() {
        return Graphe.components(this);
    }
    static label(label) {
        var fd = this.all.find(({ label: lbl }) => lbl == label);
        return fd || null;
    }
    static clear() {
        __classPrivateFieldSet(this, _a, new Set([this.origin]), "f", _Graphe_all);
    }
    static from(graphe) {
        return Graphe.label(graphe.label.replace(/ - version\([1-9]+\)/gi, ""));
    }
    static components(graphe) {
        var result = [graphe];
        graphe.points.forEach((g) => result.push(...this.components(g)));
        return result;
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _Graphe_all));
    }
}
_a = Graphe, _Graphe_points = new WeakMap(), _Graphe_origin = new WeakMap(), _Graphe_indexCopyed = new WeakMap();
_Graphe_all = { value: new Set() };
Graphe.origin = Graphe.create(0, 0, "origin", null);
