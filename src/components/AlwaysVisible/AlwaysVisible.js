import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';

export default class AlwaysVisible extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // console.log('Add scroll listener');
    window.addEventListener('scroll', this.listener);
  }

  componentWillUnmount() {
    // console.log('Remove scroll listener');
    window.removeEventListener('scroll', this.listener);
  }

  listener = () => {
    const scrollY = window.scrollY;
    const parDivCoordinates = this.parDiv.getBoundingClientRect();
    const top = get(parDivCoordinates, 'top') + scrollY;

    if (top <= scrollY) {
      if (get(this.state, 'style.position') !== 'fixed') {
        this.setState({
          ...this.state,
          style: {
            position: 'fixed',
            width: get(parDivCoordinates, 'width'),
            top: 0,
            zIndex: 1
          }
        });
      }
    } else {
      if (get(this.state, 'style.position') !== 'relative') {
        this.setState({
          ...this.state,
          style: {
            position: 'relative'
          }
        });
      }
    }
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <div {...rest} ref={(elem) => this.parDiv = elem}>
        <div
          style={this.state.style}
          ref={(elem) => this.div = elem}>
          {children}
        </div>
      </div>
    );
  }
}
