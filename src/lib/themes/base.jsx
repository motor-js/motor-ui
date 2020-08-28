import "./colors/open-color.css";

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
    fontFamily: "Inter, sans-serif" /* 'Roboto, sans-serif' */,
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
      allowSelections: true,
      allowSlantedYAxis: false,
      backgroundColor: "white",
      borderRadius: "10px",
      margin: "10px",
      userSelect: "none",
      suppressZero: false,
      suppressScroll: false,
      allowZoom: false,
      showLabels: "none",
      showLegend: true,
      textOnAxis: "both",
      showAxis: "none",
      showGridlines: "solid",
      tickSpacing: "wide",
      maxAxisLength: 80,
      display: "inline-block",
      boxSizing: "border-box",
      border: {
        color: "var(--oc-gray-4)",
        size: "1px",
        style: "solid",
        radius: "8px",
      },
      gridlines: {
        stroke: "var(--oc-gray-4)",
        strokeDasharray: null,
      },
      size: {
        tiny: {
          padding: "5px 10px",
          mobile: {
            label: "8px",
          },
          tablet: {
            label: "8px",
          },
          desktop: {
            label: "10px",
          },
          largeDesktop: {
            label: "10px",
          },
        },
        small: {
          padding: "5px 10px",
          mobile: {
            label: "10px",
          },
          tablet: {
            label: "10px",
          },
          desktop: {
            label: "12px",
          },
          largeDesktop: {
            label: "12px",
          },
        },
        medium: {
          padding: "5px 10px",
          mobile: {
            label: "12px",
          },
          tablet: {
            label: "12px",
          },
          desktop: {
            label: "14px",
          },
          largeDesktop: {
            label: "14px",
          },
        },
        large: {
          padding: "5px 10px",
          mobile: {
            label: "14px",
          },
          tablet: {
            label: "14px",
          },
          desktop: {
            label: "16px",
          },
          largeDesktop: {
            label: "16px",
          },
        },
        xlarge: {
          padding: "5px 10px",
          mobile: {
            label: "16px",
          },
          tablet: {
            label: "16px",
          },
          desktop: {
            label: "18px",
          },
          largeDesktop: {
            label: "18px",
          },
        },
      },
      selection: {
        opacity: 1,
        stroke: "black",
        strokeWidth: "1px",
      },
      nonSelection: {
        opacity: 0.5,
        background: "var(--oc-gray-1)",
      },
      label: {
        fontColor: "fontAlt",
      },
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
      error: {
        // dataErrorMsg: 'Invalid Dimension or Measure.',
        dimensionErrMsg: "Invalid Dimension.",
        measureErrMsg: "Invalid Measure. No values returned.",
      },
    },
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
  xyChart: {
    suppressZero: false,
    otherTotalSpec: undefined,
    showLegend: true,
    margin: "10px",
    padding: 0.2,
    useAnimatedAxes: false,
    includeZero: true,
    multiColor: true,
    autoWidth: false,
    renderHorizontally: false,
  },

  column: {
    main: {
      zoomScrollOnColumnWidth: 30,
      columnPadding: 20,
      otherTotalSpec: undefined,
      // if the columns are narrower than zoomScrollOnColumnWidth
      // try apply this padding to inclrease thier size
      columnPaddingNarrow: 10,
      maxWidth: 150,
    },
    columns: {
      stroke: "var(--oc-gray-4)",
      strokeWidth: 0.5,
    },
    overview: {
      opacity: 0.5,
      stroke: "var(--oc-gray-4)",
      strokeWidth: 0.5,
    },
  },
  bar: {
    main: {
      zoomScrollOnBarHeight: 25,
      barPadding: 20,
      otherTotalSpec: undefined,
      // if the columns are narrower than zoomScrollOnColumnWidth try apply this padding to inclrease thier size
      barPaddingNarrow: 10,
      maxWidth: 100,
    },
    bars: {
      stroke: "var(--oc-gray-4)",
      strokeWidth: 0.5,
    },
    overview: {
      opacity: 0.5,
      stroke: "var(--oc-gray-4)",
      strokeWidth: 0.5,
    },
  },
  line: {
    main: {
      dataPointsToShow: 100,
      otherTotalSpec: undefined,
      symbol: "circle",
      strokeWidth: 1,
      fillOpacity: 0.7,
    },
  },
  scatter: {
    main: {
      otherTotalSpec: undefined,
    },
    scatters: {
      fill: "none",
      stroke: "var(--oc-pink-4)",
      strokeWidth: 2,
    },
    markers: {
      main: { radius: 5 },
      overview: { radius: 3 },
    },
    overview: {
      opacity: 1,
      fill: "none",
      stroke: "var(--oc-gray-5)",
      strokeWidth: 0.5,
    },
  },
  pie: {
    main: {
      otherTotalSpec: { qOtherLabel: "Other", qOtherCount: "9" },
    },
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
  tooltip: {
    position: "absolute",
    color: "altDark",
    display: "none",
    minWidth: "80px",
    height: "auto",
    background: "none repeat scroll 0 0 #ffffff",
    padding: "6px",
    textAlign: "center",
    opacity: 0.9,
    pointerEvents: "none",
    backgroundColor: "white",
    border: "1px solid var(--oc-gray-2)",
    borderRadius: "6px",
    boxShadow: "4px 4px 12px rgba(0, 0, 0, .5)",
  },
  xAxis: { color: "altDark" },
  yAxis: { color: "altDark" },
  axisTitle: { color: "altDark" },
  title: {
    textPostion: "middle",
    main: {
      fontColor: "altDark",
      fontWeight: null,
      padding: 2,
    },
    sub: {
      fontColor: "altGray6",
      opacity: 0.5,
      padding: 2,
    },
  },
  legend: {
    fill: "white",
    stroke: "white",
    opacity: 1,
    borderRadius: "10px",
    legendGroup: { opacity: "1", userSelect: "none" },
    legendText: { fill: "var(--oc-gray-7)" },
    arrowStyle: {
      fill: "var(--oc-pink-5)",
      stroke: "var(--oc-pink-5)",
      opacity: 0.5,
    },
    arrowDisabledStyle: {
      fill: "var(--oc-pink-1)",
      stroke: "var(--oc-pink-1)",
      opacity: 0.5,
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
};

export default base;
