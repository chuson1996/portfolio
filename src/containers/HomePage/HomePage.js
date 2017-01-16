import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import { RevealText } from 'components';
import { Link } from 'react-router';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

export default class HomePage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      showHeadline: false,
      showAboutMe: false,
      showContact: false,
      showSocialMedia: false,
      showBottomSection: false
    };
  }

  componentDidMount() {
    const {location} = this.props;
    const timeline = [
      [location.action === 'PUSH' ? '500' : '0', () => ({ showHeadline: true })],
      ['+500', () => ({ showAboutMe: true })],
      ['+500', () => ({ showContact: true })],
      ['+500', () => ({ showSocialMedia: true })],
      ['+500', () => ({ showBottomSection: true })]
    ];
    setStateWithTimeline(this, timeline);
  }

  render() {
    const { showHeadline, showAboutMe, showContact, showSocialMedia, showBottomSection } = this.state;
    const s = require('./HomePage.scss');

    return (
      <div className={`page ${s.homePage}`}>
        { showHeadline && <RevealText
            coverClassName={s.title__cover}
            text={'Chu Hoang Son'} /> }
        { showAboutMe && <Motion defaultStyle={{ opacity: 0, y: 20 }}
          style={{ opacity: spring(1), y: spring(0) }}>
          {({ opacity, y }) =>
            <p style={{ opacity, transform: `translateY(${y}px)` }}><span className="bigger">I’m a front-end developer</span>, living in Espoo, Finland. I’m passionate about design, animation, and care lots about user experience. If you serve a hamburger, you don’t just give your customer a bun, meat and salad, you stack them into a neat and nice deliceous hamburger. And yes, I just made that up.</p>
          }
        </Motion> }
        { showContact && <Motion defaultStyle={{ opacity: 0, y: 20 }}
          style={{ opacity: spring(1), y: spring(0) }}>
          {({ opacity, y }) =>
            <p style={{ opacity, transform: `translateY(${y}px)` }}>
              <a href="mailto:chuson1996@gmail.com" target="_blank">chuson1996@gmail.com</a> <br/>
              Available for freelance projects
            </p>
          }
        </Motion> }
        { showSocialMedia && <Motion defaultStyle={{ opacity: 0, y: 20 }}
          style={{ opacity: spring(1), y: spring(0) }}>
          {({ opacity, y }) =>
            <p style={{ opacity, transform: `translateY(${y}px)` }}>
              <a href="#" target="_blank">LinkedIn</a> <br/>
              <a href="https://www.instagram.com/code_everyday/" target="_blank">Instagram</a>
            </p>
          }
        </Motion> }
        { showBottomSection && <Motion
            defaultStyle={{ opacity: 0, y: 20 }}
            style={{ opacity: spring(1), y: spring(0) }}
          >
            {({ opacity, y }) =>
              <div className={s.bottomSection}
                style={{ opacity, transform: `translateY(${y}px)` }}>
                <svg width="5px" height="42px" viewBox="0 0 5 42">
                  <path d="M0,0 L0,42" stroke="#000" strokeWidth="1" strokeLinecap="square" fill="none"></path>
                </svg>
                <p className={s.text}><Link to="/projects">VIEW MY WORK</Link></p>
              </div>
            }
          </Motion>
        }
      </div>
    );
  }
}
