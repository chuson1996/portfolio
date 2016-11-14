import React, { Component, PropTypes } from 'react';

export default class Tag extends Component {
  static propTypes = {
    children: PropTypes.any,
    tag: PropTypes.string,
    onRemove: PropTypes.func,
    getTagDisplayValue: PropTypes.func,
    index: PropTypes.any,
    className: PropTypes.string
  };

  render() {
    const { tag,
      index,
      onRemove,
      getTagDisplayValue,
      className,
      children,
      ...rest } = this.props;
    const styles = require('./Tag.scss');

    return children ? (
      <span className={styles.tag} {...rest}>
        {children}
      </span>
    ) : (
      <span className={styles.tag} key={index} {...rest}>
        {getTagDisplayValue(tag)}
        <a className="fa fa-close" onClick={() => {
          onRemove(index);
        }} />
      </span>
      );
  }
}
