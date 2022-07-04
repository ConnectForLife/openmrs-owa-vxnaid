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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncScope } from '../SyncScope';
import { DEFAULT_SYNC_SCOPES, DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: jest.fn() },
  config: DEFAULT_VMP_CONFIG,
  syncScopes: DEFAULT_SYNC_SCOPES,
  onValueChange: jest.fn()
};

describe('<SyncScope />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<SyncScope {...props} />));

    it('should render title', () => expect(screen.getByText('vmpConfig.syncScope')).toBeInTheDocument());

    it('should render appropriate number of buttons', () =>
      props.syncScopes.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument()));

    it('should render active button', () => expect(screen.getByText(props.syncScopes[0].label)).toHaveClass('active'));
  });
});
