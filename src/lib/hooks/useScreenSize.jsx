/* eslint-disable react-hooks/rules-of-hooks */
// Media Queries
import useMediaQuery from './useMediaQuery'
import base from '../themes/themes/base'

const screenSize = () => {
  const { mobile, tablet, desktop } = base.global.responsiveBreakpoints

  const mobNum = parseInt(mobile, 10) + 1
  const tabNum = parseInt(tablet, 10) + 1
  const deskNum = parseInt(desktop, 10) + 1

  const mobPlus1 = `${mobNum}px`
  const tabPlus1 = `${tabNum}px`
  const deskPlus1 = `${deskNum}px`

  const isMobile = useMediaQuery(`(max-width: ${mobile})`)
  const isTablet = useMediaQuery(`(min-width:  ${mobPlus1}) and (max-width: ${tabNum})`)
  const isDesktop = useMediaQuery(`(min-width: ${tabPlus1}) and (max-width: ${deskNum})`)
  const isLargeDesktop = useMediaQuery(`(min-width: ${deskPlus1})`)

  if (isMobile) { return { screen: 'mobile' } }
  if
  (isTablet) { return { screen: 'tablet' } }
  if
  (isDesktop) { return { screen: 'desktop' } }
  if
  (isLargeDesktop) { return { screen: 'largeDesktop' } }

  return { screen: 'desktop' }
}

export default screenSize
