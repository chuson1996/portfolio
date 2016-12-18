import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import c from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { load as loadResources } from 'redux/modules/userResources';
import { ResourceCard } from 'components';

@asyncConnect([{
  promise: ({ store: { dispatch }}) => {
    const promises = [];

    promises.push(dispatch(loadResources()));

    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    resources: state.userResources.data,
    loadingResources: state.userResources.loading
  })
)
export default class Bookmark extends Component {
  static propTypes = {
    resources: PropTypes.array,
  };

  render() {
    const { resources } = this.props;

    return (
      <div className={c('container bodyContainer fullScreen')}>
        <Helmet title="Bookmark"/>
        <Navbar fixedTop className={c('header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-center">Bookmark</h4>
            </NavItem>
          </Nav>
        </Navbar>

        <h1 className="hidden-xs text-center m-b-40 text-primary">Bookmark</h1>

        <p className={'m-b-20'}>
          <i>* When you save a link, it will be private for a while. Then FroDev will review and share it to the community.</i>
        </p>

        { resources && !!resources.length &&
          resources.map((resource, i) => <ResourceCard key={i} saved {...resource} />)
        }
      </div>
    );
  }
}
