import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

export default class PageLoader extends Component {
  static propTypes = {
    done: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      dashoffset: 0,
      dasharray: 100,
      width: 200,
      opacity: 1
    };
  }

  componentDidMount() {
    const timeline = [
      ['1000', () => ({ dashoffset: spring(30) })],
      ['+1000', () => ({ dashoffset: spring(60) })],
      ['+1000', () => ({ dashoffset: spring(100) })],
      ['+1000', () => {
        this.props.done();
        return { width: spring(0), opacity: spring(0) };
      }]
    ];
    setStateWithTimeline(this, timeline);
  }

  render() {
    const { dashoffset, dasharray, width, opacity } = this.state;
    const s = require('./PageLoader.scss');

    return (
      <Motion
        style={{
          strokeDashoffset: dashoffset,
          strokeDasharray: dasharray,
          width,
          opacity
        }}>
        {({ strokeDashoffset, strokeDasharray, width, opacity }) =>
          <div className={s.pageLoader} style={{ opacity }}>
            <svg className={s.progressBar} width={width} viewBox="0 0 100 5" strokeDasharray={strokeDasharray} strokeDashoffset={100 - strokeDashoffset}>
              <line x1="0" y1="0" x2="100" y2="0" strokeWidth="5px" stroke="white"></line>
            </svg>
          </div>
        }
      </Motion>
    );
  }
}
