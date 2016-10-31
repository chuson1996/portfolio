import React, { Component, /* PropTypes */ } from 'react';

export default class CTA extends Component {
  static propTypes = {};

  render() {
    return (
      <div className={`text-center`}>
        <h2>
          Help us enrich front-end resources! <br/>
          <small>If you think some resources should be here, click here to suggest them to us.</small>
        </h2>
      </div>
    );
  }
}
