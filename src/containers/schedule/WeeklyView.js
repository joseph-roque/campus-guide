/**
 *
 * @license
 * Copyright (C) 2016-2017 Joseph Roque
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
 * @created 2017-01-27
 * @file WeeklyView.js
 * @description Displays the user's schedule by week
 *
 * @flow
 */
'use strict';

// React imports
import React from 'react';
import {
  // Dimensions,
  LayoutAnimation,
  Picker,
  Platform,
  StyleSheet,
  // TouchableOpacity,
  View,
} from 'react-native';

// Redux imports
import {connect} from 'react-redux';
import {
  updateConfiguration,
} from 'actions';

// Type imports
import type {
  ConfigurationOptions,
  Language,
  Semester,
  TimeFormat,
} from 'types';

// Type definition for component props.
type Props = {
  currentSemester: number,                                // The current semester, selected by the user
  language: Language,                                     // The current language, selected by the user
  semesters: Array < Semester >,                          // Semesters available at the university
  timeFormat: TimeFormat,                                 // The user's preferred time format
  updateConfiguration: (o: ConfigurationOptions) => void, // Update the global configuration state
};

// Type definition for component state.
type State = {
  showSemesters: boolean, // True to show drop down to swap semesters
};

import Header from 'Header';
import * as Constants from 'Constants';
import * as TranslationUtils from 'TranslationUtils';
import {getPlatformIcon} from 'DisplayUtils';

// Screen dimensions
// const screenWidth = Dimensions.get('window').width;

// Icon for representing the current semester
const semesterIcon = {
  android: {
    class: 'ionicons',
    name: 'md-calendar',
  },
  ios: {
    class: 'ionicons',
    name: 'ios-calendar-outline',
  },
};

class Weekly extends React.Component {

  /**
   * Properties this component expects to be provided by its parent.
   */
  props: Props;

  /**
   * Current state of the component.
   */
  state: State;

  /**
   * Constructor.
   *
   * @param {props} props component props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      showSemesters: false,
    };

    (this:any)._toggleSwitchSemester = this._toggleSwitchSemester.bind(this);
  }

  /**
   * Updates the current semester.
   *
   * @param {number} semester the semester to switch to
   */
  _switchSemester(semester: number): void {
    this.props.updateConfiguration({currentSemester: semester});
  }

  /**
   * Toggles the drop down to switch semesters.
   */
  _toggleSwitchSemester(): void {
    LayoutAnimation.easeInEaseOut();
    this.setState({showSemesters: !this.state.showSemesters});
  }

  /**
   * Renders the current semester and a drop down to switch semesters.
   *
   * @param {Object} Translations translations in the current language of certain text
   * @returns {ReactElement<any>} the elements to render
   */
  _renderSemesters(Translations: Object): ReactElement < any > {
    const semesterName = TranslationUtils.getTranslatedName(
      this.props.language,
      this.props.semesters[this.props.currentSemester]
    ) || '';

    return (
      <View>
        <Header
            icon={getPlatformIcon(Platform.OS, semesterIcon)}
            subtitle={(this.state.showSemesters ? Translations.cancel : Translations.switch)}
            subtitleCallback={this._toggleSwitchSemester}
            title={semesterName} />
        {this.state.showSemesters
          ?
            <Picker
                itemStyle={_styles.semesterItem}
                selectedValue={this.props.currentSemester}
                onValueChange={(value) => this._switchSemester(value)}>
              {this.props.semesters.map((semester, index) => {
                const name = TranslationUtils.getTranslatedName(this.props.language, semester);
                return (
                  <Picker.Item
                      key={name}
                      label={name}
                      value={index} />
                );
              })}
            </Picker>
          : null}
      </View>
    );
  }

  /**
   * Renders a list of the user's courses, organized by days.
   *
   * @returns {ReactElement<any>} the hierarchy of views to render
   */
  render(): ReactElement < any > {
    // Get current language for translations
    const Translations: Object = TranslationUtils.getTranslations(this.props.language);

    return (
      <View style={_styles.container}>
        {this._renderSemesters(Translations)}
      </View>
    );
  }
}

// Private styles for component
const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.garnet,
  },
  semesterItem: {
    color: Constants.Colors.primaryWhiteText,
  },
});

// Map state to props
const select = (store) => {
  return {
    currentSemester: store.config.currentSemester,
    language: store.config.language,
    semesters: store.config.semesters,
    timeFormat: store.config.preferredTimeFormat,
  };
};

// Map dispatch to props
const actions = (dispatch) => {
  return {
    updateConfiguration: (options: ConfigurationOptions) => dispatch(updateConfiguration(options)),
  };
};

export default connect(select, actions)(Weekly);
