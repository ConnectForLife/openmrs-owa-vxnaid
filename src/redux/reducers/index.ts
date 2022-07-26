/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import {combineReducers} from 'redux';

import customizeReducer from '../../components/customize/customize.reducer';
import patient from '../../components/person-header/patient.reducer';

import apps from './apps';
import breadcrumbs from './breadcrumbs';
import location from './location';
import cflPatient from './patient';
import session from './session';
import settings from './setttings';
import addressData from './address-data';
import visit from './visit';
import concept from './concept';
import {reducers as openmrsReducers} from '@openmrs/react-components';
import {reducer as reduxFormReducer} from 'redux-form';

export default combineReducers({
    customizeReducer,
    patient,
    apps,
    breadcrumbs,
    location,
    cflPatient,
    session,
    settings,
    addressData,
    visit,
    openmrs: openmrsReducers,
    form: reduxFormReducer,
    concept
});
