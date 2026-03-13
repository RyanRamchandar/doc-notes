import { cn } from "@/lib/utils";

export function AudioLevelMeter({ level }: { level: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
        <span>Input level</span>
        <span>{Math.round(level * 100)}%</span>
      </div>
      <div className="grid h-3 grid-cols-12 gap-1 rounded-full bg-slate-100 p-1">
        {Array.from({ length: 12 }).map((_, index) => {
          const threshold = (index + 1) / 12;
          const active = level >= threshold - 1 / 12;
          return (
            <div
              key={index}
              className={cn(
                "rounded-full bg-slate-200 transition-colors",
                active && "bg-emerald-500",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
