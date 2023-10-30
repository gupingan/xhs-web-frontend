<template>
  <canvas id="particles"></canvas>
</template>

<script>
export default {
  name: "ParticlesBackground",
  mounted() {
    var canvasStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      "z-index": -1,
    };
    var particlesElement = document.getElementById("particles");
    Object.assign(particlesElement.style, canvasStyle);

    // 获取 canvas 元素
    var canvas = document.getElementById("particles");
    var context = canvas.getContext("2d");

    // 设置画布大小
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    setCanvasSize();

    // 监听窗口大小变化事件，重新设置画布大小
    window.addEventListener("resize", setCanvasSize);

    // 创建粒子对象
    class Particle {
      constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;

        this.draw = function () {
          context.beginPath();
          context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          context.fillStyle = this.color;
          context.fill();
        };

        this.update = function () {
          this.x += this.speed.x;
          this.y += this.speed.y;

          // 边界检测，使粒子在画布内流动
          if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speed.x = -this.speed.x;
          }
          if (
            this.y + this.radius > canvas.height ||
            this.y - this.radius < 0
          ) {
            this.speed.y = -this.speed.y;
          }

          this.draw();
        };
      }
    }

    // 创建一组粒子
    var particles = [];
    for (var i = 0; i < 100; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var radius = Math.random() * 8 + 1;
      var color = "rgba(127, 255, 255, 0.5)";
      var speed = {
        x: (Math.random() - 0.5) * 1.1,
        y: (Math.random() - 0.5) * 1.1,
      };

      particles.push(new Particle(x, y, radius, color, speed));
    }

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
      }
    }

    animate();
  },
};
</script>
