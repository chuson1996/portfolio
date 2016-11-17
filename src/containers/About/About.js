import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class About extends Component {
  render() {
    return (
      <div className="container bodyContainer">
        <Helmet title="About Us"/>
        <p className="m-t-20 text-center">This project was originally created by Chu Hoang Son</p>

        <h1 className="text-center m-t-40">
          <a href="mailto:chuson1996@gmail.com" target="_blank">
            <i className="text-danger fa fa-envelope"></i>
          </a>
          <a href="https://github.com/chuson1996" target="_blank">
            <i className="text-gray-base fa fa-github m-l-30"></i>
          </a>
          <a href="https://fi.linkedin.com/in/chu-hoang-son-b92499a5" target="_blank">
            <i className="text-primary fa fa-linkedin m-l-30"></i>
          </a>
        </h1>

        <h2 className="text-center m-t-40">Incentive</h2>
        <p>I believe good resources should be shared among the community. Good resources are numerous but not all front-end developers know about them. I hope FroDev will be a place to inspire developers with awesome resources and furthermore hone their skills.</p>

        <h3 className="text-center m-t-40">I like to commit my work not only on Github, but also on... Instagram. <a href="https://www.instagram.com/explore/tags/frodev/">#frodev</a></h3>
        <ul className="juicer-feed" data-feed-id="sonchu">
          <h1 className="referral">
            <a href="https://www.juicer.io">Powered by Juicer</a>
          </h1>
        </ul>
      </div>
    );
  }
}
