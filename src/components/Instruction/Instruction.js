import React, { Component, PropTypes } from 'react';
import { Tag } from 'components';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

const tag = (tagName) => {
  return <Tag>{tagName}</Tag>;
};

export default class Instruction extends Component {
  static propTypes = {
    className: PropTypes.string,
    read: PropTypes.func,
  };

  render() {
    const styles = require('./Instruction.scss');
    const { className, read, ...others } = this.props;

    return (
      <Row className={`${styles.instruction} ${className}`} {...others}>
        <Col xs={12}>
          <h3>I can help you find:</h3>
          <ul>
            <li>
              <p>Resources ({tag('article')}{tag('tutorial')}{tag('workshop')}{tag('video')}) related to mainstream front-end frameworks. E.g: {tag('angularjs')}{tag('reactjs')}{tag('vuejs')}</p>
            </li>
            <li>
              <p>Inspiration for your design. E.g: {tag('inspiration')}{tag('button')}</p>
            </li>
            <li>
              <p>Open-sourced library to use in your project(s). {tag('library')}</p>
            </li>
            <li>
              <p>Online tools or helpers to faciliate your working progress in front-end development. E.g: {tag('tool')}</p>
            </li>
            <li>
              <p>And a lot more. Happy learning!</p>
            </li>
          </ul>
          <br/>
          <Button bsStyle={'success'} onClick={read} className={`${styles.button} ${styles.buttonSuccess}`}>
            <i className="fa fa-thumbs-o-up"></i>
            This is helpful
          </Button>
          <Button bsStyle={'danger'} className={`${styles.button} ${styles.buttonDanger}`} onClick={read}>
            <i className="fa fa-thumbs-o-down"></i>
            This is not helpful
          </Button>
          <Button bsStyle={'default'} className={`${styles.button} ${styles.buttonDefault}`} onClick={read}>
            I already know
          </Button>
        </Col>
      </Row>
    );
  }
}
