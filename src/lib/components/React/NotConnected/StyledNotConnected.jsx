import React from "react";
import Button from "../Button";
import Box from "../Box";

import {
  NotConnectedOverlay,
  NotConnectedBox,
  NotConnectedHeader,
  NotConnectedText,
} from "./NotConnectedTheme";

const StyledNotConnected = ({
  header,
  body,
  size,
  buttonText,
  backgroundColor,
  buttonFontColor,
  buttonColor,
  theme,
}) => {
  const {
    global: { notConnected },
  } = theme;

  return (
    <NotConnectedOverlay>
      <NotConnectedBox color={backgroundColor || notConnected.backgroundColor}>
        <Box
          focusable={false}
          width="100%"
          border="bottom"
          justifyContent="center"
        >
          <NotConnectedHeader size={size || notConnected.size}>
            {header || notConnected.header}
          </NotConnectedHeader>
        </Box>
        <Box
          focusable={false}
          width="100%"
          justifyContent="center"
          align="center"
          direction="column"
          padding="0.8rem"
        >
          <NotConnectedText size={size || notConnected.size}>
            {body || notConnected.body}
          </NotConnectedText>
          <Button
            size={size || notConnected.size}
            fontColor={buttonFontColor || notConnected.buttonFontColor}
            color={buttonColor || notConnected.buttonColor}
            onClick={() => location.reload()}
          >
            {buttonText || notConnected.buttonText}
          </Button>
        </Box>
      </NotConnectedBox>
    </NotConnectedOverlay>
  );
};

export default StyledNotConnected;
