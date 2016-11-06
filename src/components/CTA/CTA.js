import React, { Component, /* PropTypes */ } from 'react';
import config from 'config';

export default class CTA extends Component {
  static propTypes = {};

  render() {
    return (
      <div className={`text-center`}>
        <h2>
          <small>Are we missing any important front-end resources? Leave your comments below and we will check all of them.</small>
        </h2>
        <div className="fb-comments" data-href={config.domain} data-numposts="5"></div>
      </div>
    );
  }
}
