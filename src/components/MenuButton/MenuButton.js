import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import c from 'classnames';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

const wobbly = (val) => spring(val, presets.wobbly);

export default class MenuButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    open: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      y: 20,
      opacity: 0,
      line1X: 20,
      line1ScaleX: 0,
      line2X: 20,
      line2ScaleX: 0,
      line3X: 20,
      line3ScaleX: 0,
      line2Right: 0,
      atPage: 1
    };
  }

  componentDidMount() {
    const timeline = [
      ['0', () => ({
        y: wobbly(0),
        opacity: spring(1),
        line1X: wobbly(0),
        line1ScaleX: wobbly(1)
      })],
      ['+300', () => ({
        line2X: wobbly(0),
        line2ScaleX: wobbly(1)
      })],
      ['+300', () => ({
        line3X: wobbly(0),
        line3ScaleX: wobbly(1)
      })]
    ];
    setStateWithTimeline(this, timeline);

    const checkPage = () => {
      const atPage = Math.floor(window.scrollY / window.innerHeight + 1);
      if (atPage !== this.state.atPage) this.setState({ atPage });
    };
    checkPage();
    window.addEventListener('scroll', () => {
      checkPage();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.setState({
        line2Right: wobbly(5)
      });
    } else {
      this.setState({
        line2Right: wobbly(0)
      });
    }
  }

  render() {
    const { onClick, open } = this.props;
    const s = require('./MenuButton.scss');

    return (
      <Motion style={this.state}>
        {({ y, line1X, line2X, line3X, opacity, line1ScaleX, line2ScaleX, line3ScaleX, line2Right }) =>
          <div onClick={onClick} className={c(s.menuButton, { [s.open]: open }, s[`atPage${this.state.atPage}`])} style={{
            opacity,
            transform: `translateY(${y}px)`
          }}>
            <span style={{ transform: `translateX(${line1X}px) scaleX(${line1ScaleX})` }}> </span>
            <span style={{ marginRight: `${line2Right}px`, transform: `translateX(${line2X}px) scaleX(${line2ScaleX})` }}> </span>
            <span style={{ transform: `translateX(${line3X}px) scaleX(${line3ScaleX})` }}> </span>
          </div>
        }
      </Motion>
    );
  }
}
