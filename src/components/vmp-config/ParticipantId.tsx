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
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { validateRegex, yesNoOptions } from '../../shared/util/form-util';
import { Buttons } from '../common/form/Buttons';

export function ParticipantIDRegex({ intl, config, onValueChange }) {
  const { participantIDRegex } = config;
  return (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.participantIDRegex" />
      </Label>
      <div className="d-inline-block">
        <InputWithPlaceholder
          placeholder={intl.formatMessage({ id: 'vmpConfig.participantIDRegex' })}
          showPlaceholder={!!participantIDRegex}
          value={participantIDRegex}
          onChange={onValueChange('participantIDRegex')}
          className={validateRegex(participantIDRegex) ? 'id-regex' : 'invalid id-regex'}
        />
      </div>
    </>
  );
}

export function AllowManualParticipantIDEntry({ intl, config, onValueChange }) {
  return (
    <>
      <Label className="mr-4">
        <FormattedMessage id="vmpConfig.allowManualParticipantIDEntry" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.allowManualParticipantIDEntryTooltip' })}
        />
      </Label>
      <Buttons
        options={yesNoOptions(intl)}
        entity={config}
        fieldName="allowManualParticipantIDEntry"
        onChange={onValueChange('allowManualParticipantIDEntry')}
      />
    </>
  );
}
