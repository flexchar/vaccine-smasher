class Insect {
    constructor(x, type) {
        this.origin = x; // from what point to oscillate

        this.position = createVector(0, 0);
        this.serpentine = random(3) + 3; // serpentine distance

        this.type = type; // false = ant, true = bee
        this.squashed = false; // bug state

        this.radius = 100; // size of bug

        this.randomBool = Math.random() * 10 > 5;

        this.images = {
            syringe: loadImage('/assets/syringe.png'),
            bottle: loadImage('/assets/bottle.png'),
            virus: loadImage('/assets/virus.png'),
        };
    }

    getImage() {
        const { images } = this;
        if (this.type) {
            return images.virus;
        }
        return this.randomBool ? images.bottle : images.syringe;
    }

    /**
     * draws the insect based upon type
     */
    draw = () => {
        const theImage = this.getImage();
        const halfSize = theImage.width / 2;
        // stroke(255);
        // strokeWeight(3);
        // fill(this.type ? "red" : "green");
        image(theImage, this.position.x - halfSize, this.position.y - halfSize);
        // ellipse(this.position.x, this.position.y, this.radius);
    };

    /**
     * forces bugs along their path
     */
    update = () => {
        this.position.y += speed;
        Object.keys(this.images).forEach(image =>
            this.images[image].resize(this.radius, 0)
        );

        this.position.x =
            cos(
                this.position.y * (0.005 * this.serpentine) +
                    this.serpentine * 10
            ) *
                (width / this.serpentine) +
            this.origin;
    };

    /**
     * returns whether or not x & y are within the bug
     */
    squashedBy = (x, y) => {
        var d = dist(x, y, this.position.x, this.position.y);

        return d < this.radius;
    };
}
