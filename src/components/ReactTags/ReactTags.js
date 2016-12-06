import React, { Component, PropTypes } from 'react';
import TagsInput from 'react-tagsinput';
// import get from 'lodash/get';
import intersection from 'lodash/intersection';
import {AutocompleteRenderInput} from 'components';
import { Tag } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import c from 'classnames';

export default class ReactTags extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    handleChange: PropTypes.func,
    tags: PropTypes.array,
    autocomplete: PropTypes.bool,
    classNames: PropTypes.object,
    renderInputComponent: PropTypes.func,
    inputProps: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      extraTagsInputClass: '',
      tagInputStyle: {},
      containerStyle: {}
    };
  }

  handleChange(newTags) {
    const { handleChange, suggestions, tags: oldTags, autocomplete } = this.props;
    if (autocomplete) {
      handleChange(intersection(newTags, [...suggestions, ...oldTags]));
    } else {
      handleChange(newTags);
    }
  }

  render() {
    const { suggestions, autocomplete, classNames, renderInputComponent, inputProps } = this.props;
    const styles = require('./ReactTags.scss');
    classNames.suggestions = styles.suggestions;

    return (
      <div ref="container" style={this.state.containerStyle}>
        <TagsInput
          style={this.state.tagInputStyle}
          ref={(elem) => this.tagsInputRef = elem}
          className={c(styles.tagsInput, this.state.extraTagsInputClass)}
          focusedClassName={styles.focused}
          inputProps={{
            onFocus: (e) => {
              document.body.classList.add(styles.noScrollYForSmallScreen);

              /* For trasition animation */
              const container = this.refs.container;
              if (window.innerWidth < 769) {
                container.style.height = this.tagContainerRef.getBoundingClientRect().height + 64 + 'px';
              }
              /* Plus 64px because for some reason, the parent
              div only covers the tags container */


              const div = this.tagsInputRef.refs.div;
              div.style.top = div.getBoundingClientRect().top + 'px';
              setTimeout(() => {
                div.style.top = null;
              }, 1);

              if (inputProps && inputProps.onFocus) {
                inputProps.onFocus(e);
              }
            },
            onBlur: (e) => {
              document.body.classList.remove(styles.noScrollYForSmallScreen);

              const container = this.refs.container;
              const containerDivTop = container.getBoundingClientRect().top;

              this.setState({
                ...this.state,
                containerStyle: {
                  height: (window.innerWidth < 769) ? this.tagContainerRef.getBoundingClientRect().height + 64 : null
                },
                extraTagsInputClass: styles.postFocused,
                tagInputStyle: {
                  top: containerDivTop
                }
              });

              setTimeout(() => {
                this.setState({
                  ...this.state,
                  extraTagsInputClass: '',
                  tagInputStyle: {},
                  containerStyle: {}
                });
              }, 200);

              if (inputProps && inputProps.onBlur) {
                inputProps.onBlur(e);
              }
            }
          }}
          renderTag={(props) => <Tag index={props.key} {...props} />}
          renderInput={(props) => <AutocompleteRenderInput
            {...{autocomplete, suggestions, classNames, renderInputComponent}}
            {...props} />
          }
          renderLayout={(tagComponents, inputComponent) => {
            return (<span>
              <div ref={(elem) => this.tagContainerRef = elem} className={styles.tagContainer}>
                <ReactCSSTransitionGroup
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={300}
                  transitionName={{
                    enter: 'animatedEnter',
                    enterActive: 'fadeInUp',
                    leave: 'fastAnimated',
                    leaveActive: 'fadeOutUp'
                  }} >
                  {tagComponents}
                </ReactCSSTransitionGroup>
              </div>
              {inputComponent}
            </span>);
          }}
          value={this.props.tags}
          onChange={::this.handleChange} />
      </div>
    );
  }
}
