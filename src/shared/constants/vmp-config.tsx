/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME = 604800000;
const DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT = 43200000;
export const SETTING_KEY = 'biometric.api.config.main';
export const DEFAULT_REGIMEN_UPDATE_PERMITTED = true;
export const EMPTY_COUNTRY = { fields: [] };
export const ORDERED_ADDRESS_FIELD_PARTS = ['field', 'type', 'name', 'displayOrder'];
export const DEFAULT_SYNC_SCOPES = [
  {
    value: 'country',
    label: 'Country'
  },
  {
    value: 'site',
    label: 'Site'
  }
];
export const DEFAULT_AUTH_STEPS = [
  {
    value: 'id_card',
    label: 'ID Card'
  },
  {
    value: 'phone',
    label: 'Phone'
  },
  {
    value: 'iris_scan',
    label: 'Iris Scan'
  },
  {
    value: 'mother_name',
    label: 'Mother Name'
  }
];
export const DEFAULT_VMP_CONFIG = {
  syncScope: DEFAULT_SYNC_SCOPES[0].value,
  operatorCredentialsRetentionTime: DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME,
  operatorOfflineSessionTimeout: DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT,
  vaccine: [{}],
  canUseDifferentManufacturers: true,
  allowManualParticipantIDEntry: true,
  manufacturers: [{}],
  personLanguages: [],
  authSteps: [{}],
  irisScore: null,
  addressFields: [],
  participantIDRegex: ''
};
export const MASTER_ADDRESS_DATA_ORDERED = ['cityVillage', 'stateProvince', 'postalCode', 'countyDistrict'];
export const FREE_TEXT_ORDERED = ['address1', 'address2'];
