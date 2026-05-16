import type { CSSProperties, ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  hover = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`glass rounded-lg ${
        hover
          ? "group transition-all duration-200 hover:border-primary/45 hover:bg-card/85"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
