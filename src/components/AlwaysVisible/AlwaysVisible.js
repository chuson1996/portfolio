import React, { Component, PropTypes } from 'react';

export default class AlwaysVisible extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { top, width } = this.div.getBoundingClientRect();
    const scrollY = window.scrollY;
    // console.log(`Mounted with top: ${top}, width: ${width}`);
    setTimeout(() => {
      this.setState({
        initial: {
          top: top + scrollY,
          width
        }
      });
      this.listener();
    });

    // console.log('Add scroll listener');
    window.addEventListener('scroll', this.listener);
  }

  componentWillUnmount() {
    // console.log('Remove scroll listener');
    window.removeEventListener('scroll', this.listener);
  }

  listener = () => {
    const scrollY = window.scrollY;
    const { top, width } = this.state.initial;
    if (top - scrollY < 0) {
      this.setState({
        ...this.state,
        style: {
          position: 'fixed',
          width,
          top: 0
        }
      });
    } else {
      this.setState({
        ...this.state,
        style: {
          position: 'relative'
        }
      });
    }
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <div {...rest}>
        <div
          style={this.state.style}
          ref={(elem) => this.div = elem}>
          {children}
        </div>
      </div>
    );
  }
}
