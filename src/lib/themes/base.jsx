import "./colors/open-color.css";

const dark = [
  "#3bc9db",
  "#c3fae8",
  "#ffec99",
  "#ff8787",
  "#e599f7",
  "#be4bdb",
  "#faa2c1",
];
const light = [
  "#0b7285",
  "#66d9e8",
  "#fcc419",
  "#ff8787",
  "#9c36b5",
  "#cc5de8",
  "#a61e4d",
];

const motor = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

const divergent13 = [
  "#43aa8b",
  "#61b98d",
  "#7ec98f",
  "#9dd790",
  "#bce593",
  "#ddf297",
  "#ffff9d",
  "#ffe57d",
  "#ffc961",
  "#ffac4d",
  "#ff8d42",
  "#ff6b3f",
  "#f94144",
];

const divergent9 = [
  "#43aa8b",
  "#6fc18e",
  "#9dd790",
  "#ccec95",
  "#ffff9d",
  "#ffd76e",
  "#ffac4d",
  "#ff7c3f",
  "#f94144",
];

const eco = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC",
];

const bio = [
  "#03B8AA",
  "#374649",
  "#FD625E",
  "#F2C80F",
  "#5F6B6D",
  "#8ad4eb",
  "#fe9666",
  "#a66999",
  "#3599b8",
  "#dfbfbf",
  "#4ac5bb",
  "#5f6b6d",
  "#fb8281",
  "#f4d25a",
  "#7f898a",
  "#a4ddee",
  "#fdab89",
  "#b687ac",
  "#28738a",
  "#a78f8f",
  "#168980",
  "#293537",
  "#bb4a4a",
  "#b59525",
  "#475052",
];

const color = {
  brand: "#FF7272",
  brandLight: "#ffe3e1", //"#FFCCC7",
  accent1: "#007DC3",
  accent2: "#A08CFF",
  accent3: "f3EED9",
  altDark: "#272727",
  altGray1: "var(--oc-gray-1)",
  altGray2: "var(--oc-gray-2)",
  altGray3: "var(--oc-gray-3)",
  altGray4: "var(--oc-gray-4)",
  altGray5: "var(--oc-gray-5)",
  altGray6: "var(--oc-gray-6)",
  altGray7: "var(--oc-gray-7)",
  altGray8: "var(--oc-gray-8)",
  altGray9: "var(--oc-gray-9)",
  font: "var(--oc-gray-9)",
  fontAlt: "var(--oc-gray-7)",
  fontLight: "var(--oc-gray-2)",
  motor,
  divergent9,
  divergent13,
  eco,
  bio,
  dark,
  light,
  /** Below not documented, are they used? */
  gauge: "var(--oc-pink-4)",
  success: "green",
  danger: "red",
  warning: "yellow",
};

/*
turbo
wind
eco
jet
dodge
electric
*/

const darkTheme = {
  color: dark,
  backgroundColor: "#222",
  tickLabelStyles: "#e9ecef",
  labelStyles: "#f8f9fa",
  gridColor: "#ced4da",
};

