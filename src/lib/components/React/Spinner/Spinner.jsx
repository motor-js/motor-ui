import React, { useContext } from 'react';
import Loader from 'react-loader-spinner';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import defaultTheme from '../../../themes/defaultTheme';
import { selectColor } from '../../../utils/colors'

function Spinner({ type, size, color, timeout }) {
  const theme = useContext(ThemeContext) || defaultTheme;
  const { spinner } = theme;
  
  const colorTmp = color || spinner.color

  const spinnerColor = selectColor(colorTmp, theme)

  return (
    <span
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader
        // type='ThreeDots' // ThreeDots //Bars
        // color={color || global.color.brand}
        type={type || spinner.type}
        color={spinnerColor}
        height={size || spinner.size}
        width={size || spinner.size}
        timeout={timeout || spinner.timeout}
      />
    </span>
  );
}

Spinner.propTypes = {
  type: PropTypes.oneOf([
    'Audio',
    'BallTriangle',
    'Bars',
    'Circles',
    'Grid',
    'Hearts',
    'Oval',
    'Puff',
    'Rings',
    'TailSpin',
    'ThreeDots',
  ]),
  size: PropTypes.number,
  color: PropTypes.string,
  timeout: PropTypes.number,
};

export default Spinner;
