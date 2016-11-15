import React, { Component, PropTypes } from 'react';
import cl from 'classnames';

export default class LogoSVG extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const styles = require('./LogoSVG.scss');
    const { className, ...others } = this.props;

    return (
      <svg className={cl(styles.logoSVG, className)} {...others} width="445px" height="478px" viewBox="0 0 445 478" version="1.1">
        <defs>
          <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-1">
          <stop stopColor="#708DA0" offset="0%"></stop>
          <stop stopColor="#3D5467" offset="100%"></stop>
        </linearGradient>
        <rect id="path-2" x="29" y="28" width="161" height="99"></rect>
        <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-3">
          <feMorphology radius="4.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
          <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur stdDeviation="28.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <rect id="path-4" x="29" y="28" width="161" height="99"></rect>
        <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-5">
          <feMorphology radius="4.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
          <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur stdDeviation="28.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        </defs>
        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
          <g id="Logo">
            <rect id="Rectangle" className={cl(styles.faceOuter)} fill="url(#linearGradient-1)" x="66" y="1.42108547e-14" width="313" height="478"></rect>
            <path d="M93.9375,95.9360485 C109.638687,98.2125836 126.358026,99.4405886 143.703629,99.4405886 C204.816581,99.4405886 258.155505,84.1969784 286.581203,61.559139 C299.610655,79.2361896 322.858048,92.8339854 351.0625,98.7786426 L351.0625,375 L93.9375,375 L93.9375,95.9360485 Z" id="Combined-Shape" fill="#D7ECFF"></path>
            <circle id="Oval-3" fill="#FFFFFF" cx="222.5" cy="426.5" r="38.5"></circle>
            <g id="Glass" className={cl(styles.glass, styles.glassLeft)}>
              <rect id="Rectangle-2" className={cl(styles.glassOuter)} fill="url(#linearGradient-1)" fill-rule="evenodd" x="0" y="0" width="217" height="153"></rect>
              <g id="Rectangle-2">
                <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
                <use fill="#FFFFFF" fill-rule="evenodd" xlinkHref="#path-2"></use>
              </g>
            </g>
            <g id="Glass" className={cl(styles.glass, styles.glassRight)}>
              <rect id="Rectangle-2" className={cl(styles.glassOuter)} fill="url(#linearGradient-1)" fill-rule="evenodd" x="0" y="0" width="217" height="153"></rect>
              <g id="Rectangle-2">
                <use fill="black" fillOpacity="1" filter="url(#filter-5)" xlinkHref="#path-4"></use>
                <use fill="#FFFFFF" fill-rule="evenodd" xlinkHref="#path-4"></use>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }
}
