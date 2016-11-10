import React, { Component, PropTypes } from 'react';
import BsPagination from 'react-bootstrap/lib/Pagination';

export default class Pagination extends Component {
  static propTypes = {
    items: PropTypes.array,
    itemsPerPage: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({
        activePage: 1
      });
    }
  }

  handleSelect = (_, {eventKey}) => {
    this.setState({
      activePage: eventKey
    });
    window.scrollTo(0, this.topline.offsetTop);
    // console.log(this.topline);
  };

  render() {
    const { items, itemsPerPage } = this.props;
    const { activePage } = this.state;
    const startIndex = (activePage - 1) * itemsPerPage;
    let endIndex = activePage * itemsPerPage;
    endIndex = (endIndex >= items.length) ? items.length : endIndex;
    const numberOfPages = Math.ceil(items.length / itemsPerPage);

    const visibleItems = items.slice(
      startIndex,
      endIndex
    );

    return items.length ? (
      <div>
        <p className={`text-right gray`} ref={(elem) => this.topline = elem}>
          {/* Showing {startIndex + 1} - {endIndex} of {items.length} items */}
          &nbsp;
        </p>
        { visibleItems }

        { numberOfPages > 1 &&
          <div className={`text-center`}>
            <BsPagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              bsSize="medium"
              maxButtons={5}
              items={numberOfPages}
              activePage={activePage}
              onSelect={this.handleSelect} />
          </div>
        }
      </div>
    ) : null;
  }
}
