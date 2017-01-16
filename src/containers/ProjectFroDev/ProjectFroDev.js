import React, { Component, PropTypes } from 'react';
import c from 'classnames';
import { Motion, spring } from 'react-motion';
import { RevealText } from 'components';
import setStateWithTimeline, { se, de } from 'helpers/setStateWithTimeline';

export default class ProjectFroDev extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      show: {
        name: false
      },
      motion: {
        page: { y: -100 }, // Unit: vh,
        image: { x: -100}, // Unit: vw,
        description: { opacity: 0, y: 20 },
        links: { x: -100, opacity: 0 },
        skills: { opacity: 0 },
        skill1: { opacity: 0, y: 20 },
        skill2: { opacity: 0, y: 20 },
        skill3: { opacity: 0, y: 20 },
      }
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ show: {name: true}}), 1000);
    const timeline = [
      ['0', () => ({ page: {y: spring(0)} })],
      ['+500', () => ({ image: {x: spring(0)} })],
      ['+1000', () => ({
        description: { opacity: spring(1), y: spring(0) },
      })],
      ['+500', () => ({
        links: { x: spring(0), opacity: spring(1) },
      })],
      ['+500', () => ({
        skills: { opacity: spring(1) }
      })],
      ['+500', () => ({
        skill1: { opacity: spring(1), y: spring(0) },
      })],
      ['+500', () => ({
        skill2: { opacity: spring(1), y: spring(0) },
      })],
      ['+500', () => ({
        skill3: { opacity: spring(1), y: spring(0) },
      })]
    ];
    setStateWithTimeline(this, timeline, 'motion');
  }

  render() {
    const s = require('./ProjectFroDev.scss');
    const {show} = this.state;

    return (
      <Motion
        style={se(this.state.motion)} >
        {(rawStyle) => (({ page, image, description, links, skills, skill1, skill2, skill3 }) =>
          <div
            style={{ transform: `translateY(${page.y}vh)` }}
            className={c(s.projectFroDev, 'page')}>
            <div className={s.thumbnailContainer}>
              <img
                style={{ transform: `translateX(${image.x}vw)` }}
                className={s.thumbnail}
                src={require('../../assets/frodev_thumbnail.png')} />
            </div>

            { show.name && <RevealText
              coverClassName={s.projecNameBackground}
              text={<h1 className={s.projectName}>FRODEV</h1>} /> }
            <p style={{
              opacity: description.opacity,
              transform: `translateY(${description.y})px`
            }} className={s.projectDescription}>FroDev manages link and resources using tags.</p>
            <div style={{
              transform: `translateX(${links.x}px)`,
              opacity: links.opacity
            }} className={s.links}>
              <p>
                <a target="_blank" href="https://frodev.herokuapp.com">Go to Website</a>
              </p>
              <p>
                <a target="_blank" href="https://github.com/chuson1996/frontend-advisor">Github</a>
              </p>
            </div>
            <div style={{ opacity: skills.opacity }} className={s.skills}>
              <p className="lead">Skills:</p>
              <hr/>
              <img style={{
                opacity: skill1.opacity,
                transform: `translateY(${skill1.y}px)`
              }} className={s.skill} src={require('../../assets/react.png')}/>
              <img style={{
                opacity: skill2.opacity,
                transform: `translateY(${skill2.y}px)`
              }} className={s.skill} src={require('../../assets/redux.png')}/>
              <img style={{
                opacity: skill3.opacity,
                transform: `translateY(${skill3.y}px)`
              }} className={s.skill} src={require('../../assets/sketch.png')}/>
            </div>
          </div>)(de(rawStyle))
        }
      </Motion>
    );
  }
}
