import "./colors/open-color.css";

const colorPalette = [
  "var(--oc-pink-4)",
  "var(--oc-pink-9)",
  "var(--oc-pink-0)",
  "var(--oc-pink-2)",
  "var(--oc-pink-3)",
  "var(--oc-pink-5)",
  "var(--oc-pink-6)",
  "var(--oc-pink-7)",
  "var(--oc-pink-8)",
];

const goya = [
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
/*
const divergent9 = [
  '#2ec4b6',
  '#66d4aa',
  '#98e29d',
  '#cbee94',
  '#fff693',
  '#ffce6a',
  '#ffa255',
  '#ff7056',
  '#ff3366',
]
*/

const petrol = [
  "#dcdbd6",
  "#fada5e",
  "#cb9d06",
  "#826644",
  "#8a3324",
  "#e97451",
  "#c80815",
  "#cc7722",
  "#ffcccb",
  "#e34234",
  "#98182F",
  "#758b72",
  "#0047ab",
  "#282422",
];

const diesel = [
  "#D81C23",
  "#4FA8C2",
  "#D97441",
  "#D29849",
  "var(--oc-pink-3)",
  "var(--oc-pink-5)",
  "var(--oc-pink-6)",
  "var(--oc-pink-7)",
  "var(--oc-pink-8)",
];

const gas = [
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
  "#1A76D2",
  "#DC004E",
  "#F44335",
  "#FF9801",
  "#2296F3",
  "#4CAF50",
  "#212121",
  "#757575",
  "#9E9E9E",
];

const bikes = [
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

const passenger = [
  "#4E79A8",
  "#A0CBE8",
  "#F28E2B",
  "#FFBE7D",
  "#59A14F",
  "#8CD17D",
  "#B6992D",
  "#F1CE63",
  "#499894",
  "#86BCB6",
  "#E15759",
  "#FF9D9A",
  "#79706E",
  "#BAB0AD",
  "#D47295",
  "#FABFD2",
  "#B07AA2",
  "#D4A6C9",
  "#946B51",
  "#D7B5A6",
];

const racing = [
  "#99ca3b",
  "#999999",
  "#454545",
  "#B3B3B3",
  "#CCCCCC",
  "#8AD4EB",
  "#FE9666",
  "#A66999",
  "#3599B8",
  "#DFBFBF",
  "#4AC5BB",
  "#454545",
  "#FB8280",
];

const cylinder1 = [
  "#00876c",
  "#439981",
  "#6aaa96",
  "#8cbcac",
  "#aecdc2",
  "#cfdfd9",
  "#f1f1f1",
  "#f1d4d4",
  "#f0b8b8",
  "#ec9c9d",
  "#e67f83",
  "#de6069",
  "#d43d51",
];

const color = {
  brand: "#000aee",
  brandLight: "#eeefff",
  accent1: "var(--oc-pink-6)",
  accent2: "#000aee",
  neutral1: "",
  neutral2: "",
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
  gauge: "var(--oc-pink-4)",
  success: "green",
  danger: "red",
  warning: "yellow",
  colorPalette,
  goya,
  divergent9,
  divergent13,

  petrol,
  diesel,
  gas,
  bio,
  bikes,
  passenger,
  racing,
  cylinder1,
};

/*
const fontSizing = factor => ({
  size: `${baseFontSize + factor * fontScale}px`,
});
*/

const base = {
  global: {
    backgroundColor: "white",
    colorTheme: "goya",
    fontFamily: "Inter, sans-serif" /* 'Roboto, sans-serif' */,
    color,
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
        xlarge: "22px",
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
        // display: 'flex',
        verticalAlign: "top",
        display: "inline-block",
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: "10px",
        backgroundColor: "var(--oc-gray-1)",
        borderCollapse: "collapse",
      },
      noDataContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
        // borderRadius: '10px',
        // backgroundColor: 'var(--oc-gray-1)',
        // borderCollapse: 'collapse',
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
  },
  selectionModal: {
    buttonType: "icon",
    hoverBckgColor: {
      // confirm: '#00ae70',
      // confirm: "var(--oc-pink-3)",
      confirm: "#0aaf54",
      // cancel: '#ffdada',
      // cancel: "var(--oc-pink-2)",
      cancel: "#f05551",
    },
    bckgColor: {
      // confirm: '#00C781',
      // confirm: "var(--oc-pink-4)",
      confirm: "#009845",
      // cancel: 'white',
      cancel: "#dc423f",
    },
    border: {
      // confirm: '1px solid #00C781',
      // confirm: "1px solid var(--oc-pink-4)",
      confirm: "none",
      // cancel: '1px solid #FF4040',
      // cancel: "1px solid var(--oc-pink-6)",
      cancel: "none",
    },
    color: {
      confirm: "white",
      // cancel: '#FF4040',
      // cancel: "var(--oc-pink-6)",
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
    },
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
    color: "altGray4",
    size: 30,
    timeout: 5000,
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
      dataPointsToShow: 30,
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
  xAxis: { color: "fontAlt" },
  yAxis: { color: "fontAlt" },
  axisTitle: { color: "fontAlt" },
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
