import React from 'react';
import { LegoBrickType } from '../../types';

interface LegoBrickSvgProps {
  type: LegoBrickType;
  color: string;
  sizeMultiplier?: number;
  className?: string;
  isGhost?: boolean;
  ghostStatus?: 'valid' | 'invalid' | 'none';
  onClick?: () => void;
}

// Mapa de cores para tonalidades 3D (Face Top = Clara, Face Esquerda = Média, Face Direita = Escura, Stud = Destaque)
const COLOR_SHADES: Record<string, { top: string; left: string; right: string; studTop: string; studSide: string }> = {
  red: {
    top: '#ff5252',
    left: '#e53935',
    right: '#c62828',
    studTop: '#ff7979',
    studSide: '#d32f2f'
  },
  orange: {
    top: '#ff9800',
    left: '#f57c00',
    right: '#e65100',
    studTop: '#ffb74d',
    studSide: '#ef6c00'
  },
  yellow: {
    top: '#ffeb3b',
    left: '#fbc02d',
    right: '#f57f17',
    studTop: '#fff176',
    studSide: '#f9a825'
  },
  green: {
    top: '#4caf50',
    left: '#388e3c',
    right: '#2e7d32',
    studTop: '#81c784',
    studSide: '#2e7d32'
  },
  blue: {
    top: '#2196f3',
    left: '#1976d2',
    right: '#1565c0',
    studTop: '#64b5f6',
    studSide: '#0d47a1'
  },
  purple: {
    top: '#ab47bc',
    left: '#8e24aa',
    right: '#6a1b9a',
    studTop: '#ba68c8',
    studSide: '#4a148c'
  },
  pink: {
    top: '#ec407a',
    left: '#d81b60',
    right: '#ad1457',
    studTop: '#f06292',
    studSide: '#880e4f'
  },
  white: {
    top: '#ffffff',
    left: '#e0e0e0',
    right: '#bdbdbd',
    studTop: '#ffffff',
    studSide: '#9e9e9e'
  },
  gray: {
    top: '#9e9e9e',
    left: '#757575',
    right: '#424242',
    studTop: '#bdbdbd',
    studSide: '#212121'
  },
  cyber: {
    top: '#00e5ff',
    left: '#00b0ff',
    right: '#0091ea',
    studTop: '#18ffff',
    studSide: '#006064'
  }
};

