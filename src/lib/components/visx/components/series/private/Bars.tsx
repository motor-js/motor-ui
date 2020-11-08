/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BarsProps } from '../../../types';

export default function Bars({
  bars,
  horizontal,
  xScale,
  yScale,id,
  ...rectProps
}: BarsProps<any, any>) {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {bars.map(({ key, id, ...barProps }) => (
        <rect key={key} id={id} {...barProps} {...rectProps} />
      ))}
    </>
  );
}
