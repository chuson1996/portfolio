import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import c from 'classnames';
import setStateWithTimeline, { se, de } from 'helpers/setStateWithTimeline';
import { browserHistory } from 'react-router';
import { RevealText } from 'components';

const wobbly = (val) => spring(val, presets.wobbly);
const gentle = (val) => spring(val, presets.gentle);

export default class ProjectPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.element
  };

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
        page: {
          opacity: 1
        },
        title: { opacity: 0 },
        laptop: { y: 30, opacity: 0 },
        caption: { y: 30, opacity: 0 },
        microscope: {
          opacity: 0,
          y: 0,
          scale: 1,
        },
        leftArrow: {
          opacity: 0,
          x: 40,
        },
        rightArrow: {
          opacity: 0,
          x: -40,
        },
        image: { x: 0 }
      }
    };
  }

  componentDidMount() {
    console.log('ProjectPage Mounted');
    const {location} = this.props;
    let timeline;
    if (location.action === 'PUSH' && /^\/.+\/.+$/.test(location.pathname)) {
      timeline = [['0', () => ({
        page: { opacity: 0 },
        microscope: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        leftArrow: {
          opacity: 1,
          x: 0,
        },
        rightArrow: {
          opacity: 1,
          x: 0,
        }
      })]];
    } else {
      timeline = [
        [location.action === 'PUSH' ? '500' : '0', () => ({
          title: { opacity: spring(1) },
          page: { opacity: 1 }
        })],
        ['+500', () => ({
          laptop: { y: spring(0), opacity: spring(1) },
        })],
        ['+500', () => ({
          caption: { y: spring(0), opacity: spring(1) },
        })],
        ['+500', () => ({
          microscope: {
            opacity: spring(1),
            y: spring(-50),
            scale: spring(2)
          },
        })],
        ['+500', () => ({
          microscope: {
            y: wobbly(0),
            scale: spring(1),
          },
          leftArrow: {
            opacity: spring(1),
            x: wobbly(0),
          },
          rightArrow: {
            opacity: spring(1),
            x: wobbly(0),
          }
        })]
      ];
    }
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
              rotateZ: gentle(next ? -45 : 45),
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
            rotateZ: gentle(0),
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

  openProjectMotion = () => {
    const timeline = [
      ['0', () => ({ image: {x: spring(-100)} })],
      ['+500', () => { browserHistory.push('/projects/frodev'); return {}; }]
    ];
    setStateWithTimeline(this, timeline, 'animations');
  };

  render() {
    const {
      atProject,
      projects,
      motion
    } = this.state;
    const s = require('./ProjectPage.scss');

    return (
      <div>
        <Motion style={se(this.state.animations)}>
          { (rawStyles) => (({page, title, laptop, caption, microscope, leftArrow, rightArrow, image }) =>
            <div style={{ opacity: page.opacity }} className={`page ${s.projectPage}`}>
              <div
                style={{ opacity: title.opacity }}
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
                      opacity: laptop.opacity,
                      transform: `translateY(${laptop.y}px)`
                    }}>
                      <Motion style={motion[index].thumbnail}>
                        {({ rotateZ, opacity }) =>
                          <div className={s.projectThumbnail} style={{
                            opacity,
                            transform: `rotateZ(${rotateZ}deg)`
                          }}>
                            <div className={s.projectScreen}>
                              <img style={{
                                transform: `translateX(${image.x}%)`
                              }} src={thumbnailUrl} alt=""/>
                            </div>
                          </div>
                        }
                      </Motion>
                    </div>
                    <div style={{
                      opacity: caption.opacity,
                      transform: `translateY(${caption.y}px)`
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
                  opacity: leftArrow.opacity,
                  transform: `translateX(${leftArrow.x}px)`
                }}>
                  <a className={c({ [s.disabled]: atProject === 1 })} onClick={() => this.switchProject()}>
                    <i className="fa fa-arrow-left"></i>
                    <i className="fa fa-arrow-left"></i>
                  </a>
                </div>
                <div style={{
                  opacity: microscope.opacity,
                  transform: `translateY(${microscope.y}px) scale(${microscope.scale})`
                }}>
                  <a onClick={this.openProjectMotion}>
                    <i className="fa fa-search"></i>
                  </a>
                </div>
                <div style={{
                  opacity: rightArrow.opacity,
                  transform: `translateX(${rightArrow.x}px)`
                }}>
                  <a className={c({ [s.disabled]: atProject === projects.length })} onClick={() => this.switchProject(true)}>
                    <i className="fa fa-arrow-right"></i>
                    <i className="fa fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>)(de(rawStyles))
          }
        </Motion>
        {this.props.children}
      </div>
    );
  }
}
