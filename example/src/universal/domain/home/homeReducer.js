import Constants from '../../common/constants';

const defaultState = {
  number: 0,
};

export default function App(state = defaultState, action) {
  switch (action.type) {
    case Constants.GENERATE_RANDOM:
      return Object.assign({}, state, {number: action.data});

    default:
      return state;
  }
}