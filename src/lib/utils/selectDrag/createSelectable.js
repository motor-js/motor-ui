import React from 'react'
import PropTypes from 'prop-types'

const createSelectable = WrappedComponent => {
  class SelectableItem extends React.Component {

    childRef = React.createRef();

    componentDidMount() {
      //const element = ReactDOM.findDOMNode(this)
      const element = this.childRef.current;
      this.context.selectable.register(this.props.selectableKey, element)
    }

    componentWillUnmount() {
      this.context.selectable.unregister(this.props.selectableKey)
    }

    render() {
      return (
        <WrappedComponent ref={this.childRef} {...this.props}>
          {this.props.children}
        </WrappedComponent>
      )
    }
  }

  SelectableItem.contextTypes = {
    selectable: PropTypes.object,
  }

  SelectableItem.propTypes = {
    selectableKey: PropTypes.any.isRequired,
  }

  return SelectableItem
}

export default createSelectable
