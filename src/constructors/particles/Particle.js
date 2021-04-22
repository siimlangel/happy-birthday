import { Bodies, Body, World } from "matter-js";

const particleConstructor = (settings) => {
    const { p, world, ctx } = settings;

    function Particle(x, y, id, total, col) {
        const options = {
            restitution: 1,
            isSensor: true,
        };

        this.createBody(x, y, options);
        // By how much it's lifetime decreases every frame
        this.toughness = p.random(5, 10);
        this.id = id;
        // Total particles in one explosion
        this.total = total;
        this.lifetime = p.random(200, 255);
        this.col = col;
    }

    Particle.prototype.createBody = function (x, y, options) {
        const r = p.random(2, 7);
        this.body = Bodies.circle(x, y, r, options);
        World.add(world, this.body);

        this.pos = this.body.position;
        // Double the radius because p5 draws ellipses according to major and minor axes
        this.r = this.body.circleRadius * 2;
    };

    Particle.prototype.show = function () {
        p.push();
        p.translate(this.pos.x, this.pos.y);
        const [r, g, b] = this.col;
        p.fill(r, g, b, this.lifetime);
        p.ellipse(0, 0, this.r);
        p.pop();
        this.move();
    };

    Particle.prototype.isDone = function () {
        return this.lifetime <= 0;
    };

    Particle.prototype.remove = function () {
        World.remove(world, this.body);
    };

    Particle.prototype.move = function () {
        this.lifetime -= this.toughness;
    };

    Particle.prototype.shoot = function () {
        Body.setVelocity(this.body, {
            x: p.random(-5, 5),
            y: p.random(-5, 5),
        });
    };

    return Particle;
};

export default particleConstructor;
