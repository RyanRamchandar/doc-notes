import { type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        {icon ? <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">{icon}</div> : null}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
