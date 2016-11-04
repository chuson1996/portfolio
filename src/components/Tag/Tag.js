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
      <a className={styles.tag} {...rest}>
        {children}
      </a>
    ) : (
      <span className={styles.tag} key={index} {...rest}>
        {getTagDisplayValue(tag)}
        <a className="fa fa-minus" onClick={() => {
          // console.log(this.props);
          onRemove(index);
        }} />
      </span>
      );
  }
}
