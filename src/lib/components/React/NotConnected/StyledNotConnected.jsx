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
}) => {
  return (
    <NotConnectedOverlay>
      <NotConnectedBox color={backgroundColor}>
        <Box
          focusable={false}
          width="100%"
          border="bottom"
          justifyContent="center"
        >
          <NotConnectedHeader size={size}>{header}</NotConnectedHeader>
        </Box>
        <Box
          focusable={false}
          width="100%"
          justifyContent="center"
          align="center"
          direction="column"
          padding="0.8rem"
        >
          <NotConnectedText size={size}>{body}</NotConnectedText>
          <Button
            size={size}
            fontColor={buttonFontColor}
            color={buttonColor}
            onClick={() => location.reload()}
          >
            {buttonText}
          </Button>
        </Box>
      </NotConnectedBox>
    </NotConnectedOverlay>
  );
};

export default StyledNotConnected;
