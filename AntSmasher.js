// Proudly based upon https://github.com/Kaelinator/AGAD/tree/master/Ant%20Smasher
const bugs = [];

let score;
let totalClicks; // how many times the user has clicked (for accuracy)
let playing; // aids with asychronous endGame() function

let speed; // speed at which the bugs travel
let bugChance; // chance of a new bug being pushed

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    score = 0;
    totalClicks = 0;
    playing = true;

    speed = 3;
    bugChance = 0.4;

    textSize(30);
}

function draw() {
    background('#1a1a1a');

    handleBugs();
    attemptNewBug(frameCount);

    handleDifficulty(frameCount, score);

    drawScore();
    gameOver(playing);
}

/**
 * handles user input
 * squashes bugs
 */
function mousePressed() {
    for (let i = 0; i < bugs.length; i++) {
        // update bug's state
        bugs[i].squashed = bugs[i].squashedBy(mouseX, mouseY);

        // if the bug is good, end the game
        if (bugs[i].squashed && bugs[i].type) endGame();
    }

    totalClicks++;
}

/**
 * updates and draws bugs
 * handles off-screen bugs
 * handles bugs array
 */
function handleBugs() {
    for (let i = bugs.length - 1; i >= 0; i--) {
        /* update & draw */
        bugs[i].update();
        bugs[i].draw();

        if (bugs[i].position.y > height && !bugs[i].type) {
            // if the bug is off the screen and it's a bad bug

            endGame();
        }

        if (bugs[i].squashed) {
            // remove from bugs array

            bugs.splice(i, 1);
            score++;
        }
    }
}

/**
 * attempts to push a new bug
 */
function attemptNewBug(frame) {
    if (frame % 60 === 0) {
        // every second

        if (random() < bugChance) {
            // probability of a new bug

            const x = random(width / 2) + width / 4; // only in the middle
            const type = random() > 0.8; // good or bad bug
            bugs.push(new Insect(x, type));
        }
    }
}

/**
 * variables pertaining to difficulty
 * is set based upon frame and score
 */
function handleDifficulty(frame, score) {
    if (frame % 60 === 0) {
        // update once every second

        bugChance = map(score, 0, 800, 3, 0.999);
        speed = map(score, 0, 800, 3, 30);
    }
}

/**
 * draws game over message
 */
function gameOver(playing) {
    if (playing === false) {
        // only if the game has ended
        fill(255);
        noStroke();
        textSize(60);
        textAlign(CENTER);
        text('Game Over!', width / 2, height / 2);

        // prevent division by zero
        totalClicks = totalClicks === 0 ? 1 : totalClicks;

        const accuracy = Math.round((score / totalClicks) * 100);

        const gameScores = JSON.parse(localStorage.getItem('gameScores')) || [];
        gameScores.push(score);
        localStorage.setItem('gameScores', JSON.stringify(gameScores));

        return theEndScreen(accuracy);

        textSize(30);
        text('Squash accuracy: ' + accuracy + '%', width / 2, height / 2 + 70);
        textAlign(LEFT);
        textSize(30);
    }
}

/**
 * draws the score
 */
function drawScore() {
    /* draw score */
    fill(255);
    noStroke();
    text(score, 10, 40);
}

/**
 * stops the loop, triggers game over
 */
function endGame() {
    playing = false;
    noLoop();
}

function theEndScreen(accuracy) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    const button = document.createElement('button');
    const gameScores = JSON.parse(localStorage.getItem('gameScores')) || [];

    div.className = 'container';

    button.innerText = 'Try again';
    button.onclick = () => location.reload();

    h1.innerText = 'Game Over!';
    h2.innerText = 'Get over it :D';

    p.innerText = `Your score ${
        gameScores[gameScores.length - 1]
    }, the highest score ${Math.max(...gameScores)}, total plays ${
        gameScores.length
    } ✌`;

    p2.innerText = `Your squash acurracy ${accuracy}%, but who cares 😜`;

    div.appendChild(h1);
    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(p2);
    div.appendChild(button);

    document.body.prepend(div);

    const canvas = document.querySelector('canvas');

    document.body.removeChild(canvas);
}
