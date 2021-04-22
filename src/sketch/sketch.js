import { Bodies, Engine, Mouse, MouseConstraint, World } from "matter-js";

import fireworkConstructor from "../constructors/fireworks/Firework";
import textConstructor from "../constructors/text/Text";
import particleConstructor from "../constructors/particles/Particle";
import confettiConstructor from "../constructors/particles/Confetti";
import scatterConstructor from "../constructors/particles/Scatter";
import circleConstructor from "../constructors/particles/Circle";

export default function sketch(p) {
    let dimensions = { width: window.innerWidth, height: window.innerHeight };
    let engine;
    let world;
    // Array of currently active fireworkds
    let fireworks;

    // Width height of canvas
    let width;
    let height;

    // Array of currently active particles
    let particles;

    // Text constructor
    let Text;

    let mainText;
    let subText;

    // Canvas drawing context
    let ctx;

    // Firework constructor
    let Firework;

    // Array of particle constructors
    let particleConstructors;

    Array.prototype.sample = function () {
        return this[Math.floor(Math.random() * this.length)];
    };

    Array.prototype.applyBackwards = function (callback) {
        for (let i = this.length - 1; i >= 0; i--) {
            callback(this[i], i);
        }
    };

    p.getRandomFirework = function (...args) {
        const constructor = particleConstructors.sample();
        return new Firework([...args, constructor]);
    };

    // Executed before main loop
    p.setup = function () {
        reset();
    };

    const reset = function () {
        width = dimensions.width;
        height = dimensions.height;

        const canvas = p.createCanvas(dimensions.width, dimensions.height).elt;
        ctx = canvas.getContext("2d");
        engine = Engine.create();
        world = engine.world;
        world.gravity.y = 0.2;

        const canvasMouse = Mouse.create(canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: canvasMouse,
            constraint: {
                stiffness: 0.5,
                damping: 0.2,
            },
        });

        World.add(world, mouseConstraint);

        Engine.run(engine);

        // To pass to constructor creators
        const settings = { p, world, ctx };

        fireworks = [];
        particles = [];
        particleConstructors = [];

        Firework = fireworkConstructor({ ...settings, mouse: mouseConstraint });

        particleConstructors.push(particleConstructor(settings));
        particleConstructors.push(confettiConstructor(settings));
        particleConstructors.push(scatterConstructor(settings));
        particleConstructors.push(circleConstructor(settings));

        Text = textConstructor({ p, world, ctx });

        // Scale text to window size
        const widthPercentage = p.map(width, 0, 1920, 0, 1);
        const textSize = 100 * widthPercentage;

        mainText = new Text(
            width / 2,
            height / 2,
            "Palju õnne gotoAndPlay!",
            textSize
        );

        subText = new Text(
            width / 2,
            height / 2 + 25,
            "Proovi ilutulestik kätte saada",
            textSize / 2
        );
        const borderOpts = {
            isStatic: true,
        };
        const leftBorder = Bodies.rectangle(
            -5,
            height / 2,
            5,
            height,
            borderOpts
        );
        const rightBorder = Bodies.rectangle(
            width + 5,
            height / 2,
            5,
            height,
            borderOpts
        );
        const topBorder = Bodies.rectangle(width / 2, -5, width, 5, borderOpts);
        World.add(world, [leftBorder, rightBorder, topBorder]);
    };

    // Exectued when props are changed in the Scene.jsx component
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.dimensions) {
            dimensions = props.dimensions;
            reset();
        }
    };

    p.drawBg = function () {
        p.background(35, 0, 43, 50);
    };

    const handleFireworks = () => {
        fireworks.applyBackwards((elem, i) => {
            elem.show();
            if (elem.isDone()) {
                const explodedParticles = elem.explode();
                particles.push(...explodedParticles);
                fireworks.splice(i, 1);
            }
        });
    };

    const handleParticles = () => {
        particles.applyBackwards((elem, i) => {
            elem.show();
            if (elem.isDone()) {
                elem.remove();
                particles.splice(i, 1);
            }
        });
    };

    // Create a fireowrk at the bottom of the screen and shoot it up
    const spawnFirework = () => {
        if (p.frameCount % 50 == 0) {
            const part = p.getRandomFirework(
                p.random(width),
                height,
                p.random(10, 20)
            );
            fireworks.push(part);
            part.shoot();
        }
    };

    // Sketch mainloop
    p.draw = function () {
        p.drawBg();
        p.noStroke();
        handleFireworks();
        handleParticles();
        spawnFirework();
        mainText.show();
        subText.show();
    };
}
