import { cn } from "@/lib/utils";
import { Dumbbell, Languages, Music2, Zap, Package } from "lucide-react";
import { useId } from "react";

export type TemplateType = "none" | "boxing" | "gym" | "music" | "language";

export function TemplateSelection({
  value,
  onChange,
  className,
}: {
  value: TemplateType;
  onChange: (v: TemplateType) => void;
  className?: string;
}) {
  const name = useId();
  const options: Array<{
    key: TemplateType;
    label: string;
    desc: string;
    icon: any;
    gradient: string;
  }> = [
    { key: "none", label: "Blank", desc: "Simple tracking", icon: Package, gradient: "from-gray-400 to-gray-600" },
    { key: "boxing", label: "Boxing", desc: "Like Boxing page", icon: Zap, gradient: "from-red-500 to-orange-500" },
    { key: "gym", label: "Gym", desc: "Like Gym page", icon: Dumbbell, gradient: "from-green-500 to-blue-500" },
    { key: "music", label: "Music", desc: "Like Oud page", icon: Music2, gradient: "from-purple-500 to-pink-500" },
    { key: "language", label: "Languages", desc: "Like German/Spanish", icon: Languages, gradient: "from-yellow-500 to-red-500" },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const checked = value === opt.key;
        return (
          <label key={opt.key} className={cn(
            "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition",
            checked ? "border-purple-500 ring-2 ring-purple-200 bg-purple-50" : "hover:bg-gray-50"
          )}>
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(opt.key)}
            />
            <div className={cn(
              "w-9 h-9 rounded-md text-white flex items-center justify-center bg-gradient-to-r",
              opt.gradient
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{opt.label}</div>
              <div className="text-xs text-gray-500 truncate">{opt.desc}</div>
            </div>
            <div className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center",
              checked ? "border-purple-600" : "border-gray-300"
            )}>
              {checked && <div className="w-2 h-2 rounded-full bg-purple-600" />}
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default TemplateSelection;
