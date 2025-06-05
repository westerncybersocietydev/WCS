"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Importing usePathname hook

interface PathMetadataProps {
  onPathChange: (path: string) => void; // Define prop type
}

const PathMetadata: React.FC<PathMetadataProps> = ({ onPathChange }) => {
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    onPathChange(pathname); // Update parent component when pathname changes
  }, [pathname, onPathChange]); // Run effect when pathname changes

  return null; // No rendering needed
};

export default PathMetadata;
