import * as d3 from 'd3'

function square(x) {
  return x * x
}

function scaleRadial() {
  const linear = d3.scaleLinear()

  function scale(x) {
    return Math.sqrt(linear(x))
  }

  scale.domain = function (_) {
    return arguments.length ? (linear.domain(_), scale) : linear.domain()
  }

  scale.nice = function (count) {
    return linear.nice(count), scale
  }

  scale.range = function (_) {
    return arguments.length
      ? (linear.range(_.map(square)), scale)
      : linear.range().map(Math.sqrt)
  }

  scale.ticks = linear.ticks
  scale.tickFormat = linear.tickFormat

  return scale
}

//   exports.scaleRadial = radial;
export default scaleRadial
