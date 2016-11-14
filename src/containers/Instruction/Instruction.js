import React, { Component, PropTypes } from 'react';
import { Instruction as InstructionComponent } from 'components';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

@connect(null, { push })
export default class Instruction extends Component {
  static propTypes = {
    push: PropTypes.func
  };

  componentDidMount() {
    console.log(window.innerWidth);
    if (window.innerWidth >= 768) {
      this.props.push('/');
    }
  }

  render() {
    const styles = require('./Instruction.scss');

    return (
      <div className={`${styles.instruction} visible-xs`}>
        <InstructionComponent />
      </div>
    );
  }
}
