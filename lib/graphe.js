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
var _a, _Graphe_all, _Graphe_callbackStyle, _Graphe_points, _Graphe_origin;
export class Graphe {
    constructor(label, x, y, r, width, origin = Graphe.origin) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.r = r;
        this.width = width;
        _Graphe_callbackStyle.set(this, (context) => {
            context.beginPath();
            context.strokeStyle = "red";
            context.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            context.stroke();
        });
        _Graphe_points.set(this, new Set());
        this.relations = new Set();
        _Graphe_origin.set(this, null);
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
    draw(context, showOrigins = false) {
        context.save();
        var { origins } = this;
        [...origins, this].forEach((graphe) => {
            var { x, y, r } = graphe;
            context.translate(x, y);
            context.rotate(r);
            if (showOrigins || graphe == this) {
                context.beginPath();
                __classPrivateFieldGet(graphe, _Graphe_callbackStyle, "f").call(graphe, context);
                context.closePath();
                this.relations.forEach((g) => {
                    context.lineTo(0, 0);
                });
            }
        });
        context.restore();
    }
    setCallbackStyle(callback) {
        __classPrivateFieldSet(this, _Graphe_callbackStyle, callback, "f");
    }
    getCallbackStyle() {
        return __classPrivateFieldGet(this, _Graphe_callbackStyle, "f");
    }
    static create(x, y, origin = null, label = `${__classPrivateFieldGet(this, _a, "f", _Graphe_all).size}`) {
        return new this(label, x, y, 0, 10, origin);
    }
    static get all() {
        return __classPrivateFieldGet(this, _a, "f", _Graphe_all);
    }
}
_a = Graphe, _Graphe_callbackStyle = new WeakMap(), _Graphe_points = new WeakMap(), _Graphe_origin = new WeakMap();
_Graphe_all = { value: new Set() };
Graphe.origin = new Graphe("origi", 0, 0, 0, 3, null);
