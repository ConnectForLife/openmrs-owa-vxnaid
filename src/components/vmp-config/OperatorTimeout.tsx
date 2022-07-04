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
import { ONE } from 'src/shared/constants/input';

export function OperatorCredentialsOfflineRetentionTime({ intl, config, getPlaceholder, onNumberValueChange }) {
  const operatorCredentialsOfflineRetentionTime = config.operatorCredentialsRetentionTime;
  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.operatorCredentialsOfflineRetentionTime" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.operatorCredentialsOfflineRetentionTimeTooltip' })}
        />
      </Label>
      <InputWithPlaceholder
        placeholder={getPlaceholder(intl, 'vmpConfig.days', true)}
        showPlaceholder={!!operatorCredentialsOfflineRetentionTime}
        value={operatorCredentialsOfflineRetentionTime}
        onChange={onNumberValueChange('operatorCredentialsRetentionTime', ONE)}
        type="number"
        pattern="[1-9]"
        min={ONE}
        data-testid="operatorCredentialsOfflineRetentionTimeInput"
      />
    </>
  );
}

export function OperatorSessionTimeout({ intl, config, getPlaceholder, onNumberValueChange }) {
  const operatorSessionTimeout = config.operatorOfflineSessionTimeout;
  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.operatorSessionTimeout" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.operatorSessionTimeoutTooltip' })}
        />
      </Label>
      <InputWithPlaceholder
        placeholder={getPlaceholder(intl, 'vmpConfig.minutes', true)}
        showPlaceholder={!!operatorSessionTimeout}
        value={operatorSessionTimeout}
        onChange={onNumberValueChange('operatorOfflineSessionTimeout', ONE)}
        type="number"
        pattern="[1-9]"
        min={ONE}
        data-testid="operatorOfflineSessionTimeoutInput"
      />
    </>
  );
}
