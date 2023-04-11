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
var _a, _Graphe_all, _Graphe_points, _Graphe_origin;
export class Graphe {
    constructor(x = 0, y = 0, rotation = 0, form = "circle", type = "stroke", width = 30, height = 30) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.form = form;
        this.type = type;
        this.width = width;
        this.height = height;
        _Graphe_points.set(this, new Set());
        _Graphe_origin.set(this, null);
        __classPrivateFieldGet(Graphe, _a, "f", _Graphe_all).add(this);
    }
    set origin(v) {
        if (__classPrivateFieldGet(this, _Graphe_origin, "f"))
            __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").delete(this);
        __classPrivateFieldSet(this, _Graphe_origin, v instanceof Graphe ? v : null, "f");
        if (__classPrivateFieldGet(this, _Graphe_origin, "f"))
            __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").add(this);
    }
    get origin() {
        return __classPrivateFieldGet(this, _Graphe_origin, "f");
    }
    get points() {
        return Array.from(__classPrivateFieldGet(this, _Graphe_points, "f"));
    }
    get origins() {
        return __classPrivateFieldGet(this, _Graphe_origin, "f") ? [...__classPrivateFieldGet(this, _Graphe_origin, "f").origins, __classPrivateFieldGet(this, _Graphe_origin, "f")] : [];
    }
    get absolute() {
        var x = 0;
        var y = 0;
        var some = 0;
        [...this.origins, this].forEach((graphe) => {
            const { origin } = graphe;
            var d = (graphe.x ** 2 + graphe.y ** 2) ** (1 / 2);
            d = graphe.x < 0 ? -d : d;
            if (origin)
                some += origin.rotation;
            var rotation = Math.atan(graphe.y / graphe.x);
            var xAxis = d * Math.cos(some + rotation);
            var yAxis = d * Math.sin(some + rotation);
            x += xAxis;
            y += yAxis;
        });
        return [x, y];
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _Graphe_all));
    }
    static get origins() {
        return this.all.filter(({ origin }) => !origin);
    }
    copy() {
        var { origin, x, y, rotation, form, width, height, type } = this;
        const result = new Graphe(x, y, rotation, form, type, width, height);
        result.origin = origin;
        return result;
    }
    draw(context) {
        var [x, y] = this.absolute;
        context.beginPath();
        if (this.form == "circle")
            context.ellipse(x, y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        else
            context.rect(x + this.width / 2, y + this.height / 2, this.width, this.height);
        context[`${this.type}Style`] = "red";
        context[`${this.type}`]();
        context.closePath();
    }
    static draw(context) {
        function recursion(origin, X, Y, some = 0) {
            X += origin.x;
            Y += origin.y;
            context.beginPath();
            if (origin.form == "circle")
                context.ellipse(X, Y, origin.width / 2, origin.height / 2, 0, 0, Math.PI * 2);
            else
                context.rect(X + origin.width / 2, Y + origin.height / 2, origin.width, origin.height);
            context[`${origin.type}Style`] = "red";
            context[`${origin.type}`]();
            context.closePath();
            __classPrivateFieldGet(origin, _Graphe_points, "f").forEach((graphe) => {
                var d = (graphe.x ** 2 + graphe.y ** 2) ** (1 / 2);
                d = graphe.x < 0 ? -d : d;
                some += origin.rotation;
                var rotation = Math.atan(graphe.y / graphe.x);
                var xAxis = d * Math.cos(some + rotation);
                var yAxis = d * Math.sin(some + rotation);
                recursion(graphe, X + xAxis, Y + yAxis, some);
            });
        }
        this.origins.forEach((g) => recursion(g, 0, 0, 0));
    }
}
_a = Graphe, _Graphe_points = new WeakMap(), _Graphe_origin = new WeakMap();
_Graphe_all = { value: new Set() };
