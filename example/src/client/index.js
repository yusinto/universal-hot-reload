import React from 'react';
import {hydrate} from 'react-dom';
import App from '../universal/app';

hydrate(<App />, document.getElementById('reactDiv'));
