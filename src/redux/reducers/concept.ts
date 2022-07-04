/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import axios from 'axios';
import { IConceptState } from '../../shared/models/concept';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_CONCEPT: 'concept/GET_CONCEPT'
};

const initialState: IConceptState = {
  loading: {
    concepts: false,
    concept: false
  },
  query: '',
  concepts: [],
  concept: {
    uuid: '',
    display: '',
    setMembers: []
  },
  errorMessage: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_CONCEPT):
      return {
        ...state,
        loading: {
          ...state.loading,
          concept: true
        }
      };
    case FAILURE(ACTION_TYPES.GET_CONCEPT):
      return {
        ...state,
        loading: {
          ...state.loading,
          concept: false
        },
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_CONCEPT):
      return {
        ...state,
        loading: {
          ...state.loading,
          concept: false
        },
        concept: action.payload.data
      };
    default:
      return state;
  }
};

// actions
export const getConcept = (uuid: string, custom?: string) => ({
  type: ACTION_TYPES.GET_CONCEPT,
  payload: axios.get(`/openmrs/ws/rest/v1/concept/${uuid}?v=${custom ? `custom:(${custom})` : 'full'}`)
});

export default reducer;
