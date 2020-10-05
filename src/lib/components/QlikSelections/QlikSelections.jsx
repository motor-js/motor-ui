import React, { useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import { CapabilityContext } from "../../contexts/CapabilityProvider";

const QlikSelections = ({ height, width, border }) => {
  const node = useRef(null);
  const { app } = useContext(CapabilityContext);

  useEffect(() => {
    if (app) {
      try {
        (async () => {
          app.getObject(node.current, "CurrentSelections");
        })();
      } catch (_error) {
        console.warn(_error);
      }
    }
  }, [app]);

  return (
    <div style={{ height, border }}>
      {app ? (
        <div ref={node} width={width} />
      ) : (
        <Spinner width={width} size={30} />
      )}
    </div>
  );
};

export default QlikSelections;

QlikSelections.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  border: PropTypes.string,
};

QlikSelections.defaultProps = {
  height: "38px",
  width: "100%",
  border: null,
};
