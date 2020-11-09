import { useCallback, useContext, useEffect } from "react";
import { localPoint } from "@visx/event";
import EventEmitterContext from "../context/EventEmitterContext";

export type EventType =
  | "mousemove"
  | "mouseout"
  | "touchmove"
  | "touchend"
  | "click";
export type HandlerParams = {
  event: React.MouseEvent | React.TouchEvent;
  svgPoint: ReturnType<typeof localPoint>;
};
export type Handler = (params?: HandlerParams) => void;

/**
 * Hook for optionally subscribing to a specified EventType,
 * and returns emitter for emitting events.
 */
export default function useEventEmitter(
  eventType?: EventType,
  handler?: Handler
) {
  const emitter = useContext(EventEmitterContext);

  /** wrap emitter.emit so we can enforce stricter type signature */
  const emit = useCallback(
    (type: EventType, event: HandlerParams["event"]) =>
      emitter?.emit(type, {
        event,
        svgPoint: localPoint(event),
      }),
    [emitter]
  );

  useEffect(() => {
    if (emitter && eventType && handler) {
      emitter.on(eventType, handler);
      return () => emitter?.off(eventType, handler);
    }
    return undefined;
  }, [emitter, eventType, handler]);

  return emitter ? emit : null;
}
