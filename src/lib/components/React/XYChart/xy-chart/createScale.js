import {
  scaleLinear,
  scaleTime,
  scaleUtc,
  scaleBand,
  scaleOrdinal,
} from "@vx/scale";
import { extent } from "d3-array";

export default function createScale({
  data,
  range: defaultRange,
  scaleConfig,
}) {
  const { includeZero, type: scaleType, ...restConfig } = scaleConfig;

  // use blocks so types are happy
  if (scaleType === "band") {
    const range = restConfig.range || defaultRange;
    return scaleBand({
      domain: data,
      ...restConfig,
      range,
    });
  }
  if (scaleType === "ordinal") {
    const range = restConfig.range || defaultRange;
    return scaleOrdinal({
      domain: data,
      ...restConfig,
      range,
    });
  }
  if (scaleType === "linear") {
    const [min, max] = extent(data, (d) => d);
    const domain = restConfig.domain || [
      scaleType === "linear" && includeZero ? Math.min(0, min) : min,
      scaleType === "linear" && includeZero ? Math.max(0, max) : max,
    ];
    const range = restConfig.range || defaultRange;
    return scaleLinear({
      ...restConfig,
      domain,
      range,
    });
  }
  if (scaleType === "time" || scaleType === "timeUtc") {
    const range = restConfig.range || defaultRange;
    const domain = restConfig.domain || extent(data, (d) => d);

    return (scaleType === "time" ? scaleTime : scaleUtc)({
      ...restConfig,
      domain,
      range,
    });
  }

  return scaleLinear({});
}
