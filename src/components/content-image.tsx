import Image from "next/image";

import { cn } from "@/lib/utils";

type ContentImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function ContentImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: ContentImageProps) {
  if (!src) return null;
  const remote = src.startsWith("http://") || src.startsWith("https://");
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={remote}
      priority={priority}
      className={cn(className)}
    />
  );
}
