import { setStyle } from '../Helpers'

export const addTooltip = ({ tooltipContainer, TooltipWrapper }) => {

  // Define the div for the tooltip
  try {
    tooltipContainer.selectAll('div.tooltip').remove()
    const tooltip = tooltipContainer.append('div').attr('class', 'tooltip')

    setStyle(tooltip, TooltipWrapper)

    return tooltip
  } catch (err) {
    console.log('Error in Tooltip.jsx : addTooltip function')
    console.log(err)
  }
}

export const showTooltip = ({
  tooltip,
  cursorLocation,
  data,
  TooltipShowStyle,
}) => {
  tooltip.transition().duration(200)
  setStyle(tooltip, TooltipShowStyle)

  tooltip
    .html(`${data.key}`+', '+`${data.value}`)
    .style('left', `${cursorLocation[0]}px`)
    .style('top', `${cursorLocation[1]}px`)
}

export const hideTooltip = ({ tooltip, TooltipHideStyle }) => {
  tooltip.transition().duration(500)

  setStyle(tooltip, TooltipHideStyle)

}
