/**
 *
 * @license
 * Copyright (C) 2016 Joseph Roque
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Joseph Roque
 * @created 2016-10-05
 * @file configureStore.ts
 * @description Create the Redux store
 */
'use strict';

// Redux imports
import { applyMiddleware, combineReducers, createStore, Reducer } from 'redux';
import thunk from 'redux-thunk';

// Imports
import { default as config, State as ConfigState } from '../reducers/config';
import { default as directions, State as DirectionsState } from '../reducers/directions';
import { default as navigation, State as NavigationState } from '../reducers/navigation';
import { default as schedule, State as ScheduleState } from '../reducers/schedule';
import { default as search, State as SearchState } from '../reducers/search';
import { persist } from './persist';
import { analytics } from './analytics';

// Store state
export interface Store {
  config: ConfigState;
  directions: DirectionsState;
  navigation: NavigationState;
  schedule: ScheduleState;
  search: SearchState;
}

/**
 * Creates a redux store from the reducers and returns it.
 *
 * @param {() => void|undefined} onComplete called when the store has been created
 * @returns {any} redux store
 */
export default function configureStore(onComplete?: () => void | undefined): any {
  const reducers = combineReducers({
    config,
    directions,
    navigation,
    schedule,
    search,
  });

  const store = createStore(reducers as Reducer<any>, applyMiddleware(thunk, persist, analytics));
  if (onComplete != undefined) {
    onComplete();
  }

  return store;
}
