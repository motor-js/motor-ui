import React, { useContext } from "react"
import Button from '../Button'
import Box from '../Box'

import {
  LoginOverlay,
  LoginBox,
  LoginHeader,
  LoginText,
} from './LoginTheme'

const StyledLogin = ({
  config,
  header,
  body,
  size,
  buttonText,
  backgroundColor,
  buttonFontColor,
  buttonColor
}) => {
  console.log('config: ',config)

  const tenantUri = config.host
  const webIntegrationId = config.webIntId

  const goToLogin = () => {
    const loginUrl = new URL(`https://${tenantUri}/login`)
    loginUrl.searchParams.append("returnto", window.location.href)
    loginUrl.searchParams.append(
      "qlik-web-integration-id",
      webIntegrationId
    )
    window.location.href = loginUrl
  }

  return (
    <LoginOverlay>
      <LoginBox color={backgroundColor}>
        <Box
          focusable={false}
          width="100%"
          border="bottom"
          justifyContent="center"
        >
          <LoginHeader size={size}>{header}</LoginHeader>
        </Box>
        <Box
          focusable={false}
          width="100%"
          justifyContent="center"
          align="center"
          direction="column"
          padding="0.8rem"
        >
          <LoginText size={size}>{body}</LoginText>
          <Button size={size} fontColor={buttonFontColor} color={buttonColor} onClick={goToLogin}>{buttonText}</Button>
        </Box>
      </LoginBox>
    </LoginOverlay>
  )
}

export default StyledLogin

