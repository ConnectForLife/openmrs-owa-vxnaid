/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../shared/util/form-util';
import ISO6391 from 'iso-639-1';

const LANGUAGE_OPTIONS = ISO6391.getAllNames().map(name => ({ label: name, value: name }));

export function PersonLanguages({ intl, config, onValueChange }) {
  const personLanguages = config.personLanguages || [];

  const onPersonLanguagesChange = name => selectedOptions => {
    // person languages has a form of [{ name: value }, ...]
    onValueChange(name)(selectedOptions.map(option => ({ name: option.value })));
  };

  return (
    <>
      <Label data-testid="personLanguagesLabel">
        <FormattedMessage id="vmpConfig.personLanguages" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.personLanguagesTooltip' })}
        />
      </Label>
      <SelectWithPlaceholder
        placeholder={intl.formatMessage({ id: 'vmpConfig.personLanguages' })}
        showPlaceholder={!!personLanguages && personLanguages.length > 0}
        value={personLanguages.map(lang => ({ label: lang.name, value: lang.name }))}
        onChange={onPersonLanguagesChange('personLanguages')}
        options={LANGUAGE_OPTIONS}
        classNamePrefix="default-select"
        wrapperClassName="default-select-multi"
        isMulti
        theme={selectDefaultTheme}
      />
    </>
  );
}
