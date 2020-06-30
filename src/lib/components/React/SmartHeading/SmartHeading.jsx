import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConfigContext } from '../../../contexts/ConfigProvider';
import { EngineContext } from '../../../contexts/EngineProvider';
import useEngine from '../../../hooks/useEngine';
import { StyledHeading } from './HeadingTheme';
import Spinner from '../Spinner';

const SmartHeading = ({ children, config, size, type, level, margin }) => {
  const myConfig = config || useContext(ConfigContext);
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [lastReload, setLastReload] = useState(null);

  useEffect(() => {
    if (engine === undefined) {
    } else {
      (async () => {
        const qEngine = await engine;
        const qLayout = await qEngine.getAppLayout();
        setTitle(qLayout.qTitle);
        setLastReload(qLayout.qLastReloadTime);
        setLoading(false);
      })();
    }
  }, [engine]);

  let text;
  if (type === 'free') {
    text = children || '';
  } else if (type === 'appName') {
    text = children ? children + title : `${title}`;
  } else if (type === 'lastReload') {
    const ts = new Date(lastReload).toLocaleString();
    text = children ? children + ts : `${ts}`;
  }

  return (
    <div>
      {!loading ? (
        <StyledHeading as={`h${level}`} size={size} margin={margin}>
          {text}
        </StyledHeading>
      ) : (
        engineError || <Spinner />
      )}
    </div>
  );
};

SmartHeading.propTypes = {
  /* Configure connection to the Qlik engine */
  config: PropTypes.object,
  /* Type of text, either free (free text), app last reload timestate, or the app name. */
  type: PropTypes.oneOf(['free', 'lastReload', 'appName']),
  /* Override size of the search bar by passing a pixel value */
  size: PropTypes.string,
  /* Heading */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /* Margin */
  margin: PropTypes.string,
};

SmartHeading.defaultProps = {
  config: null,
  type: 'lastReload',
  size: null,
  level: 1,
  margin: '5px',
};

export default SmartHeading;
