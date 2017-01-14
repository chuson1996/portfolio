import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import c from 'classnames';
import setStateWithTimeline from 'helpers/setStateWithTimeline';
import { RevealText } from 'components';

const wobbly = (val) => spring(val, presets.wobbly);

export default class ProjectPage extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      atProject: 1,
      projects: [{
        thumbnailUrl: require('../../assets/frodev_thumbnail.png'),
        name: 'Frodev',
        description: 'Bookmark Manager'
      }, {
        thumbnailUrl: require('../../assets/tilt-hover.png'),
        name: 'Tilt Hover',
        description: 'A React Component implementing hover effect inspired by Codrop'
      }],
      motion: [{
        thumbnail: { rotateZ: 0, opacity: 1 },
        caption: { x: 0, opacity: 1 }
      }, {
        thumbnail: { rotateZ: 45, opacity: 0 },
        caption: { x: 100, opacity: 0 }
      }],
      animations: {
        titleOpacity: 0,
        laptopY: 30,
        laptopOpacity: 0,
        captionY: 30,
        captionOpacity: 0,
        microscopeOpacity: 0,
        microscopeY: 0,
        leftArrowOpacity: 0,
        leftArrowX: 40,
        rightArrowOpacity: 0,
        rightArrowX: -40
      }
    };
  }

  componentDidMount() {
    const timeline = [
      ['0', () => ({ titleOpacity: spring(1) })],
      ['+500', () => ({
        laptopY: spring(0),
        laptopOpacity: spring(1)
      })],
      ['+500', () => ({
        captionOpacity: spring(1),
        captionY: spring(0)
      })],
      ['+500', () => ({
        microscopeOpacity: spring(1),
        microscopeY: spring(50),
      })],
      ['+500', () => ({
        microscopeY: wobbly(0),
        leftArrowOpacity: spring(1),
        leftArrowX: wobbly(0),
        rightArrowOpacity: spring(1),
        rightArrowX: wobbly(0),
      })]
    ];
    setStateWithTimeline(this, timeline, 'animations');
  }

  switchProject = (next) => {
    const {atProject, motion, projects} = this.state;
    if (next && atProject >= projects.length) return;
    if (!next && atProject <= 1) return;

    this.setState({
      atProject: next ? atProject + 1 : atProject - 1,
      motion: motion.map((project, index) => {
        if (index === atProject - 1) {
          return {
            thumbnail: {
              rotateZ: wobbly(next ? -45 : 45),
              opacity: wobbly(0)
            },
            caption: {
              x: spring(next ? -100 : 100),
              opacity: spring(0)
            }
          };
        }
        return {
          thumbnail: {
            rotateZ: wobbly(0),
            opacity: wobbly(1)
          },
          caption: {
            x: spring(0),
            opacity: spring(1)
          }
        };
      })
    });
  };

  render() {
    const {
      atProject,
      projects,
      motion
    } = this.state;
    const s = require('./ProjectPage.scss');

    return (
      <Motion style={this.state.animations}>
        {({titleOpacity, laptopY, laptopOpacity, captionY, captionOpacity, microscopeOpacity, microscopeY, leftArrowOpacity, leftArrowX, rightArrowOpacity, rightArrowX}) =>
          <div className={`page ${s.projectPage}`}>
            <div
              style={{ opacity: titleOpacity }}
              className={s.projectPage__title__container}>
              <RevealText
                coverClassName={s.page__title__cover}
                text={<h1 className={'page__title'}>PROJECTS</h1>}
              />
            </div>

            <div className={s.projects}>
              {projects.map(({ thumbnailUrl, name, description }, index) =>
                <div className={s.project} key={index}>
                  <div style={{
                    opacity: laptopOpacity,
                    transform: `translateY(${laptopY}px)`
                  }}>
                    <Motion style={motion[index].thumbnail}>
                      {({ rotateZ, opacity }) =>
                        <div className={s.projectThumbnail} style={{
                          opacity,
                          transform: `rotateZ(${rotateZ}deg)`
                        }}>
                          <div className={s.projectScreen}>
                            <img src={thumbnailUrl} alt=""/>
                          </div>
                        </div>
                      }
                    </Motion>
                  </div>
                  <div style={{
                    opacity: captionOpacity,
                    transform: `translateY(${captionY}px)`
                  }}>
                    <Motion style={motion[index].caption}>
                      {({ opacity, x }) =>
                        <div className={s.projectCaption} style={{
                          opacity,
                          transform: `translateX(${x}px)`
                        }}>
                          <p className={`${s.name} lead`}>{name}</p>
                          <p className={s.description}>{description}</p>
                        </div>
                      }
                    </Motion>
                  </div>
                </div>
              )}
            </div>

            <div className={s.sliderControl}>
              <div style={{
                opacity: leftArrowOpacity,
                transform: `translateX(${leftArrowX}px)`
              }}>
                <a className={c({ [s.disabled]: atProject === 1 })} onClick={() => this.switchProject()}>
                  <i className="fa fa-arrow-left"></i>
                  <i className="fa fa-arrow-left"></i>
                </a>
              </div>
              <div style={{
                opacity: microscopeOpacity,
                transform: `translateY(${microscopeY}px)`
              }}>
                <a>
                  <i className="fa fa-search"></i>
                </a>
              </div>
              <div style={{
                opacity: rightArrowOpacity,
                transform: `translateX(${rightArrowX}px)`
              }}>
                <a className={c({ [s.disabled]: atProject === projects.length })} onClick={() => this.switchProject(true)}>
                  <i className="fa fa-arrow-right"></i>
                  <i className="fa fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        }
      </Motion>
    );
  }
}
