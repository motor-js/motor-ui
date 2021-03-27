import React from "react";
import Button from "../Button";
import Box from "../Box";

import { LoginOverlay, LoginBox, LoginHeader, LoginText } from "./LoginTheme";

const StyledLogin = ({
  config,
  header,
  body,
  size,
  buttonText,
  backgroundColor,
  buttonFontColor,
  buttonColor,
  theme,
  logo,
  logoHeight,
  logoWidth,
}) => {
  const {
    global: { login },
  } = theme;

  const tenantUri = config.host;
  const webIntegrationId = config.webIntId;

  const goToLogin = () => {
    console.log(tenantUri);
    console.log("returnto", window.location.href);
    console.log("qlik-web-integration-id", webIntegrationId);

    const loginUrl = new URL(`https://${tenantUri}/login`);
    loginUrl.searchParams.append("returnto", window.location.href);
    loginUrl.searchParams.append("qlik-web-integration-id", webIntegrationId);
    window.location.href = loginUrl;
  };

  return (
    <LoginOverlay>
      <LoginBox color={backgroundColor || login.backgroundColor}>
        <Box
          focusable={false}
          width="100%"
          border="bottom"
          justifyContent="center"
        >
          <LoginHeader size={size || login.size}>
            { logo ?
              <img src={logo} height={logoHeight} width={logoWidth} alt="Logo"></img>
              : header || login.header
            }
          </LoginHeader>
        </Box>
        <Box
          focusable={false}
          width="100%"
          justifyContent="center"
          align="center"
          direction="column"
          padding="0.8rem"
        >
          <LoginText size={size || login.size}>{body || login.body}</LoginText>
          <Button
            size={size || login.size}
            fontColor={buttonFontColor || login.buttonFontColor}
            color={buttonColor || login.buttonColor}
            onClick={goToLogin}
          >
            {buttonText || login.buttonText}
          </Button>
        </Box>
      </LoginBox>
    </LoginOverlay>
  );
};

export default StyledLogin;
