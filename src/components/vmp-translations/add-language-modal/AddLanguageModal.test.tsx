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
import { fireEvent, render, screen } from '@testing-library/react';
import { AddLanguageModal } from './AddLanguageModal';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

test('should render match snapshot', () => {
  const modal = render(<AddLanguageModal intl={{ formatMessage: () => void 0 }} languages={[]} isOpen onYes={() => null} onNo={() => null} />);
  expect(modal).toMatchSnapshot();
});

test('should function onYes be called once with null', () => {
  const mockOnYes = jest.fn(_ => void 0);
  render(<AddLanguageModal intl={{ formatMessage: () => void 0 }} languages={[]} isOpen onYes={mockOnYes} onNo={() => null} />);
  const yesButton = screen.getByText('vmpTranslations.addLanguage.add');
  fireEvent.click(yesButton);
  expect(mockOnYes).toBeCalledWith(null);
  expect(mockOnYes).toBeCalledTimes(1);
});

test('should function onNo be called once', () => {
  const mockOnNo = jest.fn(() => void 0);
  render(<AddLanguageModal intl={{ formatMessage: () => void 0 }} languages={[]} isOpen onYes={() => null} onNo={mockOnNo} />);
  const noButton = screen.getByText('common.cancel');
  fireEvent.click(noButton);
  expect(mockOnNo).toBeCalledTimes(1);
});
