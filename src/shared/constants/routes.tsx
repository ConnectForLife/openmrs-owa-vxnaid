/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import VmpConfig from '../../components/vmp-config/VmpConfig';
import VmpVaccinationSchedule from "../../components/vmp-vaccination-schedule/VmpVaccinationSchedule";
import VmpTranslations from "../../components/vmp-translations/VmpTranslations";
import Dashboard from "../../components/dashboard/Dashboard";

export const routeConfig = [
  {
    path: '/vmp-config',
    component: VmpConfig,
    breadcrumb: 'vmpConfig.title'
  },
  {
    path: '/vmp-vaccination-schedule',
    component: VmpVaccinationSchedule,
    breadcrumb: 'vmpVaccinationSchedule.title'
  },
  {
    path: '/vmp-translations',
    component: VmpTranslations,
    breadcrumb: 'vmpTranslations.title'
  },
  {
    path: '/',
    component: Dashboard,
    breadcrumb: 'home.title'
  }
];
