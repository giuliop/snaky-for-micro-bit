function isCollision (x: number, y: number) {
    out = x > 4 || x < 0 || y < 0 || y > 4
    selfHit = led.pointBrightness(x, y) == 255
    return out || selfHit
}

function placeFood (num: number) {
    for (let index = 0; index < num; index++) {
        let foodX, foodY
        let placed = false
        while (!(placed)) {
            foodY = randint(0, 3)
            if (foodY == 3) {
                foodX = randint(3, 4)
            } else {
                foodX = randint(0, 4)
            }
            if (!(led.point(foodX, foodY))) {
                led.plotBrightness(foodX, foodY, 25)
                placed = true
            }
        }
    }
}

function init () {
    len = startLen
    snake[0] = [0, 4]
    snake[1] = [1, 4]
    snake[2] = [2, 4]
    head = 2
    tail = 0
    placeFood(foodNum)
    drawSnake()
    dir = 0 // right
    score = 0
}

function gameOver (iconId: number) {
    basic.showIcon(iconId, 2000)
    basic.showNumber(3)
    basic.showNumber(2)
    basic.showNumber(1)
}

function drawSnake () {
    led.plot(0, 4)
    led.plot(1, 4)
    led.plot(2, 4)
}

let ate = false
let newY = 0
let newX = 0
let newHead = 0
let score = 0
let dir = 0
let tail = 0
let placed = false
let selfHit = false
let out = false
let head = 2
let snake = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]]
let startLen = 3
let len = startLen
let foodNum = 10
let maxLen = startLen + foodNum
let moves = []

// right, down, left, up
let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]
init()

basic.forever(function () {
    
// Button A for turn left, B for turn right
    let time = control.millis()
    let newDir = dir
    while ((control.millis() - time) < 500) {
        if (input.buttonIsPressed(Button.A)) {
            newDir = dir - 1
        } else if (input.buttonIsPressed(Button.B)) {
            newDir = dir + 1
        }
    }
    dir = newDir
    if (dir == -1) {
        dir = 3
    } else if (dir == 4) {
        dir = 0
    }
    newHead = (head + 1) % maxLen
    newX = snake[head][0] + dirs[dir][0]
    newY = snake[head][1] + dirs[dir][1]
    if (isCollision(newX, newY)) {
        gameOver(IconNames.Skull)
        basic.clearScreen()
        init()
    } else {
        snake[newHead] = [newX, newY]
        head = newHead
        ate = led.point(newX, newY)
        led.plot(newX, newY)
        if (ate) {
            score += 1
            if (score == foodNum) {
                gameOver(IconNames.Happy)
                basic.clearScreen()
                init()
            }
        } else {
            led.unplot(snake[tail][0], snake[tail][1])
            tail = (tail + 1) % maxLen
        }
    }
})
