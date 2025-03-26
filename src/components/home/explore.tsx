"use client";
import "./explore.scss";
import { useEffect, useState, useRef, useCallback } from "react";
import { bubbleColors } from "@/constants/bubble";
import { useUserStore } from "@/stores/userStore";

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

// 计算气泡数量
const calculateBubbleCount = () => {
  const width = window.innerWidth;
  const baseCount = 6;
  const increment = Math.floor((width - 768) / 300) * 4;
  return Math.min(Math.max(baseCount + increment, 8), 36);
};

// 气泡组件
interface Bubble {
  address: string;
  username: string;
}
interface BubbleProps extends Bubble {
  innerWidth: number;
  innerHeight: number;
}

const Bubble = ({
  username,
  address,
  innerWidth,
  innerHeight,
}: BubbleProps) => {
  const bubbleRef = useRef<HTMLAnchorElement>(null);

  const sizeFactor =
    innerWidth < 768
      ? Math.max(innerWidth, innerHeight) / 1000
      : Math.min(innerWidth, innerHeight) / 1000;

  // 根据名称生成一个固定的随机大小
  const nameHash = hashString(username);
  const originalSize = 120 + (nameHash % 36);
  const adjustedSize = Math.round(originalSize * sizeFactor);

  // 随机位置
  const initialX = Math.random() * (innerWidth - adjustedSize);
  const initialY = Math.random() * (innerHeight - adjustedSize);

  // 根据地址生成一个固定的随机颜色
  const colorIndex = hashString(address) % bubbleColors.length;
  const backgroundColor = bubbleColors[colorIndex];

  // 动画参数
  const duration = 20 + Math.random() * 40;
  const delay = Math.random() * 5;

  // 气泡样式
  const bubbleStyle = {
    width: `${adjustedSize}px`,
    height: `${adjustedSize}px`,
    left: `${initialX}px`,
    top: `${initialY}px`,
    background: backgroundColor,
    fontSize: `${Math.max(14, adjustedSize / 5)}px`,
    padding: `${(adjustedSize / 14).toFixed(0)}px`,
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
  };

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    const size = adjustedSize;
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size - 64;

    // 根据屏幕大小调整移动速度
    const speedFactor = Math.min(window.innerWidth, window.innerHeight) / 1500;

    // 随机速度和方向，屏幕越小速度越慢
    let speedX = (Math.random() - 0.5) * 0.5 * speedFactor;
    let speedY = (Math.random() - 0.5) * 0.5 * speedFactor;

    let x = initialX;
    let y = initialY;

    let animationFrameId: number;

    function updatePosition() {
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
      if (bubble) {
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
      }

      // 继续动画
      animationFrameId = requestAnimationFrame(updatePosition);
    }

    // 开始动画
    updatePosition();

    // 清理函数
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [adjustedSize, initialX, initialY]);

  return (
    <a ref={bubbleRef} className="bubble" style={bubbleStyle}>
      {username}
    </a>
  );
};

export default function HomeExplore() {
  const onlinePeople = useUserStore((state) => state.onlinePeople);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const [innerWidth, setInnerWidth] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 处理窗口大小变化（添加防抖）
  const handleResize = useCallback(() => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 设置新的定时器，2秒后执行
    debounceTimerRef.current = setTimeout(() => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    }, 1000);
  }, []);

  // 初始化气泡数据
  useEffect(() => {
    if (Object.keys(onlinePeople).length === 0) return;

    const bubbleCount = calculateBubbleCount();
    const selectedBubbles = Object.keys(onlinePeople)
      .map((key) => {
        return { address: key, username: onlinePeople[key].value };
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, bubbleCount);

    // mock
    // const selectedBubbles = bubbleNames
    //   .map((key) => {
    //     return { address: key, username: key };
    //   })
    //   .sort(() => Math.random() - 0.5)
    //   .slice(0, bubbleCount);

    setBubbles(selectedBubbles);
    handleResize();
  }, [onlinePeople, handleResize]);

  // 监听窗口大小变化
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // 监听屏幕方向变化
    window.addEventListener("orientationchange", handleResize);
    return () => {
      // 清理事件监听和定时器
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div className="bubbles-container" id="bubblesContainer">
      {bubbles.map((bubble, index) => (
        <Bubble
          key={`${bubble.address}-${index}`}
          username={bubble.username}
          address={bubble.address}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
        />
      ))}
    </div>
  );
}
