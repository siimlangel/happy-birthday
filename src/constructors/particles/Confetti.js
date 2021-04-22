import { Bodies, Body, World } from "matter-js";
import particleConstructor from "./Particle";

const confettiConstructor = (settings) => {
    const { p, world, ctx } = settings;
    const parent = particleConstructor(settings);

    function Confetti(...args) {
        this.parent = parent;
        this.parent.apply(this, args);
        this.angle = this.body.angle;
    }

    Confetti.prototype = Object.create(parent.prototype);

    Confetti.prototype.createBody = function (x, y, options) {
        const r = p.random(5, 10);
        this.body = Bodies.rectangle(x, y, r, r, options);
        World.add(world, this.body);

        this.pos = this.body.position;
        this.r = r * 2;
        this.toughness = p.random(1, 10);
    };

    Confetti.prototype.show = function () {
        let angle = this.body.angle;
        p.push();
        p.translate(this.pos.x, this.pos.y);

        const [r, g, b] = this.col;
        p.fill(
            r,
            this.lifetime - g,
            p.map(Math.sin(this.lifetime), -1, 1, 100, 255),
            this.lifetime
        );
        p.rotate(angle);
        p.rectMode(p.CENTER);
        p.rect(0, 0, this.r, this.r);
        p.pop();
        this.move(p.random(5, 10));
    };

    Confetti.prototype.shoot = function () {
        parent.prototype.shoot.call(this);
        Body.setAngularVelocity(this.body, Math.PI / 12);
    };

    return Confetti;
};

export default confettiConstructor;
