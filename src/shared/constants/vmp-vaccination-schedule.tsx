/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { ZERO } from './input';

export const VMP_VACCINATION_SCHEDULE_SETTING_KEY = 'cfl.vaccines';
export const DEFAULT_DOSING_VISIT_TYPES = ['Dosing'];
export const EMPTY_VISIT = {
  doseNumber: ZERO,
  nameOfDose: '',
  numberOfFutureVisit: ZERO,
  lowWindow: ZERO,
  midPointWindow: ZERO,
  upWindow: ZERO
};
export const EMPTY_REGIMEN = { name: null };
export const DEFAULT_VMP_VACCINATION_SCHEDULE = [EMPTY_REGIMEN];
