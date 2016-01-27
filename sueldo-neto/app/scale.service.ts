import {Injectable} from 'angular2/core';
import {Scale} from './scale';
import {SCALES} from './scales';

@Injectable()
export class ScaleService {

  getScales() {
    return  Promise.resolve(SCALES);
  }

}

