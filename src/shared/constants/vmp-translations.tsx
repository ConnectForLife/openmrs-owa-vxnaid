/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import ISO6391 from 'iso-639-1';

export const VMP_TRANSLATIONS_SETTING_KEY = 'biometric.api.config.localization';
export const LANGUAGES_ALLOWED_SETTING_KEY = 'locale.allowed.list';
export const LANGUAGE_OPTIONS = ISO6391.getAllCodes().map(code => ({ label: ISO6391.getName(code), value: code }));
export const DEFAULT_VMP_TRANSLATIONS_SETTING = { localization: {} };
export const DEFAULT_DOWNLOAD_FILENAME = 'translations.csv';
export const DEFAULT_DELIMITER = ',';
export const ACCEPTED_FILE_EXTENSIONS = '.csv';
