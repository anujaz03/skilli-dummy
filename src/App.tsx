import TeamOrbit from "@/components/ui/team-orbit"
import { TeamMember } from "@/components/ui/team-orbit"

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

function App() {
  return (
    <div className="dark w-full h-full flex items-center justify-center">
      <TeamOrbit teamData={teamData} />
    </div>
  )
}

export default App