const motorTheme = {
  color: motor,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const divergent9Theme = {
  color: divergent9,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const divergent13Theme = {
  color: divergent13,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const ecoTheme = {
  color: eco,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const bioTheme = {
  color: bio,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const lightTheme = {
  color: light,
  backgroundColor: "#fff",
  tickLabelStyles: "#495057",
  labelStyles: "#212529",
  gridColor: "#adb5bd",
};

const fontFamily = "Inter, sans-serif"; /* 'Roboto, sans-serif' */

const base = {
  global: {
    login: {
      header: "Welcome to your motor js mashup",
      body: "Please log on to access your application",
      size: "medium",
      buttonText: "Login",
      backgroundColor: "white",
      buttonFontColor: "white",
      buttonColor: "brand",
    },
    notConnected: {
      header: "Connection to server lost",
      body: "Please reload the page to refresh the dashboard",
      size: "medium",
      buttonText: "Reload Page",
      backgroundColor: "white",
      buttonFontColor: "white",
      buttonColor: "brand",
    },
    backgroundColor: "white",
    // fontFamily: "Inter, sans-serif" /* 'Roboto, sans-serif' */,
    fontFamily,
    colorTheme: "motor",
    color,
    overlay: {
      background: `rgb(0,0,0)`,
      opacity: 0.3,
    },
    border: {
      color: "var(--oc-gray-4)",
      size: "1px",
      style: "solid",
      radius: "8px",
    },
    size: {
      font: {
        tiny: "10px",
        small: "12px",
        medium: "14px",
        large: "16px",
        xlarge: "18px",
      },
      subFont: {
        tiny: "8px",
        small: "10px",
        medium: "12px",
        large: "14px",
        xlarge: "16px",
      },
      title: {
        tiny: "14px",
        small: "16px",
        medium: "18px",
        large: "20px",
        xlarge: "22px",
      },
      subTitle: {
        tiny: "12px",
        small: "14px",
        medium: "16px",
        large: "18px",
        xlarge: "20px",
      },
      tooltip: {
        tiny: "10px",
        small: "12px",
        medium: "14px",
        large: "16px",
        xlarge: "18px",
      },
      wrapper: {
        tiny: "64px",
        small: "128px",
        medium: "192px",
        large: "256px",
        xlarge: "320px",
        full: "100%",
      },
    },
    deviceBreakpoints: {
      mobile: "small",
      tablet: "medium",
      desktop: "medium",
      largeDesktop: "large",
    },
    responsiveBreakpoints: {
      mobile: "400px",
      tablet: "640px",
      desktop: "1024px",
    },
    focus: {
      outline: {
        color: "#212121",
        size: "5px",
      },
    },
    chart: {
      darkTheme,
      motorTheme,
      divergent9Theme,
      divergent13Theme,
      ecoTheme,
      bioTheme,
      lightTheme,
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      border: {
        color: "var(--oc-gray-4)",
        size: "1px",
        style: "solid",
      },
      wrapper: {
        borderRadius: "10px",
        backgroundColor: "white",
        userSelect: "none", // add to props
        display: "flex", // add to props
        boxSizing: "border-box",
        position: "relative",
        padding: "16px 16px 0px",
        fontWeight: "normal",
        minHeight: "200px",
        textDecoration: "none",
        showBoxShadow: true,
        boxShadow: "rgba(0, 0, 0, 0.1) -2px 2px 8px 0px",
        flexDirection: "column",
      },
      error: {
        // dataErrorMsg: 'Invalid Dimension or Measure.',
        dimensionErrMsg: "Invalid Dimension.",
        measureErrMsg: "Invalid Measure. No values returned.",
      },
      titles: {
        wrapper: {
          display: "flex",
          flexDirection: "column",
          webkitBoxPack: "justify",
          justifyContent: "space-between",
          maxHeight: "50px",
          backgroundColor: "rgb(247, 247, 247)",
          margin: "-16px -16px 0px",
          padding: "15px 20px",
          marginBottom: "15px",
        },
        title: {
          color: "var(--oc-gray-8)",
          fontSize: {
            tiny: "14px",
            small: "16px",
            medium: "18px",
            large: "20px",
            xlarge: "22px",
          },
        },
        subTitle: {
          color: "var(--oc-gray-6)",
          fontSize: {
            tiny: "10px",
            small: "12px",
            medium: "14px",
            large: "16px",
            xlarge: "18px",
          },
        },
      },
      suppressZero: true,
      suppressMissing: false,
      otherTotalSpec: undefined,
      showLegend: true,
      showAxisLabels: "both",
      margin: "10px",
      padding: 0.3, // Padding between bars
      useAnimatedAxes: true,
      useAnimatedGrid: true,
      numGridRows: 4,
      numGridColumns: 4,
      animationTrajectory: "center",
      includeZero: true,
      multiColor: true,
      selectionMethod: "brush",
      // autoWidth: false, // REMOVED
      renderHorizontally: false,
      allowSelections: true, //captureEvents if captureevents true the cannot make selections
      color,
      showLabels: true,
      showPoints: true,
      roundNum: true,
      precision: true,
      hideAxisLine: "yAxis",
      noData: {
        verticalAlign: "top",
        borderRadius: "10px",
        // backgroundColor: "var(--oc-gray-1)",
        backgroundColor: "white",
        // borderCollapse: "collapse",
      },
      noDataContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
      },
      baseColor: "#fff",
      // backgroundColor: {
      //   dark: "#222",
      //   motor: "#fff",
      //   divergent9: "#fff",
      //   divergent13: "#fff",
      //   eco: "#fff",
      //   bio: "#fff",
      //   light: "#fff",
      // },
      // tickLabelStyles: {
      //   dark: "#e9ecef",
      //   motor: "#495057",
      //   divergent9: "#495057",
      //   divergent13: "#495057",
      //   eco: "#495057",
      //   bio: "#495057",
      //   light: "#495057",
      // },
      // labelStyles: {
      //   dark: "#f8f9fa",
      //   motor: "#212529",
      //   divergent9: "#212529",
      //   divergent13: "#212529",
      //   eco: "#212529",
      //   bio: "#212529",
      //   light: "#212529",
      // },
      colors: [
        "#0b7285",
        "#15aabf",
        "#fcc419",
        "#ff8787",
        "#6741d9",
        "#e599f7",
      ],
      brush: {
        stroke: null,
        patternStroke: null,
        patternWidth: null,
        patternHeight: null,
        strokeWidth: null,
        orientation: null, // Array e.g. ["diagonal"]
      },
      legendStyles: {
        backgroundColor: "#fff",
        direction: "row",
        margin: { left: "5px", right: "5px", bottom: "5px" },
        upperCase: true,
        alignLeft: false,
        legendGlyphSize: 15,
        // stroke: "white",
        // opacity: 1,
        // borderRadius: "10px",
        // legendGroup: { opacity: "1", userSelect: "none" },
        // legendText: { fill: "var(--oc-gray-7)" },
      },
      legendLabelStyles: {
        margin: "0 0 0 4px",
        fill: "#212529",
        stroke: "none",
        fontFamily,
        fontSize: {
          tiny: "10px",
          small: "12px",
          medium: "14px",
          large: "16px",
          xlarge: "18px",
        },
        // letterSpacing: 0.4,
        // textAnchor: "middle",
        // fontWeight: "normal",
        // pointerEvents: "none",
      },
      backgroundStyles: {
        // AG
        pattern: null,
        stroke: "#ced4da",
        strokeWidth: 1,
        style: undefined,
        styleFrom: undefined,
        styleTo: undefined,
      },
      fillStyles: {
        //AG
        style: undefined,
        styleFrom: undefined,
        styleTo: undefined,
      },
      gridStyles: {
        rows: {
          stroke: "#ced4da",
          strokeWidth: 1,
          strokeDasharray: "5,3",
          numTicks: 10,
          lineStyle: null,
          yOffset: null,
          tickValues: null,
        },
        columns: {
          stroke: "#ced4da",
          strokeWidth: 1,
          strokeDasharray: "5,3",
          numTicks: 10,
          lineStyle: null,
          xOffset: null,
          tickValues: null,
        },
      },
      noSelections: {
        opacity: 1,
        cursor: "pointer",
        // fill: "orange",
        // stroke: "black",
        // strokeWidth: "1px",
      },
      selection: {
        opacity: 1,
        cursor: "pointer",
        fill: "orange",
        // stroke: "black",
        // strokeWidth: "1px",
      },
      nonSelection: {
        opacity: 0.5,
        cursor: "pointer",
        // background: "var(--oc-gray-1)",
      },
      hover: {
        opacity: 0.5,
        cursor: "pointer",
        // fill: "orange",
        // background: "var(--oc-gray-1)",
      },

      tooltip: {
        // snapTooltipToDatumX: false,
        // snapTooltipToDatumX: false,
        // valueOnly: false,
        // valueWithText: false,
        // showClosestItem: true, // Used for tooltip
        // useSingleColor: false, // Used for tooltip. True uses colors as per headingColor
        // headingColor: "altDark",
        // tooltipStyles: {
        //   borderRadius: "3px",
        //   boxShadow: "0 1px 2px rgba(33,33,33,0.2)",
        //   fontSize: {
        //     tiny: "10px",
        //     small: "12px",
        //     medium: "14px",
        //     large: "16px",
        //     xlarge: "18px",
        //   },

        //   lineHeight: "1em",
        //   padding: ".3rem .5rem",
        //   pointerEvents: "none",
        //   position: "absolute",
        //   backgroundColor: "#fff",
        //   color: "altDark",
        //   textAlign: null,
        // },
        tooltiplLabelStyles: {
          fontFamily:
            "-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif",
          fontWeight: 700,
          fontSize: {
            tiny: "8px",
            small: "10px",
            medium: "12px",
            large: "14px",
            xlarge: "16px",
          },
          textAnchor: "middle",
          pointerEvents: "none",
          letterSpacing: 0.4,
        },
      },
      xAxisStyles: {
        top: {
          axisLabel: {
            fontFamily,
            fontWeight: 700,
            fontSize: {
              tiny: 8,
              small: 10,
              medium: 12,
              large: 14,
              xlarge: 16,
            },
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            stroke: "none",
            dy: "-0.25em", // needs to include font-size
          },
          axisLine: {
            strokeWidth: 1,
          },
          tickLabel: {
            fontFamily,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: {
              tiny: 7,
              small: 9,
              medium: 11,
              large: 13,
              xlarge: 15,
            },
            stroke: "none",
            dy: "-0.25em", // needs to include font-size
          },
          tickLength: 4,
          tickLine: {
            strokeWidth: 1,
          },
        },
        bottom: {
          axisLabel: {
            fontFamily,
            fontWeight: 700,
            fontSize: {
              tiny: 8,
              small: 10,
              medium: 12,
              large: 14,
              xlarge: 16,
            },
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            stroke: "none",
            dy: "-0.25em",
          },
          axisLine: {
            strokeWidth: 1,
          },
          tickLabel: {
            fontFamily,
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: {
              tiny: 7,
              small: 9,
              medium: 11,
              large: 13,
              xlarge: 15,
            },
            stroke: "none",
            dy: "0.125em",
          },
          tickLength: 4,
          tickLine: {
            strokeWidth: 1,
          },
        },
      },
      yAxisStyles: {
        left: {
          axisLabel: {
            fontFamily,
            fontWeight: 700,
            fontSize: {
              tiny: 8,
              small: 10,
              medium: 12,
              large: 14,
              xlarge: 16,
            },
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            stroke: "none",
            dx: "-1.25em",
          },
          axisLine: {
            strokeWidth: 1,
          },
          tickLabel: {
            fontFamily,
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: {
              tiny: 7,
              small: 9,
              medium: 11,
              large: 13,
              xlarge: 15,
            },
            stroke: "none",
            textAnchor: "end",
            dx: "-0.25em",
            dy: "0.25em",
          },
          tickLength: 4,
          tickLine: {
            strokeWidth: 1,
          },
        },
        right: {
          axisLabel: {
            fontFamily,
            fontWeight: 700,
            fontSize: {
              tiny: 8,
              small: 10,
              medium: 12,
              large: 14,
              xlarge: 16,
            },
            textAnchor: "middle",
            pointerEvents: "none",
            letterSpacing: 0.4,
            stroke: "none",
            dx: "1.25em",
          },
          axisLine: {
            strokeWidth: 1,
          },
          tickLabel: {
            fontFamily,
            pointerEvents: "none",
            letterSpacing: 0.4,
            fontWeight: 200,
            fontSize: {
              tiny: 7,
              small: 9,
              medium: 11,
              large: 13,
              xlarge: 15,
            },
            stroke: "none",
            textAnchor: "start",
            dx: "0.25em",
            dy: "0.25em",
          },
          tickLength: 4,
          tickLine: {
            strokeWidth: 1,
          },
        },
      },

      valueLabelStyles: {
        fill: "#495057",
        stroke: "#fff",
        fontFamily,
        fontSize: {
          tiny: 8,
          small: 10,
          medium: 12,
          large: 14,
          xlarge: 16,
        },
        letterSpacing: 0.4,
        strokeWidth: 2,
        fontWeight: "normal",
        textAnchor: "middle",
        pointerEvents: "none",
        paintOrder: "stroke",
        dy: "-0.55em",
      },
    },
  },
  crossHair: {
    fullHeight: false,
    fullWidth: false,
    lineStyles: {
      pointerEvents: "none",
    },
    showCircle: true,
    showMultipleCircles: true,
    showHorizontalLine: true,
    showVerticalLine: true,
    stroke: "multi",
    strokeDasharray: "5,2",
    strokeWidth: 1,
    circleSize: 5,
    circleStyles: {
      pointerEvents: "none",
    },
    circleFill: "white",
    circleClosestFill: "multi",
    circleStroke: "multi",
    circleClosestStroke: "multi",
    circleStrokeWidth: 1,
    highlightClosetsCircle: true,
  },
  filter: {
    color: {
      selected: "brand",
      icon: "altGray6",
      backgroundColor: "white",
      selectedFont: "white",
      fontTitle: "altGray6",
      notSelected: "altGray4",
      altSelection: "altGray1",
    },
    title: {
      border: "1px solid",
      borderColor: "var(--oc-gray-4)",
      radius: "8px",
      justifyContent: "left",
    },
    main: {
      border: "1px solid",
    },
    selected: {
      border: "1px solid",
      borderColor: "brand",
    },
    dropdown: {
      border: "1px solid",
      borderColor: "altGray5",
      borderItems: "1px solid",
      radius: "8px",
      marginTop: "5px",
      shadow: "0 1px 2px rgba(0,0,0,0.15)",
      itemHeight: {
        tiny: 22,
        small: 24,
        medium: 28,
        large: 36,
        xlarge: 38,
      },
    },
    hover: {
      borderColor: "altGray5",
    },
  },
  button: {
    backgroundColor: "accent1",
    fontColor: "white",
    border: 0,
    margin: null,
    radius: "8px",
    shadow: null,
    padding: "0.7em 1.7em",
    transform: null,
    fontWeight: null,
    outline: "none",
    transition: "none",
    hover: {
      background: null,
      borderColor: null,
      boxShadow: "inset 0 0 0 10em rgba(255, 255, 255, 0.3)",
      backgroundColor: "transparent",
      border: 0,
    },
    active: {
      transform: null,
      backgroundColor: null,
      backgroundSize: null,
      transition: null,
    },
    disabled: {
      // fontColor:
      //   "-internal-light-dark(rgba(16, 16, 16, 0.3), rgb(170, 170, 170))",
      // backgroundColor:
      //   "-internal-light-dark-color(rgba(239, 239, 239, 0.3), rgba(19, 1, 1, 0.3))",
      // borderColor:
      //   "-internal-light-dark(rgba(118, 118, 118, 0.3), rgba(195, 195, 195, 0.3))",
      fontColor: "rgba(16, 16, 16, 0.3)",
      backgroundColor: "rgba(239, 239, 239, 0.3)",
      border: "solid 1px rgba(118, 118, 118, 0.3)",
      boxShadow: "none",
    },
  },
  selectionModal: {
    buttonType: "icon",
    hoverOpacity: {
      confirm: 0.7,
      cancel: 0.7,
    },
    bckgColor: {
      confirm: "#009845",
      cancel: "#dc423f",
    },
    border: {
      color: {
        confirm: "none",
        cancel: "none",
      },
      size: {
        confirm: "none",
        cancel: "none",
      },
      style: {
        confirm: "none",
        cancel: "none",
      },
      radius: {
        confirm: "8px",
        cancel: "8px",
      },
    },

    color: {
      confirm: "white",
      cancel: "white",
    },
  },
  selections: {
    color: {
      defaultFont: "brand",
      fontTitle: "brand",
      item: "brand",
      clear: "brand",
      border: "brand",
    },
    wrapper: {
      border: "1px solid",
      backgroundColor: "white",
      borderColor: "brand",
      radius: "8px",
      margin: "5px 10px",
    },
    item: {
      border: "1px solid",
      radius: "8px",
      backgroundColor: "brandLight",
      titleFontWeight: "bold",
    },
  },
  kpi: {
    wrapper: {
      backgroundColor: "white",
      radius: "8px",
      textAlign: "center",
      boxSizing: "border-box",
      margin: "10px",
    },
    group: { padding: "10px" },
    label: {
      fontColor: "font",
      alignSelf: "center",
    },
    value: {
      fontColor: "brand",
    },
    size: {
      tiny: {
        padding: "5px 10px",
        mobile: {
          label: "10px",
          value: "16px",
        },
        tablet: {
          label: "10px",
          value: "20px",
        },
        desktop: {
          label: "12px",
          value: "40px",
        },
        largeDesktop: {
          label: "12px",
          value: "40px",
        },
      },
      small: {
        padding: "5px 10px",
        mobile: {
          label: "10px",
          value: "20px",
        },
        tablet: {
          label: "10px",
          value: "30px",
        },
        desktop: {
          label: "12px",
          value: "60px",
        },
        largeDesktop: {
          label: "12px",
          value: "60px",
        },
      },
      medium: {
        padding: "5px 10px",
        mobile: {
          label: "14px",
          value: "50px",
        },
        tablet: {
          label: "14px",
          value: "60px",
        },
        desktop: {
          label: "16px",
          value: "80px",
        },
        largeDesktop: {
          label: "16px",
          value: "80px",
        },
      },
      large: {
        padding: "5px 10px",
        mobile: {
          label: "16px",
          value: "70px",
        },
        tablet: {
          label: "16px",
          value: "80px",
        },
        desktop: {
          label: "18px",
          value: "100px",
        },
        largeDesktop: {
          label: "18px",
          value: "100px",
        },
      },
      xlarge: {
        padding: "5px 10px",
        mobile: {
          label: "18px",
          value: "90px",
        },
        tablet: {
          label: "18px",
          value: "100px",
        },
        desktop: {
          label: "20px",
          value: "120px",
        },
        largeDesktop: {
          label: "20px",
          value: "120px",
        },
      },
    },
  },
  navItem: {
    color: { active: "brand", inactive: "white" },
    textAlign: "left",
    background: {
      color: { hover: "none" },
    },
    border: {
      color: "#FF7272",
      size: "3px",
      style: "solid",
      radius: "0px 8px 8px 0px",
      hover: "border-right 5px solid #FF7272",
    },
  },
  sidebar: {
    width: "300px",
    color: {
      background: "#373a47",
      closeIcon: "brand",
      openIcon: "black",
    },
    border: {
      // 1px dashed red; border-width: 1px 1px 0 1px;
      color: "#FF7272",
      radius: "0px",
      size: "1px",
      style: "solid",
    },
  },
  progress: {},
  table: {
    color: {
      selected: null,
      selectedFont: "white",
      headerBackground: "white",
      bodyBackground: "white",
      selectedBackground: "brand",
      oddRows: "white",
      evenRows: "altGray1",
      hover: "#f2f2f2",
    },
    wrapper: {
      borderColor: "altGray5",
      margin: "10px",
      backgroundColor: "white",
      radius: "8px",
    },
    header: {
      borderColor: "altGray5",
      padding: "0.4rem 0.7em",
    },
    totals: {
      borderColor: "altGray5",
      padding: "0.4rem 0.7rem",
    },
    cells: {
      borderColor: "altGray3",
      padding: "0.2rem 0.7rem",
    },
  },
  spinner: {
    type: "ThreeDots",
    color: "altGray5",
    size: 50,
    timeout: 5000,
  },
  bar: { stroke: "#fff", strokeWidth: 1 },
  stackedArea: { stroke: "#fff", strokeWidth: 1 },
  points: { size: 75, strokeWidth: 2, cursor: "pointer" },
  scatter: {
    size: 75,
    strokeWidth: null,
    stroke: null,
    cursor: "pointer",
  },
  pie: {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    stroke: "#adb5bd",
    strokeWidth: 0.5,
    cornerRadius: 3,
    padAngle: 0.005,
    isDonut: false,
    donutThickness: 50,
  },
  barplot: {
    main: {
      otherTotalSpec: { qOtherLabel: "Other", qOtherCount: "5" },
    },
  },
  wordcloud: {
    main: {
      otherTotalSpec: { qOtherLabel: "Other", qOtherCount: "5" },
    },
  },
  search: {
    color: {
      background: "white",
      font: "altDark",
      placeholder: "altGray6",
      icon: "altGray6",
    },
    title: {
      border: "1px solid",
      borderColor: "altGray4",
      radius: "8px",
    },
    suggestions: {
      borderBottom: "1px solid var(--oc-gray-4)",
      hoverColor: "altGray4",
      titleColor: "altDark",
      valueColor: "altDark",
    },
  },
  smartHeading: {
    color: "var(--oc-gray-6)",
  },
  modal: {
    radius: "8px",
  },
  QlikObject: {},
  QlikSelections: {},
};

export default base;
