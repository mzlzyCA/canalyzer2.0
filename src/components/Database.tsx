'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'screenshot' | 'trend' | 'terminology' | 'personal' | 'relation' | 'userNotes';
  label: string;
  color: string;
  imageUrl?: string;
}

interface DatabaseProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
}

export default function Database({ isOpen, onClose, screenshotUrl }: DatabaseProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      console.log('Database opened with screenshot URL:', screenshotUrl);
      // Initialize nodes when database opens
      const initialNodes: Node[] = [
        {
          id: 'screenshot',
          x: 200,
          y: 200,
          type: 'screenshot',
          label: 'Chart',
          color: '#FF7F50',
          imageUrl: screenshotUrl || undefined
        },
        {
          id: 'trend1',
          x: 100,
          y: 350,
          type: 'trend',
          label: 'Trend Analysis',
          color: '#FF7F50'
        },
        {
          id: 'terminology1',
          x: 300,
          y: 350,
          type: 'terminology',
          label: 'Terminology',
          color: '#FF7F50'
        },
        {
          id: 'personal1',
          x: 350,
          y: 100,
          type: 'personal',
          label: 'Investment Signal',
          color: '#FFB6C1'
        },
        {
          id: 'personal2',
          x: 350,
          y: 450,
          type: 'personal',
          label: 'Strategic Recommendations',
          color: '#FFB6C1'
        },
        {
          id: 'relation',
          x: 80,
          y: 150,
          type: 'relation',
          label: 'Relation',
          color: '#4ECDC4'
        },
        {
          id: 'userNotes',
          x: 320,
          y: 50,
          type: 'userNotes',
          label: 'User Notes',
          color: '#2ECC71'
        }
      ];
      setNodes(initialNodes);
    }
  }, [isOpen, screenshotUrl]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingNode(nodeId);
    setOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - offset.x;
    const newY = e.clientY - rect.top - offset.y;

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggingNode
          ? { ...node, x: newX, y: newY }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/iPhone 14 & 15 Pro Max - 13.png"
            alt="Database Background"
            fill
            className="object-cover"
          />
          {/* Dark overlay mask */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* White Canvas Overlay */}
        <div className="absolute inset-4 bottom-[76px] rounded-2xl overflow-hidden shadow-2xl">
          {/* White background layer */}
          <div className="absolute inset-0 bg-white/95 rounded-2xl z-0" />
          {/* Header */}
          <div className="relative z-20 p-4 flex items-center justify-between border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Chart Analysis Database</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Draggable Canvas */}
          <div
            ref={canvasRef}
            className="relative flex-1 h-[calc(100%-140px)] z-30"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Render connections */}
            <svg className="absolute inset-0 pointer-events-none z-40" style={{ width: '100%', height: '100%' }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="#EE896B"
                  />
                </marker>
              </defs>
              {nodes.map((node) => {
                // Draw connections based on node relationships
                if (node.id !== 'screenshot') {
                  const screenshotNode = nodes.find(n => n.id === 'screenshot');
                  if (screenshotNode) {
                    // Calculate direction for arrow
                    const dx = screenshotNode.x - node.x;
                    const dy = screenshotNode.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const offsetX = (dx / distance) * 40; // Half of screenshot node size (80px/2)
                    const offsetY = (dy / distance) * 40;
                    
                    return (
                      <g key={`line-${node.id}`}>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={screenshotNode.x - offsetX}
                          y2={screenshotNode.y - offsetY}
                          stroke="#EE896B"
                          strokeWidth="2"
                          strokeOpacity="0.8"
                          markerEnd="url(#arrowhead)"
                        />
                        {/* Add labels on connections */}
                        {node.type === 'trend' && (
                          <text
                            x={(node.x + screenshotNode.x) / 2}
                            y={(node.y + screenshotNode.y) / 2 - 5}
                            fill="#3B82F6"
                            fontSize="10"
                            textAnchor="middle"
                          >
                            HAS_PATTERN
                          </text>
                        )}
                      </g>
                    );
                  }
                }
                return null;
              })}
            </svg>

            {/* Render nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none z-50"
                style={{
                  left: node.x,
                  top: node.y,
                }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                {node.type === 'screenshot' ? (
                  <div
                    className="relative w-20 h-20 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-4"
                    style={{ 
                      backgroundColor: node.imageUrl ? 'white' : node.color,
                      borderColor: node.color
                    }}
                  >
                    {node.imageUrl ? (
                      <div className="relative w-full h-full p-1">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={node.imageUrl}
                            alt={node.label}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-white text-sm font-semibold text-center">
                        {node.label}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className="rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 px-6 py-3 min-w-[80px]"
                    style={{ 
                      backgroundColor: node.color,
                    }}
                  >
                    <span className="text-white text-sm font-semibold text-center whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                )}
                {/* Connection dot */}
                <div className="absolute top-1/2 left-full w-2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2" />
              </div>
            ))}

            {/* Add new connection button */}
            <button className="absolute bottom-20 right-4 bg-[#FFC470] text-white p-3 rounded-full shadow-lg hover:bg-[#FFB347] transition-colors z-60">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}