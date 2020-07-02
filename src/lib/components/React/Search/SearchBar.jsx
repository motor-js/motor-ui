import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import StyledSearch from './StyledSearch';
import { ConfigContext } from '../../../contexts/ConfigProvider';
import defaultTheme from '../../../themes/defaultTheme';
import { EngineContext } from '../../../contexts/EngineProvider';
import useEngine from '../../../hooks/useEngine';

const SearchBar = ({ config, ...rest }) => {
  const myConfig = config || useContext(ConfigContext);
  const myTheme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledSearch
      engine={engine}
      theme={myTheme}
      engineError={engineError}
      {...rest}
    />
  );
};

SearchBar.propTypes = {
  /* Configure connection to the Qlik engine */
  config: PropTypes.object,
  /* list of dimensions to search for in the app, if left empty, all fields in the app are searched through */
  dimensions: PropTypes.array,
  /* Size of the search bar */
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  /* Width of the search bar */
  width: PropTypes.string,
  /* Margin around the search bar */
  margin: PropTypes.string,
  /* Drop height of the search bar */
  dropHeight: PropTypes.string,
};

SearchBar.defaultProps = {
  config: null,
  dimensions: [],
  size: 'medium',
  width: '100%',
  margin: '5px',
  dropHeight: '400px',
};

export default SearchBar;
