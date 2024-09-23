// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

function Shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = true; // 新增 exists 属性
}

function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color; // 设置绘制颜色
  ctx.lineWidth = 3; // 设置线宽为3
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function() {
  // 检查右侧边界
  if ((this.x + this.size) >= width) {
    this.x = width - this.size;
    this.velX = -(this.velX);
  }
  // 检查左侧边界
  else if ((this.x - this.size) <= 0) {
    this.x = 0 + this.size;
    this.velX = -(this.velX);
  }
  
  // 检查底部边界
  if ((this.y + this.size) >= height) {
    this.y = height - this.size;
    this.velY = -(this.velY);
  }
  // 检查顶部边界
  else if ((this.y - this.size) <= 0) {
    this.y = 0 + this.size;
    this.velY = -(this.velY);
  }
  
  // 更新小球的位置
  this.x += this.velX;
  this.y += this.velY;
};


Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j] && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false; // 将碰撞的小球设置为不存在
      }
    }
  }
};

let balls = [];

while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
}

// 定义全局变量来存储恶魔圈实例
let evilCircle;

// 游戏循环函数
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // 只在第一次循环时创建恶魔圈实例并设置控制
  if (!evilCircle) {
    evilCircle = new EvilCircle(
      random(0 + 10, width - 10),
      random(0 + 10, height - 10)
    );
    evilCircle.setControls();
  }

  // 绘制和更新小球，并检测碰撞，但只针对存在的小球
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  // 调用恶魔圈实例的方法
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect(balls);

  requestAnimationFrame(loop);
}

// 在全局作用域中创建一个变量来存储 <p> 元素的引用
let scoreParagraph;
scoreParagraph = document.querySelector('p');

// 更新得分显示的函数
function updateScoreDisplay(score) {
  scoreParagraph.textContent = `还剩 ${score} 个球`;
}

// 恶魔圈构造函数
function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20);
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
  if (this.x + this.size >= width) {
    this.x = width - this.size;
  } else if (this.x - this.size <= 0) {
    this.x = 0 + this.size;
  }

  if (this.y + this.size >= height) {
    this.y = height - this.size;
  } else if (this.y - this.size <= 0) {
    this.y = 0 + this.size;
  }
};

EvilCircle.prototype.setControls = function() {
  window.onkeydown = (e) => {
    switch (e.key) {
      case 'a':
        this.x -= this.velX;
        break;
      case 'd':
        this.x += this.velX;
        break;
      case 'w':
        this.y -= this.velY;
        break;
      case 's':
        this.y += this.velY;
        break;
    }
  };
};

EvilCircle.prototype.collisionDetect = function(balls) {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        updateScoreDisplay(balls.filter(ball => ball.exists).length);
      }
    }
  }
};

// 初始化得分显示
updateScoreDisplay(balls.length);

// 开始游戏循环
loop();