import { formatSeconds } from "@/lib/utils";

export function ElapsedTimer({ seconds }: { seconds: number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Elapsed</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
        {formatSeconds(seconds)}
      </p>
    </div>
  );
}
