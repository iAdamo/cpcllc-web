"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Check, ArrowLeft } from "lucide-react";
import useGlobalStore from "@/stores";
import StepShell from "./StepShell";

type Role = "Client" | "Provider";

const ROLES: {
  id: Role;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  perks: string[];
  color: string;
}[] = [
  {
    id: "Client",
    icon: Briefcase,
    title: "I need services",
    subtitle: "Browse and hire trusted professionals",
    perks: [
      "Search 500+ verified providers",
      "Compare quotes & reviews",
      "Book same-day appointments",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "Provider",
    icon: Building2,
    title: "I offer services",
    subtitle: "Grow your business with new clients",
    perks: [
      "Get discovered by local clients",
      "Manage bookings & enquiries",
      "Build your professional profile",
    ],
    color: "from-violet-500 to-blue-500",
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function RoleSelect({ onNext, onBack }: Props) {
  const { onboardingData, updateOnboardingData } = useGlobalStore();
  const [selected, setSelected] = useState<Role | undefined>(
    onboardingData.role
  );

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ role: selected });
    onNext();
  };

  return (
    <StepShell
      step="Step 1"
      title="What brings you here?"
      subtitle="Choose your role — you can always change it later."
      onNext={handleContinue}
      onBack={onBack}
      nextDisabled={!selected}
      nextLabel="Continue"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map(({ id, icon: Icon, title, subtitle, perks, color }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 group focus:outline-none ${
                active
                  ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Selected check */}
              {active && (
                <motion.div
                  layoutId="role-check"
                  className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon size={22} className="text-white" />
              </div>

              <h3 className="font-black text-gray-900 text-lg mb-1">{title}</h3>
              <p className="text-gray-500 text-sm mb-4">{subtitle}</p>

              <ul className="space-y-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        active ? "bg-blue-500" : "bg-gray-300"
                      } transition-colors`}
                    />
                    <span className="text-xs text-gray-500">{perk}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}
