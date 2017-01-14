import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import setStateWithTimeline from 'helpers/setStateWithTimeline';
import c from 'classnames';
import { browserHistory } from 'react-router';

const easeout = (val) => spring(val, {
  stiffness: 267,
  damping: 15
});

// const animate = (val) => spring(val, presets.gentle);

export default class Menu extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    orderClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      actionWhenRest: null,
      motion: {
        col1Height: 0,
        col2Height: 0,
        h1_1opacity: 0,
        h11y: 20,
        h1_2opacity: 0,
        h12y: 20,
        h1_3opacity: 0,
        h13y: 20
      }
    };
  }

  componentDidMount() {
    if (this.props.open) {
      const timeline = [
        ['0', () => ({ col1Height: easeout(100) })],
        ['+200', () => ({ col2Height: easeout(100) })],
        ['+200', () => ({
          h1_1opacity: spring(1),
          h11y: easeout(0)
        })],
        ['+100', () => ({
          h1_2opacity: spring(1),
          h12y: easeout(0)
        })],
        ['+100', () => ({
          h1_3opacity: spring(1),
          h13y: easeout(0)
        })]
      ];
      if (this.timeouts) this.timeouts.forEach(clearTimeout);
      this.timeouts = setStateWithTimeline(this, timeline, 'motion');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      const timeline = [
        ['0', () => ({ col1Height: easeout(100) })],
        ['200', () => ({ col2Height: easeout(100) })],
        ['300', () => ({
          h1_1opacity: spring(1),
          h11y: easeout(0)
        })],
        ['400', () => ({
          h1_2opacity: spring(1),
          h12y: easeout(0)
        })],
        ['500', () => ({
          h1_3opacity: spring(1),
          h13y: easeout(0)
        })],
      ];
      if (this.timeouts) this.timeouts.forEach(clearTimeout);
      this.timeouts = setStateWithTimeline(this, timeline, 'motion');
    } else {
      const timeline = [
        ['0', () => ({
          h1_1opacity: spring(0),
          h11y: easeout(20)
        })],
        ['100', () => ({
          h1_2opacity: spring(0),
          h12y: easeout(20)
        })],
        ['200', () => ({
          h1_3opacity: spring(0),
          h13y: easeout(20)
        })],
        ['300', () => ({ col2Height: easeout(0) })],
        ['500', () => ({ col1Height: easeout(0) })],
      ];
      if (this.timeouts) this.timeouts.forEach(clearTimeout);
      this.timeouts = setStateWithTimeline(this, timeline, 'motion');
    }
  }

  onRest = () => {
    if (this.state.actionWhenRest) {
      this.state.actionWhenRest();
      this.setState({
        actionWhenRest: null
      });
    }
  };

  push = (path) => {
    setTimeout(() => browserHistory.push(path), 800);
    this.props.orderClose();
  };

  render() {
    const s = require('./Menu.scss');
    return (
      <Motion style={this.state.motion} onRest={this.onRest}>
        {({ col1Height, col2Height, h1_1opacity, h11y, h1_2opacity, h12y, h1_3opacity, h13y }) =>
          <div className={c(s.menu)} style={{ height: `${Math.max(col1Height, col2Height)}vh` }}>
            <div className={c(s.menu__col1)} style={{
              clipPath: `polygon(0% 0%, 51% 0%, 51% 100%, 0% 100%)`,
              WebkitClipPath: `polygon(0% 0%, 51% 0%, 51% 100%, 0% 100%)`,
              height: `${Math.abs(col1Height)}vh`
            }}></div>
            <div className={s.menu__col2} style={{
              clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
              WebkitClipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
              height: `${Math.abs(col2Height)}vh`
            }}></div>
            <div className={s.menu__body}>
              <h1
                onClick={() => this.push('/')}
                style={{
                  transform: `translateY(${h11y}px)`,
                  opacity: h1_1opacity
                }}>
                ABOUT ME
              </h1><br/>
              <h1
                onClick={() => this.push('/projects')}
                style={{
                  transform: `translateY(${h12y}px)`,
                  opacity: h1_2opacity
                }}>
                PUBLISHED PROJECTS
              </h1><br/>
              <h1 style={{
                transform: `translateY(${h13y}px)`,
                opacity: h1_3opacity
              }}>AWARDS</h1>
            </div>
          </div>
        }
      </Motion>
    );
  }
}
