"use client";

import { useState } from "react";

export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  preventDefaultTouchmoveEvent = false,
  trackMouse = false,
  swipeThreshold = 50,
}) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (preventDefaultTouchmoveEvent) e.preventDefault();
    if (!isSwiping) return;

    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    // Check if it's a horizontal or vertical swipe based on which delta is larger
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          onSwipedLeft?.();
        } else {
          onSwipedRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0) {
          onSwipedUp?.();
        } else {
          onSwipedDown?.();
        }
      }
    }
  };

  const handlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };

  // Add mouse handlers if trackMouse is true
  if (trackMouse) {
    handlers.onMouseDown = (e) => {
      setTouchEnd({ x: 0, y: 0 });
      setTouchStart({ x: e.clientX, y: e.clientY });
      setIsSwiping(true);
    };

    handlers.onMouseMove = (e) => {
      if (!isSwiping) return;
      setTouchEnd({ x: e.clientX, y: e.clientY });
    };

    handlers.onMouseUp = onTouchEnd;
  }

  return handlers;
}
