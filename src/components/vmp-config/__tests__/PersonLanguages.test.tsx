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
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';
import { PersonLanguages } from '../PersonLanguages';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: (message: { id: string }) => message.id },
  config: DEFAULT_VMP_CONFIG,
  onValueChange: jest.fn()
};

describe('<PersonLanguages />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<PersonLanguages {...props} />));

    it('should render title', () => expect(screen.getByTestId('personLanguagesLabel')).toContainHTML('vmpConfig.personLanguages'));
  });
});
