import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './domain/app/appComponent';
import Home from './domain/home/homeContainer';
import Contact from './domain/contact/contactComponent';

const routes =
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/contact" component={Contact}/>
  </Route>;

export default routes;