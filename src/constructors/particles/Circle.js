import { Body } from "matter-js";
import particleConstructor from "./Particle";

const circleConstructor = (settings) => {
    const { p, world, ctx } = settings;
    const parent = particleConstructor(settings);

    function Circle(...args) {
        this.parent = parent;
        this.parent.apply(this, args);
        this.angle = this.body.angle;
        this.toughness = 5;
    }

    Circle.prototype = Object.create(parent.prototype);

    Circle.prototype.show = function () {
        p.push();
        p.translate(this.pos.x, this.pos.y);
        const r = p.map(this.body.velocity.x, -5, 5, 0, 255);
        const b = p.map(this.body.velocity.y, -5, 5, 0, 255);
        p.stroke(r, p.random(0, 255), b, this.lifetime);
        p.strokeWeight(this.r);
        p.point(0, 0);
        p.pop();
        this.move();
    };

    Circle.prototype.shoot = function () {
        const angle = p.map(this.id, 0, this.total, 0, p.TWO_PI);
        const r = 5;
        // Polar to cartesian coordinate transformation.
        const dx = r * Math.cos(angle);
        const dy = r * Math.sin(angle);

        Body.setVelocity(this.body, {
            x: dx,
            y: dy,
        });
    };

    return Circle;
};

export default circleConstructor;
