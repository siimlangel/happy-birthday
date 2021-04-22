import { Body } from "matter-js";
import particleConstructor from "./Particle";

const scatterConstructor = (settings) => {
    const { p, world, ctx } = settings;
    const parent = particleConstructor(settings);

    function Scatter(...args) {
        this.parent = parent;
        this.parent.apply(this, args);
        this.angle = this.body.angle;
        this.toughness = 2;
    }

    Scatter.prototype = Object.create(parent.prototype);

    Scatter.prototype.show = function () {
        p.push();
        p.translate(this.pos.x, this.pos.y);
        const [r, g, b] = this.col;
        const col = p.map(this.id, 0, this.total, 0, 100);

        p.stroke(r - col, g - col, b - col, this.lifetime);
        p.strokeWeight(this.r);
        p.point(0, 0);
        p.pop();
        this.move();
    };

    Scatter.prototype.move = function () {
        this.parent.prototype.move.call(this);

        Body.setVelocity(this.body, {
            x: p.random(-10, 10),
            y: p.random(-10, 10),
        });
    };

    return Scatter;
};

export default scatterConstructor;
