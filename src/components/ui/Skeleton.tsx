import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      style={{
        backgroundColor: "var(--muted)",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ...props.style
      }}
      {...props}
    />
  );
}
