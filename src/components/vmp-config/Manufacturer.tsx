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
import { Buttons } from '../common/form/Buttons';
import { extractEventValue, validateRegex, yesNoOptions } from '../../shared/util/form-util';
import _ from 'lodash';
import ValidationError from '../common/form/ValidationError';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';
import cx from 'classnames';

const EMPTY_MANUFACTURER = { name: '', barcodeRegex: '', isValid: true };

export function CanUseDifferentManufacturers({ intl, config, onValueChange }) {
  return (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.canUseDifferentManufacturers" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.canUseDifferentManufacturersTooltip' })}
        />
      </Label>
      <Buttons
        options={yesNoOptions(intl)}
        entity={config}
        fieldName="canUseDifferentManufacturers"
        onChange={onValueChange('canUseDifferentManufacturers')}
      />
    </>
  );
}

export function Manufacturers({ intl, config, openModal, closeModal, onValueChange }) {
  const manufacturers = config.manufacturers || [];
  const vaccine = config.vaccine || [];

  const removeManufacturer = idx => {
    const manufacturerName = manufacturers[idx].name;
    manufacturers.splice(idx, 1);
    if (manufacturers.length === 0) {
      addManufacturer();
    }
    onValueChange('manufacturers')(manufacturers);
    // remove manufacturer from regimen
    vaccine.forEach(v => {
      if (!!v.manufacturers) {
        v.manufacturers = v.manufacturers.filter(mf => mf !== manufacturerName);
      }
    });
    onValueChange('vaccine')(vaccine);
  };

  const onManufacturerRemove = idx => {
    const manufacturerName = manufacturers[idx].name;
    if (vaccine.some(regimen => !!regimen.manufacturers && regimen.manufacturers.includes(manufacturerName))) {
      openModal('vmpConfig.error.header', 'vmpConfig.error.manufacturerAssigned');
    } else {
      openModal('vmpConfig.warning.header', 'vmpConfig.warning.deleteManufacturer', () => removeManufacturer(idx), closeModal);
    }
  };

  const addManufacturer = () => {
    manufacturers.push(_.clone(EMPTY_MANUFACTURER));
    onValueChange('manufacturers')(manufacturers);
  };

  const onManufacturerChange = (i, fieldName) => e => {
    const value = extractEventValue(e);
    if (fieldName === 'name') {
      // update regimen's manufacturers when the name has changed
      const name = manufacturers[i].name;
      vaccine.forEach(v => {
        if (!!v.manufacturers && !!v.manufacturers.length) {
          v.manufacturers = v.manufacturers.map(mf => (mf === name ? value : mf));
        }
      });
      onValueChange('vaccine')(vaccine);
    }
    manufacturers[i][fieldName] = value;
    onValueChange('manufacturers')(manufacturers);
  };

  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.manufacturers" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.manufacturersTooltip' })}
        />
      </Label>
      {(manufacturers || []).map((manufacturer, i) => {
        const isNameEmpty = !manufacturer.name;
        const isBarcodeRegexInvalid = !validateRegex(manufacturer.barcodeRegex) || !manufacturer.barcodeRegex;
        const isValid = manufacturer.isValid;
        return (
          <div key={`manufacturers-${i}`} className="inline-fields">
            <div className="flex-1 input-container">
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.manufacturersName' })}
                showPlaceholder={!!manufacturer.name}
                value={manufacturer.name}
                onChange={onManufacturerChange(i, 'name')}
                className={cx({invalid: !isValid && isNameEmpty})}
              />
              {!isValid && isNameEmpty && <ValidationError message="vmpConfig.error.nameRequired" />}
            </div>
            <div className="flex-2 input-container">
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.barcodeRegex' })}
                showPlaceholder={!!manufacturer.barcodeRegex}
                value={manufacturer.barcodeRegex}
                onChange={onManufacturerChange(i, 'barcodeRegex')}
                className={cx({invalid: !isValid && isBarcodeRegexInvalid})}
              />
              {!isValid && isBarcodeRegexInvalid && <ValidationError message="vmpConfig.error.barcodeRegexInvalid" />}
            </div>
            <PlusMinusButtons
              intl={intl}
              onPlusClick={addManufacturer}
              onMinusClick={() => onManufacturerRemove(i)}
              isPlusButtonVisible={i === manufacturers.length - 1}
            />
          </div>
        );
      })}
    </>
  );
}