export const LegoBrickSvg: React.FC<LegoBrickSvgProps> = ({
  type,
  color,
  sizeMultiplier = 1,
  className = '',
  isGhost = false,
  ghostStatus = 'valid',
  onClick
}) => {
  const shades = COLOR_SHADES[color] || COLOR_SHADES['blue'];
  const strokeColor = isGhost
    ? ghostStatus === 'invalid'
      ? '#ef4444'
      : '#22c55e'
    : '#0f172a';
  const strokeW = isGhost ? '3' : '1.5';

  // Dimensões do bloco em studs de grade (largura x profundidade)
  let studsX = 2;
  let studsY = 2;
  let heightPx = 36;
  let isWindow = false;
  let isRoof = false;
  let isRobot = false;

  if (type === '1x1') {
    studsX = 1;
    studsY = 1;
  } else if (type === '2x1') {
    studsX = 2;
    studsY = 1;
  } else if (type === '2x2') {
    studsX = 2;
    studsY = 2;
  } else if (type === '2x4') {
    studsX = 4;
    studsY = 2;
  } else if (type === '4x4') {
    studsX = 4;
    studsY = 4;
  } else if (type === 'slope') {
    studsX = 2;
    studsY = 2;
  } else if (type === 'window') {
    studsX = 2;
    studsY = 2;
    heightPx = 48;
    isWindow = true;
  } else if (type === 'roof') {
    studsX = 2;
    studsY = 2;
    isRoof = true;
  } else if (type === 'robot_head') {
    studsX = 2;
    studsY = 2;
    isRobot = true;
  }

  // Projeção Isométrica Básica
  // dx = 32 por stud X, dy = 18 por stud Y
  const unitW = 32;
  const unitH = 18;

  const widthPx = (studsX + studsY) * unitW + 20;
  const totalSvgHeight = (studsX + studsY) * unitH + heightPx + 30;

  // Pontos cardeais do topo do bloco
  const topCenterX = (studsY * unitW) + 10;
  const topCenterY = 20;

  const rightCornerX = topCenterX + (studsX * unitW);
  const rightCornerY = topCenterY + (studsX * unitH);

  const bottomCornerX = topCenterX + ((studsX - studsY) * unitW);
  const bottomCornerY = topCenterY + ((studsX + studsY) * unitH);

  const leftCornerX = topCenterX - (studsY * unitW);
  const leftCornerY = topCenterY + (studsY * unitH);

  // Pontos cardeais da base inferior (Deslocados pela altura do bloco)
  const bRightX = rightCornerX;
  const bRightY = rightCornerY + heightPx;

  const bBottomX = bottomCornerX;
  const bBottomY = bottomCornerY + heightPx;

  const bLeftX = leftCornerX;
  const bLeftY = leftCornerY + heightPx;

  // Gerar posições dos pinos (Studs) na superfície superior
  const studs: Array<{ cx: number; cy: number }> = [];
  for (let sx = 0; sx < studsX; sx++) {
    for (let sy = 0; sy < studsY; sy++) {
      const cx = leftCornerX + ((sx + 0.5) * unitW) + ((sy + 0.5) * unitW);
      const cy = leftCornerY - ((sy - 0.5) * unitH) + ((sx + 0.5) * unitH) - (studsY * unitH / 2);
      studs.push({ cx, cy });
    }
  }

  const shadowClass = isGhost
    ? ghostStatus === 'invalid'
      ? 'opacity-75 drop-shadow-[0_0_14px_#ef4444]'
      : 'opacity-75 drop-shadow-[0_0_14px_#22c55e]'
    : 'active:scale-95';

  return (
    <svg
      viewBox={`0 0 ${widthPx} ${totalSvgHeight}`}
      width={widthPx * sizeMultiplier}
      height={totalSvgHeight * sizeMultiplier}
      className={`select-none transition-all ${shadowClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <g>
        {/* FACE LATERAL ESQUERDA */}
        <polygon
          fill={shades.left}
          points={`${leftCornerX},${leftCornerY} ${bottomCornerX},${bottomCornerY} ${bBottomX},${bBottomY} ${bLeftX},${bLeftY}`}
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />

        {/* FACE LATERAL DIREITA */}
        <polygon
          fill={shades.right}
          points={`${bottomCornerX},${bottomCornerY} ${rightCornerX},${rightCornerY} ${bRightX},${bRightY} ${bBottomX},${bBottomY}`}
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />

        {/* FACE SUPERIOR (TOPO) */}
        {!isRoof ? (
          <polygon
            fill={shades.top}
            points={`${topCenterX},${topCenterY} ${rightCornerX},${rightCornerY} ${bottomCornerX},${bottomCornerY} ${leftCornerX},${leftCornerY}`}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        ) : (
          /* Face de Telhado Piramidal */
          <polygon
            fill={shades.top}
            points={`${topCenterX},${topCenterY - 12} ${rightCornerX},${rightCornerY} ${bottomCornerX},${bottomCornerY} ${leftCornerX},${leftCornerY}`}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />
        )}

        {/* JANELA ROBÓTICA COM PEITORIL E VIDRO */}
        {isWindow && (
          <g>
            <polygon
              fill="#e2e8f0"
              points={`${leftCornerX + 8},${leftCornerY + 12} ${bottomCornerX - 8},${bottomCornerY + 12} ${bottomCornerX - 8},${bBottomY - 10} ${leftCornerX + 8},${bLeftY - 10}`}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <polygon
              fill="#38bdf8"
              opacity="0.85"
              points={`${leftCornerX + 12},${leftCornerY + 16} ${bottomCornerX - 12},${bottomCornerY + 16} ${bottomCornerX - 12},${bBottomY - 14} ${leftCornerX + 12},${bLeftY - 14}`}
            />
            {/* Grade de Vidro da Janela */}
            <line
              x1={(leftCornerX + bottomCornerX) / 2}
              y1={leftCornerY + 14}
              x2={(leftCornerX + bottomCornerX) / 2}
              y2={bBottomY - 12}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* CABEÇA DE ROBÔ COM VISEIRA LED E ANTENA */}
        {isRobot && (
          <g>
            {/* Antena Robótica com Luz Pulsante */}
            <line
              x1={topCenterX}
              y1={topCenterY}
              x2={topCenterX}
              y2={topCenterY - 16}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <circle
              cx={topCenterX}
              cy={topCenterY - 18}
              r="4.5"
              fill="#ffd166"
              stroke="#0f172a"
              strokeWidth="1.5"
            />

            {/* Viseira com Olhos LED */}
            <polygon
              fill="#0f172a"
              points={`${leftCornerX + 6},${leftCornerY + 8} ${bottomCornerX - 6},${bottomCornerY + 8} ${bottomCornerX - 6},${bBottomY - 16} ${leftCornerX + 6},${bLeftY - 16}`}
            />
            <ellipse cx={(leftCornerX + bottomCornerX) / 2 - 8} cy={(leftCornerY + bottomCornerY) / 2 + 10} rx="3" ry="3.5" fill="#38bdf8" />
            <ellipse cx={(leftCornerX + bottomCornerX) / 2 + 8} cy={(leftCornerY + bottomCornerY) / 2 + 10} rx="3" ry="3.5" fill="#38bdf8" />
          </g>
        )}

        {/* PINOS DE ENCAIXE (STUDS) 3D NO TOPO */}
        {!isRoof && !isRobot && studs.map((st, i) => (
          <g key={i}>
            {/* Corpo Cilíndrico do Pino */}
            <rect
              x={st.cx - 6}
              y={st.cy - 7}
              width="12"
              height="7"
              rx="3"
              ry="3"
              fill={shades.studSide}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Superfície Superior Oval do Pino */}
            <ellipse
              cx={st.cx}
              cy={st.cy - 7}
              rx="6"
              ry="3.5"
              fill={shades.studTop}
              stroke="#0f172a"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
    </svg>
  );
};
