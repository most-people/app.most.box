"use client";
import { useEffect } from "react";
import bubbleData from "@/assets/json/bubbleData.json";
import "./explore.scss";

const bubbleColors = [
  "rgba(128, 128, 128, 0.6)",
  "rgba(66, 133, 244, 0.6)",
  "rgba(219, 68, 55, 0.6)",
  "rgba(15, 157, 88, 0.6)",
  "rgba(244, 180, 0, 0.6)",
  "rgba(170, 71, 188, 0.6)",
  "rgba(233, 30, 99, 0.6)",
  "rgba(0, 188, 212, 0.6)",
  "rgba(255, 152, 0, 0.6)",
  "rgba(121, 85, 72, 0.6)",
  "rgba(2, 128, 144, 0.6)",
  "rgba(51, 51, 51, 0.6)",
  "rgba(0, 150, 136, 0.6)",
  "rgba(255, 99, 71, 0.6)",
  "rgba(30, 144, 255, 0.6)",
  "rgba(255, 69, 0, 0.6)",
  "rgba(244, 128, 36, 0.6)",
  "rgba(255, 0, 0, 0.6)",
  "rgba(0, 163, 136, 0.6)",
  "rgba(29, 161, 242, 0.6)",
  "rgba(0, 119, 181, 0.6)",
  "rgba(225, 48, 108, 0.6)",
  "rgba(66, 103, 178, 0.6)",
  "rgba(229, 9, 20, 0.6)",
  "rgba(255, 153, 0, 0.6)",
  "rgba(0, 191, 99, 0.6)",
  "rgba(234, 82, 60, 0.6)",
  "rgba(0, 170, 160, 0.6)",
  "rgba(30, 215, 96, 0.6)",
  "rgba(0, 0, 0, 0.6)",
  "rgba(230, 0, 35, 0.6)",
  "rgba(114, 137, 218, 0.6)",
  "rgba(0, 136, 204, 0.6)",
  "rgba(0, 120, 215, 0.6)",
];

// 计算字符串哈希值
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// 根据文字获取固定颜色
// const getColorFromText = (text: string) => {
//   const hash = hashString(text);
//   return bubbleColors[hash % bubbleColors.length];
// };
// 获取随机颜色
const getRandomColor = () => {
  return bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
};

// 计算气泡数量
const calculateBubbleCount = () => {
  const width = window.innerWidth;
  // const height = window.innerHeight;

  // 桌面端根据屏幕大小计算
  const baseCount = 14;
  const increment = Math.floor((width - 768) / 300) * 4;
  return Math.min(Math.max(baseCount + increment, 8), 36);
};

// 创建气泡
const createBubbles = () => {
  const container = document.getElementById("bubblesContainer");
  if (!container) return; // 添加空值检查
  container.innerHTML = ""; // 清空容器

  const bubbleCount = calculateBubbleCount();
  // 随机选择气泡数据
  const selectedBubbles = [...bubbleData]
    .sort(() => Math.random() - 0.5)
    .slice(0, bubbleCount);

  // 根据屏幕大小调整气泡尺寸

  const sizeFactor = isLandscape()
    ? Math.min(window.innerWidth, window.innerHeight) / 1000
    : Math.max(window.innerWidth, window.innerHeight) / 1000;

  selectedBubbles.forEach((data, index) => {
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
    const adjustedSize = Math.round(originalSize * sizeFactor);

    // 随机位置
    const randomX = Math.random() * (window.innerWidth - adjustedSize);
    const randomY = Math.random() * (window.innerHeight - adjustedSize);

    // 设置样式
    bubble.style.width = `${adjustedSize}px`;
    bubble.style.height = `${adjustedSize}px`;
    bubble.style.left = `${randomX}px`;
    bubble.style.top = `${randomY}px`;
    bubble.style.background = bubbleColors[index % bubbleColors.length];

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
};

// 气泡漂浮动画
const animateBubble = (bubble: HTMLAnchorElement) => {
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
};

const isLandscape = () => {
  return window.matchMedia("(orientation: landscape)").matches;
};

export default function HomeExplore() {
  useEffect(() => {
    createBubbles();

    // 监听屏幕方向变化
    const mediaQuery = window.matchMedia("(orientation: landscape)");
    const handleOrientationChange = () => {
      createBubbles();
    };

    mediaQuery.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);
  return <div className="bubbles-container" id="bubblesContainer"></div>;
}
