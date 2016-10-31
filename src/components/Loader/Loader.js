import React, { Component } from 'react';

export default class Loader extends Component {
  static propTypes = {};

  render() {
    const styles = require('./Loader.scss');
    return (
      <div className={styles.loader}>
      </div>
    );
  }
}
