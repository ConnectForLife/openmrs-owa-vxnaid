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
import { Buttons } from '../common/form/Buttons';

export function SyncScope({ intl, config, syncScopes, onValueChange }) {
  return (
    <>
      <Label className="mr-5 mb-0">
        <FormattedMessage id="vmpConfig.syncScope" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.syncScopeTooltip' })}
        />
      </Label>
      <Buttons options={syncScopes} entity={config} fieldName="syncScope" onChange={onValueChange('syncScope')} />
    </>
  );
}
