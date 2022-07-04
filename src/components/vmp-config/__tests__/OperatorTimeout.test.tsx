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
import { OperatorCredentialsOfflineRetentionTime, OperatorSessionTimeout } from '../OperatorTimeout';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: (message: { id: string }) => message.id },
  config: DEFAULT_VMP_CONFIG,
  getPlaceholder: jest.fn(),
  onNumberValueChange: jest.fn()
};

describe('<OperatorCredentialsOfflineRetentionTime />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<OperatorCredentialsOfflineRetentionTime {...props} />));

    it('should render title', () => expect(screen.getByText('vmpConfig.operatorCredentialsOfflineRetentionTime')).toBeInTheDocument());

    it('should render input with default value', () => {
      const input = screen.getByTestId('operatorCredentialsOfflineRetentionTimeInput') as HTMLInputElement;
      expect(input.value).toBe(String(DEFAULT_VMP_CONFIG.operatorCredentialsRetentionTime));
    });
  });

  describe('with non-default values', () => {
    it('should render input with provided value', () => {
      const operatorCredentialsRetentionTimeValue = '100';

      render(
        <OperatorCredentialsOfflineRetentionTime
          {...props}
          config={{
            ...props.config,
            operatorCredentialsRetentionTime: operatorCredentialsRetentionTimeValue
          }}
        />
      );

      const input = screen.getByTestId('operatorCredentialsOfflineRetentionTimeInput') as HTMLInputElement;
      expect(input.value).toBe(operatorCredentialsRetentionTimeValue);
    });
  });
});

describe('<OperatorSessionTimeout />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<OperatorSessionTimeout {...props} />));

    it('should render title', () => expect(screen.getByText('vmpConfig.operatorSessionTimeout')).toBeInTheDocument());

    it('should render input with default value', () => {
      const input = screen.getByTestId('operatorOfflineSessionTimeoutInput') as HTMLInputElement;
      expect(input.value).toBe(String(DEFAULT_VMP_CONFIG.operatorOfflineSessionTimeout));
    });
  });

  describe('with non-default values', () => {
    it('should render input with provided value', () => {
      const operatorOfflineSessionTimeoutValue = '100';

      render(
        <OperatorSessionTimeout
          {...props}
          config={{
            ...props.config,
            operatorOfflineSessionTimeout: operatorOfflineSessionTimeoutValue
          }}
        />
      );

      const input = screen.getByTestId('operatorOfflineSessionTimeoutInput') as HTMLInputElement;
      expect(input.value).toBe(operatorOfflineSessionTimeoutValue);
    });
  });
});
