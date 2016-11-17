import React, { Component, PropTypes } from 'react';
import TagsInput from 'react-tagsinput';
// import get from 'lodash/get';
import intersection from 'lodash/intersection';
import {AutocompleteRenderInput} from 'components';
import { Tag } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class ReactTags extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    handleChange: PropTypes.func,
    tags: PropTypes.array,
    autocomplete: PropTypes.bool,
    classNames: PropTypes.object,
    renderInputComponent: PropTypes.func
  };

  handleChange(newTags) {
    const { handleChange, suggestions, tags: oldTags, autocomplete } = this.props;
    if (autocomplete) {
      handleChange(intersection(newTags, [...suggestions, ...oldTags]));
    } else {
      handleChange(newTags);
    }
  }

  render() {
    const { suggestions, autocomplete, classNames, renderInputComponent } = this.props;
    const styles = require('./ReactTags.scss');
    classNames.suggestions = styles.suggestions;

    return (
      <TagsInput
        ref={(elem) => this.tagsInputRef = elem}
        className={styles.tagsInput}
        focusedClassName={styles.focused}
        inputProps={{
          onFocus: () => {
            // if (window.innerWidth < 769) {
            //   document.body.style.overflowY = 'hidden';
            // }
            document.body.classList.add(styles.noScrollYForSmallScreen);

            /* For trasition animation */
            const div = this.tagsInputRef.refs.div;
            div.style.top = div.getBoundingClientRect().top + 'px';
            setTimeout(() => {
              div.style.top = null;
            }, 1);
          },
          onBlur: () => {
            // if (window.innerWidth < 769) {
            //   document.body.style.overflowY = 'auto';
            // }
            document.body.classList.remove(styles.noScrollYForSmallScreen);
          }
        }}
        renderTag={(props) => <Tag index={props.key} {...props} />}
        renderInput={(props) => <AutocompleteRenderInput
          {...{autocomplete, suggestions, classNames, renderInputComponent}}
          {...props} />
        }
        renderLayout={(tagComponents, inputComponent) => {
          return (<span>
            <div className={styles.tagContainer}>
              <ReactCSSTransitionGroup
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
                transitionName={{
                  enter: 'animatedEnter',
                  enterActive: 'fadeInUp',
                  leave: 'animated',
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
    );
  }
}
