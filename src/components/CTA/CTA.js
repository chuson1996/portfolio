import React, { Component, /* PropTypes */ } from 'react';
import config from 'config';

export default class CTA extends Component {
  static propTypes = {};

  render() {
    return (
      <div className={`text-center`}>
        <h2>
          Help us enrich front-end resources! <br/>
          <small>If you think some resources should be here, click here to suggest them to us.</small>
        </h2>
        <div className="fb-comments" data-href={config.domain} data-numposts="5"></div>
      </div>
    );
  }
}
