import Constants from '../../common/constants';
import {getRandomInt} from './homeLogic';

export const generateRandom = () => {
  return {
    type: Constants.GENERATE_RANDOM,
    data: getRandomInt(1, 100)
  }
};