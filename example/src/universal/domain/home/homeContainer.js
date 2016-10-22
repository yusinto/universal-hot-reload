import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as homeActions from './homeAction';
import HomeComponent from './homeComponent';

const mapStateToProps = (state) => {
  const homeState = state.Home;

  return {
    ...homeState,
  };
};

@connect(mapStateToProps, homeActions)
export default class HomeContainer extends Component {
  render() {
    return <HomeComponent {...this.props} />;
  }
}