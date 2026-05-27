import { useRef, useState } from 'react'

/**
 * Drag-to-dismiss for bottom-sheets. Spread `handleProps` on the grab handle
 * and `style` on the sheet container. Dragging the handle down past the
 * threshold (or with enough velocity) calls `onClose`; otherwise it snaps back.
 */
export function useSheetDrag(onClose, { threshold = 110 } = {}) {
  const [dy, setDy] = useState(0)
  const [active, setActive] = useState(false)
  const startY = useRef(0)
  const dragging = useRef(false)

  function onPointerDown(e) {
    startY.current = e.clientY
    dragging.current = true
    setActive(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    const d = e.clientY - startY.current
    setDy(d > 0 ? d : d * 0.2) // resist upward pull
  }
  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    if (dy > threshold) onClose()
    else setDy(0)
  }

  return {
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      style: { touchAction: 'none', cursor: 'grab' },
    },
    style: active
      ? {
          transform: `translateY(${Math.max(0, dy)}px)`,
          transition: dragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
        }
      : undefined,
  }
}
