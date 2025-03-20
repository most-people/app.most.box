import { useEffect } from "react";
import "./explore.scss";

interface BubbleItem {
  label: string;
  size: string;
  color: string;
  url?: string; // 可选的 url 属性
}

const bubbleData: BubbleItem[] = [
  { label: "春风十里", size: "135px", color: "rgba(128, 128, 128, 0.6)" },
  { label: "小明", size: "120px", color: "rgba(66, 133, 244, 0.6)" },
  { label: "张三丰", size: "130px", color: "rgba(219, 68, 55, 0.6)" },
  { label: "John", size: "100px", color: "rgba(15, 157, 88, 0.6)" },
  { label: "さくら", size: "115px", color: "rgba(244, 180, 0, 0.6)" },
  { label: "Mohammed", size: "150px", color: "rgba(170, 71, 188, 0.6)" },
  { label: "李小龙", size: "125px", color: "rgba(233, 30, 99, 0.6)" },
  {
    label: "Maria García",
    size: "135px",
    color: "rgba(0, 188, 212, 0.6)",
  },
  { label: "王大锤", size: "110px", color: "rgba(255, 152, 0, 0.6)" },
  { label: "Sophie", size: "95px", color: "rgba(121, 85, 72, 0.6)" },
  { label: "김민준", size: "120px", color: "rgba(2, 128, 144, 0.6)" },
  { label: "Alexander", size: "150px", color: "rgba(51, 51, 51, 0.6)" },
  { label: "中二病少年", size: "150px", color: "rgba(0, 150, 136, 0.6)" },
  { label: "Giuseppe", size: "125px", color: "rgba(255, 99, 71, 0.6)" },
  {
    label: "网络冲浪者",
    size: "140px",
    color: "rgba(30, 144, 255, 0.6)",
  },
  { label: "Carlos", size: "105px", color: "rgba(255, 69, 0, 0.6)" },
  {
    label: "星空漫步者",
    size: "160px",
    color: "rgba(244, 128, 36, 0.6)",
  },
  { label: "Anastasia", size: "130px", color: "rgba(255, 0, 0, 0.6)" },
  { label: "码农一号", size: "120px", color: "rgba(0, 163, 136, 0.6)" },
  { label: "Viktor", size: "115px", color: "rgba(29, 161, 242, 0.6)" },
  { label: "夜雨江湖", size: "140px", color: "rgba(0, 119, 181, 0.6)" },
  { label: "Pierre", size: "100px", color: "rgba(225, 48, 108, 0.6)" },
  { label: "花花世界", size: "125px", color: "rgba(66, 103, 178, 0.6)" },
  { label: "山田太郎", size: "130px", color: "rgba(255, 69, 0, 0.6)" },
  {
    label: "Digital Nomad",
    size: "155px",
    color: "rgba(229, 9, 20, 0.6)",
  },
  { label: "Anders", size: "110px", color: "rgba(255, 153, 0, 0.6)" },
  { label: "追梦人", size: "135px", color: "rgba(0, 191, 99, 0.6)" },
  { label: "Hans", size: "95px", color: "rgba(234, 82, 60, 0.6)" },
  { label: "快乐星球", size: "140px", color: "rgba(0, 170, 160, 0.6)" },
  { label: "Ahmed", size: "120px", color: "rgba(30, 215, 96, 0.6)" },
  { label: "孤独的美食家", size: "150px", color: "rgba(0, 0, 0, 0.6)" },
  { label: "Elena", size: "125px", color: "rgba(230, 0, 35, 0.6)" },
  {
    label: "深海探险家",
    size: "145px",
    color: "rgba(114, 137, 218, 0.6)",
  },
  { label: "Lars", size: "105px", color: "rgba(0, 136, 204, 0.6)" },
  { label: "云端漫步", size: "130px", color: "rgba(0, 120, 215, 0.6)" },
  { label: "Dimitri", size: "140px", color: "rgba(66, 133, 244, 0.6)" },
  { label: "春风十里", size: "135px", color: "rgba(128, 128, 128, 0.6)" },
];

function calculateBubbleCount() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 移动端(< 768px)时保持至少8个气泡
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
  // 选择数量对应的气泡数据
  // const selectedBubbles = bubbleData.slice(0, bubbleCount);
  // 随机选择气泡数据
  const selectedBubbles = [...bubbleData]
    .sort(() => Math.random() - 0.5)
    .slice(0, bubbleCount);

  // 根据屏幕大小调整气泡尺寸
  const sizeFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;

  selectedBubbles.forEach((data) => {
    const bubble = document.createElement("a");
    if (data.url) {
      // 只在有 url 时设置 href
      bubble.href = data.url;
      bubble.target = "_blank";
    }
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
    bubble.style.fontSize = `${Math.max(12, adjustedSize / 5)}px`;

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
  const maxY = window.innerHeight - size;

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
