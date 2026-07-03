'use client';

import React, { useEffect, useRef, useState } from 'react';

type VisionKey = 'challenging' | 'creative' | 'ceaseless';

const visionData: Record<
  VisionKey,
  {
    label: string;
    color: string;
    description: string;
    startAngle: number;
    endAngle: number;
  }
> = {
  challenging: {
    label: 'challenging',
    color: '#727343',
    startAngle: -90,
    endAngle: 30,
    description:
      '"도전"은 자신의 한계를 넘어서는 새로운 목표를 설정하고, 이를 달성하기 위해 노력하는 정신을 의미합니다. UNTOC의 부원은 끊임없이 더 어려운 문제에 도전하고, 스스로 성장하기 위해 학습하며, 때로는 동아리 내외의 코딩 대회에 참여해 자신의 역량을 시험해 봅니다. 이런 도전은 더 뛰어난 개발자가 될 수 있도록 돕습니다.',
  },
  ceaseless: {
    label: 'ceaseless',
    color: '#F7D988',
    startAngle: 30,
    endAngle: 150,
    description:
      '"끊임없는"은 코딩과 문제 해결에 대한 지속적인 열정과 노력을 의미합니다. UNTOC은 프로그래밍 언어를 배우거나 복잡한 알고리즘 문제를 해결할 때, 어려움에 직면하더라도 포기하지 않고 계속해서 시도하는 태도를 중요하게 생각합니다. ',
  },
  creative: {
    label: 'creative',
    color: '#6D4E48',
    startAngle: 150,
    endAngle: 270,
    description:
      '"창의"는 코딩에서 독창적인 아이디어와 혁신적인 방법을 적용하는 능력을 뜻합니다. UNTOC은 단순히 기존의 코드나 해결 방식을 반복하는 것이 아니라, 새로운 문제 해결 방법을 탐구하고, 효율적인 코드를 작성하는 것을 장려합니다. 창의력은 복잡한 프로젝트를 보다 간단하고 효율적으로 완성할 수 있는 열쇠가 됩니다.',
  },
};

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function getLabelPosition(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const midAngle = (startAngle + endAngle) / 2;
  return polarToCartesian(cx, cy, r, midAngle);
}

function getRotation(selected: VisionKey | null) {
  if (!selected) return 0;

  const item = visionData[selected];
  const midAngle = (item.startAngle + item.endAngle) / 2;

  return -midAngle + 90;
}

export default function VisionChart() {
  const [selected, setSelected] = useState<VisionKey | null>(null);
  const [showText, setShowText] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rotation = getRotation(selected);
  const keys = Object.keys(visionData) as VisionKey[];

  const handleClick = (key: VisionKey) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShowText(false);
    setIsRotating(true);
    setSelected(key);

    timerRef.current = setTimeout(() => {
      setIsRotating(false);
      setShowText(true);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`mt-10 flex items-center transition-all duration-700 ${
        selected ? 'justify-center gap-12' : 'justify-center'
      }`}
    >
      {/* 차트 */}
      <div
        className={`transition-all duration-700 ${
          selected ? 'w-[430px] h-[430px]' : 'w-[460px] h-[460px]'
        }`}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: '250px 250px',
              transition: 'transform 0.7s ease',
            }}
          >
            {keys.map((key) => {
              const item = visionData[key];
              const isSelected = selected === key;
              const isDimmed = selected !== null && selected !== key;
              const labelPos = getLabelPosition(
                250,
                250,
                135,
                item.startAngle,
                item.endAngle
              );

              return (
                <g
                  key={key}
                  onClick={() => handleClick(key)}
                  className="cursor-pointer"
                >
                  <path
                    d={describeArc(
                      250,
                      250,
                      250,
                      item.startAngle,
                      item.endAngle
                    )}
                    fill={isDimmed ? '#C9C6BF' : item.color}
                    stroke="#FDFAF5"
                    strokeWidth="8"
                    className="transition-all duration-500 hover:brightness-105"
                  />

                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${-rotation}, ${labelPos.x}, ${labelPos.y})`}
                    className="select-none text-[30px] font-extrabold transition-opacity duration-300"
                    fill={isSelected ? '#FFFFFF' : isDimmed ? '#7F7A76' : '#2F241F'}
                    opacity={showText && !isRotating ? 1 : 0}
                    style={{
                      textShadow: '1px 2px 0 rgba(0,0,0,0.18)',
                    }}
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 설명 박스 */}
      {selected && (
        <div className="w-[520px] h-[550px] rounded-2xl bg-[#FFF6CF] px-12 py-10 shadow-[0_0_45px_rgba(242,223,145,0.55)] transition-all duration-500">
            <p
                className={`text-[#6B514A] text-2xl leading-[2.1] font-medium transition-opacity duration-300 ${
                    showText && !isRotating ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                {visionData[selected].description}
            </p>
        </div>
    )}
        </div>
  );
}