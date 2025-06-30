import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      fill="currentColor"
    >
      <path d="M50 15L85 35V75L50 95L15 75V35L50 15Z" className="text-primary/70" />
      <path d="M50 25L75 40V70L50 85L25 70V40L50 25Z" className="text-primary" />
      <path d="M50 35L65 45V65L50 75L35 65V45L50 35Z" className="text-background" />
      <circle cx="50" cy="55" r="5" className="text-primary" />
    </svg>
  );
}
