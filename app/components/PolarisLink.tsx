import type { ReactNode } from "react";
import { Link } from "react-router";

interface PolarisLinkProps {
  url: string;
  children?: ReactNode;
  external?: boolean;
  [key: string]: unknown;
}

export function PolarisLink({
  url,
  children,
  external,
  ...rest
}: PolarisLinkProps) {
  if (external) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
}
