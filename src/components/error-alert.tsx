import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({ title = "Something went wrong", description }: {
  title?: string;
  description: string;
}) {
  return (
    <Alert className="border-red-200 bg-red-50 text-red-900">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-4" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="text-red-700">{description}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
