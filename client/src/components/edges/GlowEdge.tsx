/**
 * GlowEdge - Minimal, elegant connecting lines
 * Design: Subtle, almost invisible connections
 */

import { BaseEdge, getBezierPath } from '@xyflow/react';
import { memo } from 'react';

interface GlowEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  data?: {
    color?: string;
  };
}

function GlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: GlowEdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Check if we're in dark mode by looking at document
  const isDark = typeof document !== 'undefined' && 
    document.documentElement.classList.contains('dark');

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
        strokeWidth: 1,
      }}
    />
  );
}

export default memo(GlowEdge);
