import { useEffect } from "react";
import bubbleData from "@/assets/json/bubbleData.json";
import "./explore.scss";

function calculateBubbleCount() {
  const width = window.innerWidth;
  // const height = window.innerHeight;

  // 移动端(< 768px)时保持至少14个气泡
  if (width <= 768) {
    return 14;
  }

  // 桌面端根据屏幕大小计算
  const baseCount = 14;
  const increment = Math.floor((width - 768) / 300) * 4;
  return Math.min(Math.max(baseCount + increment, 8), 36);
}

// 创建气泡
function createBubbles() {
  const container = document.getElementById("bubblesContainer");
  if (!container) return; // 添加空值检查
  container.innerHTML = ""; // 清空容器

  const bubbleCount = calculateBubbleCount();
  // 随机选择气泡数据
  const selectedBubbles = [...bubbleData]
    .sort(() => Math.random() - 0.5)
    .slice(0, bubbleCount);

  // 根据屏幕大小调整气泡尺寸
  const sizeFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;

  selectedBubbles.forEach((data) => {
    const bubble = document.createElement("a");
    // if (data.url) {
    //   // 只在有 url 时设置 href
    //   bubble.href = data.url;
    //   bubble.target = "_blank";
    // }
    bubble.className = "bubble";
    bubble.textContent = data.label;

    // 根据屏幕尺寸调整气泡大小
    const originalSize = parseInt(data.size);
    const adjustedSize = Math.max(60, Math.round(originalSize * sizeFactor));

    // 随机位置
    const randomX = Math.random() * (window.innerWidth - adjustedSize);
    const randomY = Math.random() * (window.innerHeight - adjustedSize);

    // 设置样式
    bubble.style.width = `${adjustedSize}px`;
    bubble.style.height = `${adjustedSize}px`;
    bubble.style.left = `${randomX}px`;
    bubble.style.top = `${randomY}px`;
    bubble.style.background = data.color;

    // 调整字体大小以适应气泡尺寸
    bubble.style.fontSize = `${Math.max(14, adjustedSize / 5)}px`;
    bubble.style.padding = `${(adjustedSize / 14).toFixed(0)}px`;

    // 添加动画
    const duration = 20 + Math.random() * 40;
    const delay = Math.random() * 5;

    bubble.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    // 添加到容器
    container.appendChild(bubble);

    // 设置随机漂浮动画
    animateBubble(bubble);
  });
}

// 气泡漂浮动画
function animateBubble(bubble: HTMLAnchorElement) {
  const size = parseInt(bubble.style.width);
  const maxX = window.innerWidth - size;
  const maxY = window.innerHeight - size - 64;

  // 根据屏幕大小调整移动速度
  const speedFactor = Math.min(window.innerWidth, window.innerHeight) / 1500;

  // 随机速度和方向，屏幕越小速度越慢
  let speedX = (Math.random() - 0.5) * 0.5 * speedFactor;
  let speedY = (Math.random() - 0.5) * 0.5 * speedFactor;

  function updatePosition() {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);

    // 更新位置
    x += speedX;
    y += speedY;

    // 碰到边界反弹
    if (x <= 0 || x >= maxX) {
      speedX = -speedX;
      x = Math.max(0, Math.min(x, maxX));
    }

    if (y <= 0 || y >= maxY) {
      speedY = -speedY;
      y = Math.max(0, Math.min(y, maxY));
    }

    // 应用新位置
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    // 继续动画
    requestAnimationFrame(updatePosition);
  }

  // 开始动画
  updatePosition();
}

export default function HomeExplore() {
  useEffect(() => {
    createBubbles();
  }, []);
  return (
    <>
      <div className="bubbles-container" id="bubblesContainer"></div>
    </>
  );
}
