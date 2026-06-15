"use client";

import TeamOrbit, { TeamMember } from "@/components/ui/team-orbit";

const teamData: TeamMember[] = [
  {
    id: "siddhi",
    name: "Siddhi Kawade",
    role: "Frontend Engineering & User Experience",
    experience: "2 Years Experience",
    img: "/assets/team/siddhi-k.png",
    connections: ["vishwanath", "datta"]
  },
  {
    id: "vishwanath",
    name: "Vishwanath Hatti",
    role: "Full-Stack Development & Platform Architecture",
    experience: "4 Years Experience",
    img: "/assets/team/vishwanath-hatti.png",
    connections: ["siddhi", "prathmesh"]
  },
  {
    id: "prathmesh",
    name: "Prathmesh Ghatmal",
    role: "Product Engineering & Technology Strategy",
    experience: "4 Years Experience",
    img: "/assets/team/prathmesh.png",
    connections: ["vishwanath", "anish"]
  },
  {
    id: "anish",
    name: "Anish",
    role: "AI/ML Engineering & Automation",
    experience: "4 Years Experience",
    img: "/assets/team/anish.png",
    connections: ["prathmesh", "anurag"]
  },
  {
    id: "anurag",
    name: "Anurag Kumar Goutam",
    role: "AI/ML Engineering & Intelligent Systems",
    experience: "3 Years Experience",
    img: "/assets/team/anurag-team.png",
    connections: ["anish", "datta"]
  },
  {
    id: "datta",
    name: "Datta Panchal",
    role: "Full-Stack Systems Engineering",
    experience: "3 Years Experience",
    img: "/assets/team/datta-team.png",
    connections: ["anurag", "siddhi"]
  }
];

export function TeamOrbitDemo() {
  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-8 max-w-xl">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Operating Core</span>
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          The specialists behind SKILLI. Orbiting around our central mission, our team coordinates to deliver high-performance custom engineering.
        </p>
      </div>
      <div className="w-full max-w-4xl border border-zinc-800/50 rounded-xl overflow-hidden bg-zinc-950/20 backdrop-blur-3xl shadow-2xl">
        <TeamOrbit teamData={teamData} />
      </div>
    </div>
  );
}

export default TeamOrbitDemo;
