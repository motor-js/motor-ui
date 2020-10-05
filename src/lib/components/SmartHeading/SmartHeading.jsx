import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EngineContext } from "../../contexts/EngineProvider";
import { StyledHeading } from "./HeadingTheme";
import Spinner from "../Spinner";

const SmartHeading = ({
  children,
  size,
  type,
  level,
  margin,
  fontWeight,
  color,
  locales,
  options,
  asDate,
  asTime,
  addSpace,
}) => {
  const { engine, engineError } = useContext(EngineContext);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [lastReload, setLastReload] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    if (type === "free") setLoading(false);
    if (engine === undefined || type === "free") {
    } else {
      (async () => {
        const qEngine = await engine;
        const qLayout = await qEngine.getAppLayout();

        setTitle(qLayout.qTitle);
        setLastReload(qLayout.qLastReloadTime);
        setDescription(qLayout.description);
        setLoading(false);
      })();
    }
  }, [engine]);

  let text;
  if (type === "free") {
    text = children || "";
  } else if (type === "appName") {
    text = children ? children + title : `${title}`;
  } else if (type === "description") {
    text = children ? children + description : `${description}`;
  } else if (type === "lastReload") {
    // const ts = new Date(lastReload).toLocaleString();
    let ts = new Date(lastReload).toLocaleString();
    if (locales && options) {
      ts = new Date(lastReload).toLocaleString(locales, options);
    } else if (locales) {
      ts = new Date(lastReload).toLocaleString(locales);
    } else if (asDate) {
      ts = new Date(lastReload).toLocaleDateString();
    } else if (asTime) {
      ts = new Date(lastReload).toLocaleTimeString();
    }
    text = children ? children + `${addSpace ? " " : null} ` + ts : `${ts}`;
  }

  return (
    <div>
      {!loading ? (
        <StyledHeading
          as={`h${level}`}
          size={size}
          margin={margin}
          color={color}
          fontWeight={fontWeight}
        >
          {text}
        </StyledHeading>
      ) : (
        engineError || <Spinner />
      )}
    </div>
  );
};

SmartHeading.propTypes = {
  /* Type of text, either free (free text), app last reload timestate, or the app name. */
  type: PropTypes.oneOf(["free", "lastReload", "appName"]),
  /* Override size of the search bar by passing a pixel value */
  size: PropTypes.string,
  /* Heading */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /* Margin */
  margin: PropTypes.string,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
  locales: PropTypes.string,
  options: PropTypes.object,
  asDate: PropTypes.bool,
  asTime: PropTypes.bool,
  addSpace: PropTypes.bool,
};

SmartHeading.defaultProps = {
  type: "lastReload",
  size: null,
  level: 1,
  margin: "5px",
  color: null,
  fontWeight: null,
  locales: null,
  options: null,
  asDate: null,
  asTime: null,
  addSpace: true,
};

export default SmartHeading;
