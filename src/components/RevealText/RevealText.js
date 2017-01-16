import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import c from 'classnames';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

export default class RevealText extends Component {
  static propTypes = {
    text: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    coverClassName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      blockStyle: {
        width: 0,
        x: 0
      },
      textStyle: {
        opacity: 0
      }
    };
  }

  componentDidMount() {
    const timeline = [
      ['0', () => ({
        blockStyle: {
          width: spring(100),
          x: 0
        },
        textStyle: {
          opacity: 0
        }
      })],
      ['+500', () => ({
        blockStyle: {
          width: spring(0),
          x: spring(this.container.offsetWidth)
        },
        textStyle: {
          opacity: 1
        }
      })]
    ];
    setStateWithTimeline(this, timeline);
  }

  render() {
    const { blockStyle, textStyle } = this.state;
    const { text, coverClassName, ...others } = this.props;
    const textElemGen = typeof text === 'string' ?
      (textStyle) => <h1 style={textStyle}>{text}</h1> :
      (textStyle) => React.cloneElement(text, { style: textStyle });
    const s = require('./RevealText.scss');
    return (
      <div className={s.revealText} {...others}>
        <div className={s.revealText__container} ref={(elem) => this.container = elem}>
          <Motion style={blockStyle}>
            {({ width, x }) => <div className={c(s.revealText__block, coverClassName)} style={{
              width: `${width}%`,
              transform: `translateX(${x}px)`
            }}></div>}
          </Motion>
          <Motion style={textStyle}>
            {textElemGen}
          </Motion>
        </div>
      </div>
    );
  }
}
