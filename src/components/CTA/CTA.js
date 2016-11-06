import React, { Component, /* PropTypes */ } from 'react';
import config from 'config';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

export default class CTA extends Component {
  static propTypes = {};

  render() {
    const styles = require('./CTA.scss');

    return (
      <div className={`text-center`}>
        <Row className={styles.ctaCopy}>
          <Col xs={12}>
            <p className="gray-light lead m-t-30 m-b-30">
              Are we missing any important front-end resources? Leave your comments below and we will check them all.
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="fb-comments" data-href={config.domain} data-numposts="5"></div>
          </Col>
        </Row>
      </div>
    );
  }
}
