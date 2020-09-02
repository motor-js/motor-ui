import React from "react";
import { useTooltip } from "@vx/tooltip";
import TooltipContext from "../../context/TooltipContext";

/** Simple wrapper around useTooltip, to provide tooltip data via context. */
export default function EventProvider({ children }) {
  const tooltip = useTooltip();
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}
