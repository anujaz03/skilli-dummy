"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  img: string;
  connections: string[];
}

interface TeamOrbitProps {
  teamData: TeamMember[];
}

export default function TeamOrbit({ teamData }: TeamOrbitProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [snapTargetAngle, setSnapTargetAngle] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth auto-rotation & snapping physics
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (snapTargetAngle !== null) {
        setRotationAngle((prev) => {
          let diff = snapTargetAngle - prev;
          // Normalize difference to [-180, 180] to rotate the shortest path
          diff = ((diff + 180) % 360) - 180;
          if (diff < -180) diff += 360;

          if (Math.abs(diff) < 0.1) {
            setSnapTargetAngle(null);
            return snapTargetAngle;
          }
          return (prev + diff * 0.05) % 360;
        });
      } else if (autoRotate) {
        // Continuous premium slow crawl
        setRotationAngle((prev) => (prev + 0.08) % 360);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate, snapTargetAngle]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) {
      setActiveId(null);
      setSnapTargetAngle(null);
      setAutoRotate(true);
    }
  };

  const handleNodeClick = (id: string, index: number) => {
    setActiveId(id);
    setAutoRotate(false);
    
    // Snap clicked member to the top center position (270 degrees)
    const nodeAngle = (index / teamData.length) * 360;
    const targetAngle = 270 - nodeAngle;
    setSnapTargetAngle(targetAngle);
  };

  const activeIndex = teamData.findIndex((item) => item.id === activeId);

  // Calculate alignment/transition factor 't' based on proximity to 270 deg (top-center)
  let t = 0;
  if (activeIndex !== -1) {
    const theta = (rotationAngle + (activeIndex * 360) / teamData.length) % 360;
    let diff = theta - 270;
    diff = ((diff + 180) % 360) - 180;
    if (diff < -180) diff += 360;
    
    const minDist = Math.abs(diff);
    const transitionZone = 60; // degrees transition zone
    if (minDist < transitionZone) {
      const factor = 1 - minDist / transitionZone;
      t = factor * factor * (3 - 2 * factor); // Smooth step easing
    }
  }

  const activeMember = teamData.find((item) => item.id === activeId);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-[600px] flex items-center justify-center bg-black overflow-hidden select-none"
    >
      <div className="relative w-full max-w-3xl h-[500px] flex items-center justify-center">
        
        {/* Holographic Guide Ring */}
        <div 
          className="absolute rounded-full border border-white/10 pointer-events-none"
          style={{
            width: "480px",
            height: "480px",
          }}
        />

        {/* Central Core Sphere (fades out when details card fades in) */}
        <div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center pointer-events-none transition-opacity duration-500"
          style={{
            opacity: 1 - t,
            boxShadow: "0 0 40px rgba(6, 182, 212, 0.4)",
          }}
        >
          <div className="absolute w-28 h-28 rounded-full border border-white/20 animate-ping opacity-60"></div>
          <div className="absolute w-32 h-32 rounded-full border border-white/10 animate-ping opacity-30" style={{ animationDelay: "0.5s" }}></div>
          <div className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center">
            <span className="text-white font-mono text-xs font-semibold tracking-widest">CORE</span>
          </div>
        </div>

        {/* Vertical Connector Line from active node to center card */}
        <div
          className="absolute w-px bg-gradient-to-b from-cyan-500/80 to-transparent pointer-events-none transition-opacity duration-300"
          style={{
            height: "240px",
            top: "10px", 
            opacity: t,
          }}
        />

        {/* Stationary Glassmorphic Information Card (Centered) */}
        {activeMember && (
          <Card
            className="absolute w-80 bg-black/85 backdrop-blur-xl border-white/10 shadow-2xl shadow-cyan-900/10 pointer-events-auto transition-all duration-300 transform"
            style={{
              opacity: t,
              transform: `translateY(${(1 - t) * 15}px)`,
              pointerEvents: t > 0.5 ? "auto" : "none",
              zIndex: 100,
            }}
          >
            <CardHeader className="pb-3 text-center">
              <Badge className="mx-auto w-fit px-2.5 py-0.5 text-[10px] tracking-wider uppercase bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                {activeMember.experience}
              </Badge>
              <CardTitle className="text-lg font-bold text-white mt-2">
                {activeMember.name}
              </CardTitle>
              <p className="text-xs text-white/50 font-medium tracking-wide uppercase mt-1">
                {activeMember.role}
              </p>
            </CardHeader>
            <CardContent className="text-xs text-white/80 pb-4">
              {activeMember.connections.length > 0 && (
                <div className="mt-2 pt-3 border-t border-white/10">
                  <div className="flex items-center mb-2 text-white/50">
                    <Link size={10} className="mr-1.5" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Connected Specialists
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeMember.connections.map((connId) => {
                      const connItem = teamData.find((m) => m.id === connId);
                      const connIndex = teamData.findIndex((m) => m.id === connId);
                      if (!connItem) return null;
                      return (
                        <Button
                          key={connId}
                          variant="outline"
                          size="sm"
                          className="flex items-center h-6 px-2 py-0 text-[10px] rounded-sm border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNodeClick(connId, connIndex);
                          }}
                        >
                          {connItem.name.split(" ")[0]}
                          <ArrowRight size={8} className="ml-1 text-white/40" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Orbiting Team Member Nodes */}
        {teamData.map((item, index) => {
          const isSelected = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const isConnected = activeMember?.connections.includes(item.id) || false;

          const nodeAngle = (rotationAngle + (index / teamData.length) * 360) % 360;
          const radian = (nodeAngle * Math.PI) / 180;
          const radius = 240; 

          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);

          // Top-center position has the highest zIndex and opacity
          const zDepth = -Math.sin(radian);
          const zIndex = isSelected ? 200 : Math.round(100 + 50 * zDepth);
          const opacity = isSelected ? 1 : Math.max(0.4, 0.4 + 0.6 * ((zDepth + 1) / 2));

          // Scales: standard nodes 0.8x, active node scales up to 1.05x-1.2x
          const baseScale = 0.8;
          const scale = isSelected 
            ? 1.05 + t * 0.15 
            : isHovered 
            ? 0.95 
            : isConnected 
            ? 0.88 
            : baseScale;

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(item.id, index);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute cursor-pointer transition-all duration-300 ease-out"
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
              }}
            >
              {/* Glowing outer ring for active or connected nodes */}
              <div
                className={`absolute inset-0 -m-1.5 rounded-full transition-all duration-500 ${
                  isSelected 
                    ? "border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse" 
                    : isConnected
                    ? "border border-cyan-500/40 border-dashed animate-[spin_10s_linear_infinite]"
                    : "border border-white/0"
                }`}
              />

              {/* Profile Image (100px size container) */}
              <div 
                className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isSelected 
                    ? "border-cyan-400" 
                    : isConnected 
                    ? "border-cyan-500/50" 
                    : "border-white/20 hover:border-white/50"
                }`}
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector(".fallback-icon");
                        if (fallback) fallback.classList.remove("hidden");
                      }
                    }}
                  />
                ) : null}
                
                <div className={`fallback-icon absolute inset-0 bg-zinc-900 flex items-center justify-center ${item.img ? "hidden" : ""}`}>
                  <User className="text-zinc-500 w-8 h-8" />
                </div>
              </div>

              {/* Node label */}
              <div
                className={`absolute top-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected ? "text-cyan-400 scale-110" : "text-white/60"
                }`}
              >
                {item.name.split(" ")[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
