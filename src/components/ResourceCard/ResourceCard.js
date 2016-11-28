import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';

export default class ResourceCard extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    url: PropTypes.string.isRequired,
  };

  render() {
    const { title, description, tags, url, ...others } = this.props;
    return (
      <Panel {...others}>
        <h3 className="m-b-12">{title}</h3>
        <p className="m-b-12">{description}</p>
        <p className="m-b-12">
          <a href={url} target={'_blank'}>
            <i className={`fa fa-globe`}></i>&nbsp;{url}
          </a>
        </p>
        <p className="m-b-12">
          <span className={`gray`}>Tags: </span>
          {tags && tags.map((tag, _i) =>
            <span key={_i}>
              { _i !== 0 && <span>, </span>}
              <a
                className="link link-dark"
                onClick={() => this.handleAddition(tag)}>{tag}</a>
            </span>
          )}
        </p>
      </Panel>
    );
  }
}
