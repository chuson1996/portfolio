import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import { RevealText } from 'components';
import setStateWithTimeline from 'helpers/setStateWithTimeline';

export default class HomePage extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      showHeadline: false,
      showAboutMe: false,
      showContact: false,
      showSocialMedia: false
    };
  }

  componentDidMount() {
    const timeline = [
      ['0', () => ({ showHeadline: true })],
      ['+250', () => ({ showAboutMe: true })],
      ['+250', () => ({ showContact: true })],
      ['+250', () => ({ showSocialMedia: true })]
    ];
    setStateWithTimeline(this, timeline);
  }

  render() {
    const { showHeadline, showAboutMe, showContact, showSocialMedia } = this.state;
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
      </div>
    );
  }
}
