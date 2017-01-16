import React, { Component, PropTypes } from 'react';
import c from 'classnames';
import { Motion, spring } from 'react-motion';
import { RevealText } from 'components';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

export default class ProjectFroDev extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      show: {
        name: false
      },
      motion: {
        pageY: -100, // Unit: vh,
        imageX: -100, // Unit: vw,
        descriptionOpacity: 0,
        descriptionY: 20,
        linksX: -100,
        linksOpacity: 0,
        skillsOpacity: 0,
      }
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ show: {name: true}}), 1000);
    const timeline = [
      ['0', () => ({ pageY: spring(0) })],
      ['+500', () => ({ imageX: spring(0) })],
      // ['+500', () => {
      //   console.log('Hello?');
      //   this.setState({
      //     show: {
      //       name: true
      //     }
      //   });
      //   return {};
      // }],
      ['+1000', () => ({
        descriptionOpacity: spring(1),
        descriptionY: spring(0)
      })],
      ['+500', () => ({
        linksX: spring(0),
        linksOpacity: spring(1)
      })],
      ['+500', () => ({
        skillsOpacity: spring(1)
      })]
    ];
    setStateWithTimeline(this, timeline, 'motion');
  }

  render() {
    const s = require('./ProjectFroDev.scss');
    const {show} = this.state;

    return (
      <Motion
        style={this.state.motion} >
        {({ pageY, imageX, descriptionOpacity, descriptionY, linksX, linksOpacity, skillsOpacity }) =>
          <div
            style={{ transform: `translateY(${pageY}vh)` }}
            className={c(s.projectFroDev, 'page')}>
            <div className={s.thumbnailContainer}>
              <img
                style={{ transform: `translateX(${imageX}vw)` }}
                className={s.thumbnail}
                src={require('../../assets/frodev_thumbnail.png')} />
            </div>

            { show.name && <RevealText
              coverClassName={s.projecNameBackground}
              text={<h1 className={s.projectName}>FRODEV</h1>} /> }
            <p style={{
              opacity: descriptionOpacity,
              transform: `translateY(${descriptionY})px`
            }} className={s.projectDescription}>FroDev manages link and resources using tags.</p>
            <div style={{
              transform: `translateX(${linksX}px)`,
              opacity: linksOpacity
            }} className={s.links}>
              <p>
                <a href="">Go to Website</a>
              </p>
              <p>
                <a href="">Github</a>
              </p>
            </div>
            <div style={{ opacity: skillsOpacity }} className={s.skills}>
              <p className="lead">Skills:</p>
              <hr/>
              <img className={s.skill} src={require('../../assets/react.png')}/>
              <img className={s.skill} src={require('../../assets/redux.png')}/>
              <img className={s.skill} src={require('../../assets/sketch.png')}/>
            </div>
          </div>
        }
      </Motion>
    );
  }
}
