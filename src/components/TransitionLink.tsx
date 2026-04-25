"use client";

import { useRouter } from "next/navigation";
import { startTransition, type MouseEvent, type ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function TransitionLink({ href, children, className, title }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let browser handle external links and modifier-key clicks (new tab, etc.)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (!href.startsWith("/")) return;

    e.preventDefault();

    if (!("startViewTransition" in document)) {
      router.push(href);
      return;
    }

    (document as Document & { startViewTransition(cb: () => void): void })
      .startViewTransition(() => {
        startTransition(() => {
          router.push(href);
        });
      });
  };

  return (
    <a href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  );
}
