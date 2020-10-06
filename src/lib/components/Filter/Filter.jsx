/* eslint-disable prefer-template */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import StyledFilter from './StyledFilter';
import defaultTheme from '../../../themes/defaultTheme';
import { EngineContext } from '../../../contexts/EngineProvider';

function Filter({ config, ...rest }) {
  const myTheme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } = useContext(EngineContext) 

  return (
    <StyledFilter
      engine={engine}
      theme={myTheme}
      engineError={engineError}
      {...rest}
    />
  );
}

Filter.propTypes = {
  /** Filter label  */
  label: PropTypes.string.isRequired,
  /** Dimension from Qlik Data Model to render in the Filter  */
  dimension: PropTypes.array.isRequired,
  /** Size of the filter */
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  /** Filter width */
  width: PropTypes.string,
  /** The height of the Filter drop down box */
  dropHeight: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Event handler fired when a selection is changed */
  onSelectionChange: PropTypes.func,
  /** Event handler fired when the list box is searched */
  onSearch: PropTypes.func,
  /** Option to enable only single selections in the Filter list */
  single: PropTypes.bool,
  /** Option that sorts our Filter by selection state */
  sortByState: PropTypes.bool,
  /** Add the Filter selections to the title */
  selectionsTitle: PropTypes.bool,
};

Filter.defaultProps = {
  config: null,
  width: '200px',
  size: 'medium',
  dropHeight: '250px',
  margin: '5px',
  onSelectionChange: () => {},
  onSearch: () => {},
  single: false,
  sortByState: true,
  selectionsTitle: true,
};

export default Filter;
