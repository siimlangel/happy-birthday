import { Bodies, Body, Events, World } from "matter-js";

const fireworkConstructor = (settings) => {
    const { p, world, ctx, mouse } = settings;

    function Firework(props) {
        const options = {};

        const [x, y, r, Particle] = props;

        this.body = Bodies.circle(x, y, r, options);
        World.add(world, this.body);
        this.dragging = false;
        this.mouse = mouse;
        this.pos = this.body.position;
        // Double the radius because p5 draws ellipses according to major and minor axes
        this.r = this.body.circleRadius * 2;
        this.Particle = Particle;
        this.history = [];

        const self = this;
        Events.on(this.mouse, "mousedown", function (event) {
            self.dragging = self.body == self.mouse.body;
        });
        Events.on(this.mouse, "mouseup", function (event) {
            self.dragging = false;
        });
    }

    Firework.prototype.show = function () {
        this.trail();
        this.showTrail();
    };

    Firework.prototype.showTrail = function () {
        p.push();

        for (let i = 0; i < this.history.length; i++) {
            const { x, y } = this.history[i];
            const weight = p.map(i, 0, this.history.length, 0, this.r);
            p.strokeWeight(weight);
            if (this.dragging) {
                p.stroke(20, 200, 20);
            } else {
                p.stroke(
                    255,
                    255,
                    255,
                    p.map(i, 0, this.history.length, 0, 255)
                );
            }
            p.point(x, y);
        }

        p.pop();
    };

    Firework.prototype.explode = function () {
        const particles = [];
        const total = p.random(25, 50);
        const color = [p.random(255), p.random(255), p.random(255)];
        for (let i = 0; i < total; i++) {
            const particle = new this.Particle(
                this.pos.x,
                this.pos.y,
                i,
                total,
                color
            );
            particles.push(particle);
            particle.shoot();
        }
        this.remove();
        return particles;
    };

    Firework.prototype.shoot = function () {
        Body.setVelocity(this.body, {
            x: p.random(-4, 4),
            y: p.random(-8, -16),
        });
    };

    Firework.prototype.isDone = function () {
        // Firework explodes when it reaches the pinnacle of it's ascent
        return this.body.velocity.y >= p.random(0, 1) && !this.dragging;
    };

    Firework.prototype.remove = function () {
        World.remove(world, this.body);
    };

    Firework.prototype.trail = function () {
        this.history.push({ x: this.pos.x, y: this.pos.y });
        // Max trail length of 20
        if (this.history.length > 20) {
            this.history.splice(0, 1);
        }
    };

    return Firework;
};

export default fireworkConstructor;
