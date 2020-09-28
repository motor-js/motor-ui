import React, { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { CapabilityContext } from "../../../contexts/CapabilityProvider";
import Spinner from "../Spinner";
import {
  QlikWrapper,
  QlikHeader,
  QlikHeaderText,
  StyledDots,
  StyledCircle,
} from "./QlikObjectTheme";
import Menu from "../Menu";

const QlikObject = ({
  id,
  type,
  cols,
  options,
  noSelections,
  noInteraction,
  width,
  height,
  margin,
  border,
  borderRadius,
  minWidth,
  minHeight,
  header,
  title,
  exportData,
  exportDataTitle,
  exportDataOptions,
  exportImg,
  exportImgTitle,
  exportImgOptions,
  exportPdf,
  exportPdfTitle,
  exportPdfOptions,
}) => {
  const node = useRef(null);
  const wrapper = useRef(null);
  const outerRef = useRef(null);

  const initHeight = parseInt(height, 10);
  //const urlFix = url => url.split(/(?=http.?:\/\/)(.*)(?=http.?:\/\/)/)[2]

  const { app } = useContext(CapabilityContext);

  const [qViz, setQViz] = useState(null);
  const [open, setOpen] = useState(false);
  const [elemHeight, setElemHeight] = useState(height);

  const create = async () => {
    const getViz = id
      ? app.visualization.get(id)
      : app.visualization.create(type, cols, options);
    const _qViz = await getViz;
    _qViz.setOptions(options);
    await setQViz(_qViz);
  };

  const show = () => {
    qViz.show(node.current, { noSelections, noInteraction });
  };

  const close = () => {
    qViz.close();
  };

  const resize = () => {
    qViz.resize();
  };

  useEffect(() => {
    if (app) {
      try {
        (async () => {
          if (!qViz) await create();
          if (qViz) show();
          window.addEventListener("resize", resize);
          //   const elemHeight = wrapper.current.offsetHeight
          //   setElemHeight(elemHeight)
        })();
      } catch (_error) {
        console.warn(_error);
      }

      return () => {
        if (qViz) close();
        // window.removeEventListener('resize', resize);
      };
    }
  }, [qViz, app]);

  const action = async (type) => {
    switch (type) {
      default:
      // case 'clearSelections':
      //  if (app) qApp.clearAll();
      //  if (qDoc) qDoc.clearAll();
      //  break;
      case "exportData":
        if (qViz) {
          const _options = options || { format: "CSV_T", state: "P" };
          const url = await qViz.exportData(_options);
          const _url = url; //.split(/(?=http.?:\/\/)(.*)(?=http.?:\/\/)/)[2]
          window.open(_url, "_blank");
        }
        break;
      case "exportImg":
        if (qViz) {
          const _options = /*options ||*/ {
            width: 300,
            height: 400,
            format: "JPG",
          };
          const url = await qViz.exportImg(_options);
          const _url = url;
          window.open(_url, "_blank");
        }
        break;
      case "exportPdf":
        if (qViz) {
          const _options = options || {
            documentSize: "a4",
            orientation: "landscape",
            aspectRatio: 2,
          };
          const url = await qViz.exportPdf(_options);
          const _url = await url;
          window.open(_url, "_blank");
        }
        break;
    }
  };

  const exportDataCallback = () => {
    action("exportData");
  };

  const exportImageCallback = () => {
    action("exportImg");
  };

  return (
    <QlikWrapper
      ref={outerRef}
      height={height}
      width={width}
      margin={margin}
      border={border}
      borderRadius={borderRadius}
      minWidth={minWidth}
      minHeight={minHeight}
      header={header}
    >
      {app ? (
        <div
          style={{
            height,
            width: "100%",
            minWidth,
          }}
        >
          {header && (
            <QlikHeader minWidth={minWidth}>
              <QlikHeaderText>{title}</QlikHeaderText>
              <StyledCircle>
                <StyledDots onClick={() => setOpen(!open)} />
                <Menu
                  open={open}
                  outerRef={outerRef}
                  exportDataCallback={exportDataCallback}
                  exportImageCallback={exportImageCallback}
                />
              </StyledCircle>
            </QlikHeader>
          )}
          <div
            ref={node}
            style={{
              height,
              width: "100%",
              minWidth,
              minHeight,
            }}
          />
        </div>
      ) : (
        <Spinner width={width} size={30} />
      )}
    </QlikWrapper>
  );
};

export default QlikObject;

QlikObject.propTypes = {
  id: PropTypes.string.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  margin: PropTypes.string,
  border: PropTypes.string,
  borderRadius: PropTypes.string,
  minWidth: PropTypes.string,
  minHeight: PropTypes.string,
  noSelections: PropTypes.bool,
  noInteraction: PropTypes.bool,
  type: PropTypes.oneOf([
    null,
    "barchart",
    "boxplot",
    "combochart",
    "distributionplot",
    "gauge",
    "histogram",
    "kpi",
    "linechart",
    "piechart",
    "pivot-table",
    "scatterplot",
    "table",
    "treemap",
    "extension",
  ]),
  cols: PropTypes.array,
  options: PropTypes.object,
  header: PropTypes.bool,
};

QlikObject.defaultProps = {
  height: "100%",
  width: "100%",
  margin: "25px",
  border: null,
  borderRadius: "8px",
  minWidth: "auto",
  minHeight: "auto",
  noSelections: false,
  noInteraction: false,
  type: null,
  cols: [],
  options: {},
  header: false,
  title: "Jira Task Hours",
};
