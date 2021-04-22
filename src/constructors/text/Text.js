const textConstructor = (settings) => {
    const { p, world, ctx } = settings;

    function Text(x, y, text, size) {
        this.pos = { x, y };
        this.text = text;
        this.fontSize = size;
        p.textSize(this.fontSize);
        this.width = p.textWidth(this.text);
    }

    Text.prototype.show = function () {
        p.push();
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        p.textFont("Courier New");
        p.textSize(this.fontSize);
        p.translate(this.pos.x, this.pos.y);
        p.textAlign(p.CENTER);
        p.fill(255);
        p.text(this.text, 0, -this.fontSize);
        p.pop();
    };

    return Text;
};

export default textConstructor;
