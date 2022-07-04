/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {useEffect, useState} from 'react';
import './VmpConfig.scss';
import {FormattedMessage} from 'react-intl';
import {Label} from 'reactstrap';
import {InputWithPlaceholder, SelectWithPlaceholder} from '../common/form/withPlaceholder';
import {extractEventValue, selectDefaultTheme} from '../../shared/util/form-util';
import _ from 'lodash';
import {swapPositions} from '../../shared/util/array-util';
import {
  ADDRESS_FIELD_FREE_TEXT,
  ADDRESS_FIELD_MASTER_DATA,
  ADDRESS_FIELD_TYPE,
  ADDRESS_FIELDS,
  FREE_TEXT,
  MASTER_ADDRESS_DATA,
  MAX_FIELD_TYPE_FREE_TEXT_FIELDS,
  MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS
} from '../../shared/constants/address';
import {EMPTY_STRING, ONE, ZERO} from '../../shared/constants/input';
import {EMPTY_COUNTRY, FREE_TEXT_ORDERED, MASTER_ADDRESS_DATA_ORDERED} from '../../shared/constants/vmp-config';
import {PlusMinusButtons} from '../common/form/PlusMinusButtons';
import ValidationError from '../common/form/ValidationError';
import cx from 'classnames';

export function AddressFields({intl, config, onValueChange, countryOptions, showValidationErrors}) {
  const [fieldTypeMasterAddrDataLeft, setFieldTypeMasterAddrDataLeft] = useState([]);
  const [fieldTypeFreeTextLeft, setFieldTypeFreeTextLeft] = useState([]);

  const addressFields = config.addressFields || [];

  useEffect(() => {
    if (addressFields) {
      const loadedFieldTypeMasterAddrDataLeft = [];
      const loadedFieldTypeFreeTextLeft = [];

      addressFields?.map(countryConfig => {
        let fieldTypeMasterAddrDataLeftMapped = MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS;
        let fieldTypeFreeTextLeftMapped = MAX_FIELD_TYPE_FREE_TEXT_FIELDS;

        countryConfig?.fields?.forEach(({field}) => {
          if (MASTER_ADDRESS_DATA_ORDERED.includes(field)) {
            fieldTypeMasterAddrDataLeftMapped -= ONE;
          } else if (FREE_TEXT_ORDERED.includes(field)) {
            fieldTypeFreeTextLeftMapped -= ONE;
          } else {
            // Do nothing
          }
        });

        loadedFieldTypeMasterAddrDataLeft.push(fieldTypeMasterAddrDataLeftMapped);
        loadedFieldTypeFreeTextLeft.push(fieldTypeFreeTextLeftMapped);
      });

      setFieldTypeMasterAddrDataLeft(loadedFieldTypeMasterAddrDataLeft);
      setFieldTypeFreeTextLeft(loadedFieldTypeFreeTextLeft);
    }
  }, [addressFields]);

  const onCountryChange = (countryIdx, fieldIdx, fieldName, isSelect) => e => {
    const value = isSelect ? e.value : extractEventValue(e);
    if (!fieldName) {
      // country name select
      addressFields[countryIdx].countryName = value;
    } else {
      addressFields[countryIdx].fields[fieldIdx][fieldName] = value;
    }
    onValueChange('addressFields')(addressFields);
  };

  const onAddressPartFieldChange = (countryIdx, fieldIdx) => e => {
    let addressPartField = e.value;
    //logic for counter increment
    const clonedMasterAddrDataArr = [...fieldTypeMasterAddrDataLeft];
    const clonedFreeTextArr = [...fieldTypeFreeTextLeft];
    const storedAddressField = addressFields[countryIdx].fields[fieldIdx].field || EMPTY_STRING;

    if (addressPartField.includes(FREE_TEXT)
      && !(storedAddressField.includes(FREE_TEXT) || FREE_TEXT_ORDERED.includes(storedAddressField))) {
      onFreeTextFieldChange(clonedMasterAddrDataArr, clonedFreeTextArr, storedAddressField, countryIdx);
    } else if (addressPartField.includes(MASTER_ADDRESS_DATA)
      && !(storedAddressField.includes(MASTER_ADDRESS_DATA) || MASTER_ADDRESS_DATA_ORDERED.includes(storedAddressField))) {
      onMasterAddressDataFieldChange(clonedMasterAddrDataArr, clonedFreeTextArr, storedAddressField, countryIdx);
    } else {
      // Do nothing
    }

    splitAndSetFieldsAsOldOnes(countryIdx, fieldIdx, addressPartField);
  };

  const onFreeTextFieldChange = (clonedMasterAddrDataArr, clonedFreeTextArr, storedAddressField, countryIdx) => {
    if ((storedAddressField.includes(MASTER_ADDRESS_DATA) || MASTER_ADDRESS_DATA_ORDERED.includes(storedAddressField))
      && (clonedMasterAddrDataArr[countryIdx] !== MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS)) {
      clonedMasterAddrDataArr[countryIdx] += ONE;
      setFieldTypeMasterAddrDataLeft(clonedMasterAddrDataArr);
    }

    clonedFreeTextArr[countryIdx] -= ONE;
    setFieldTypeFreeTextLeft(clonedFreeTextArr);
  };

  const onMasterAddressDataFieldChange = (clonedMasterAddrDataArr, clonedFreeTextArr, storedAddressField, countryIdx) => {
    if ((storedAddressField.includes(FREE_TEXT) || FREE_TEXT_ORDERED.includes(storedAddressField))
      && (clonedFreeTextArr[countryIdx] !== MAX_FIELD_TYPE_FREE_TEXT_FIELDS)) {
      clonedFreeTextArr[countryIdx] += ONE;
      setFieldTypeFreeTextLeft(clonedFreeTextArr);
    }

    clonedMasterAddrDataArr[countryIdx] -= ONE;
    setFieldTypeMasterAddrDataLeft(clonedMasterAddrDataArr);
  };

  const splitAndSetFieldsAsOldOnes = (countryIdx, fieldIdx, addressPartField) => {
    //Logic for splitting and setting the address fields as old ones.
    addressFields[countryIdx].fields[fieldIdx].field = addressPartField;

    if (addressPartField.includes(FREE_TEXT)) {
      addressPartField = ADDRESS_FIELD_FREE_TEXT;
    } else if (addressPartField.includes(MASTER_ADDRESS_DATA)) {
      addressPartField = ADDRESS_FIELD_MASTER_DATA;
    } else {
      // Do nothing
    }

    addressFields[countryIdx].fields[fieldIdx].type = ADDRESS_FIELD_TYPE[addressPartField];
    onValueChange('addressFields')(addressFields);
  };

  const addAddressPart = countryIdx => {
    addressFields[countryIdx].fields.push({});
    onValueChange('addressFields')(addressFields);
  };

  const removeAddressPart = (countryIdx, addressPartIdx) => {
    const fields = addressFields[countryIdx].fields;
    //logic while removing address field row
    const clonedMasterAddrDataArr = [...fieldTypeMasterAddrDataLeft];
    const clonedFreeTextArr = [...fieldTypeFreeTextLeft];
    const addressField = fields[addressPartIdx].field || EMPTY_STRING;

    if (addressField.includes(FREE_TEXT)
      || FREE_TEXT_ORDERED.includes(addressField)) {
      clonedFreeTextArr[countryIdx] += ONE;
      setFieldTypeFreeTextLeft(clonedFreeTextArr);
    } else if (addressField.includes(MASTER_ADDRESS_DATA)
      || MASTER_ADDRESS_DATA_ORDERED.includes(addressField)) {
      clonedMasterAddrDataArr[countryIdx] += ONE;
      setFieldTypeMasterAddrDataLeft(clonedMasterAddrDataArr);
    } else {
      // Do nothing
    }

    fields.splice(addressPartIdx, 1);
    if (fields.length === 0) {
      fields.push({});
    }
    onValueChange('addressFields')(addressFields);
  };

  const moveAddressPart = (countryIdx, idx, offset) => () => {
    swapPositions(addressFields[countryIdx]?.fields, idx, offset);
    onValueChange('addressFields')(addressFields);
  };

  const deleteCountry = countryIdx => () => {
    fieldTypeFreeTextLeft.splice(countryIdx, 1);
    fieldTypeMasterAddrDataLeft.splice(countryIdx, 1);
    setFieldTypeFreeTextLeft(fieldTypeFreeTextLeft);
    setFieldTypeMasterAddrDataLeft(fieldTypeMasterAddrDataLeft);
    addressFields.splice(countryIdx, 1);

    if (addressFields.length === 0) {
      addCountry();
    }
    onValueChange('addressFields')(addressFields);
  };

  const addCountry = () => {
    setFieldTypeMasterAddrDataLeft([...fieldTypeMasterAddrDataLeft, MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS]);
    setFieldTypeFreeTextLeft([...fieldTypeFreeTextLeft, MAX_FIELD_TYPE_FREE_TEXT_FIELDS]);
    addressFields.push(_.cloneDeep(EMPTY_COUNTRY));
    onValueChange('addressFields')(addressFields);
  };

  const addressPartOptions = (countryIdx, addressPartIdx) => {
    return ADDRESS_FIELDS.map(fieldName => ({
      label: fieldName === FREE_TEXT
        ? fieldName + ' ( ' + fieldTypeFreeTextLeft[countryIdx] + ' ' + intl.formatMessage({id: 'vmpConfig.fieldTypeFreeTextIndicator'}, {maxFieldTypeFreeTextFields: MAX_FIELD_TYPE_FREE_TEXT_FIELDS}) + ' )'
        : fieldName + ' ( ' + fieldTypeMasterAddrDataLeft[countryIdx] + ' ' + intl.formatMessage({id: 'vmpConfig.fieldTypeMasterAddressDataIndicator'}, {maxFieldTypeMasterAddressDataFields: MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS}) + ' )',
      value: fieldName,
      isDisabled: (fieldName === FREE_TEXT && !fieldTypeFreeTextLeft[countryIdx]) ||
        (fieldName === MASTER_ADDRESS_DATA && !fieldTypeMasterAddrDataLeft[countryIdx])
    }));
  };

  const getSortedAddressParts = (country) => {
    const addressParts = country.fields || [];
    addressParts.sort((ap1, ap2) => ap1.displayOrder || 0 > ap2.displayOrder || 0);
    return addressParts;
  };

  const getFieldKind = (field) => {
    if (MASTER_ADDRESS_DATA_ORDERED.includes(field)) {
      return MASTER_ADDRESS_DATA;
    } else if (FREE_TEXT_ORDERED.includes(field)) {
      return FREE_TEXT;
    } else {
      return field;
    }
  };

  return (
    <>
      <Label className="mb-3">
        <FormattedMessage id="vmpConfig.addressFields"/>
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({id: 'vmpConfig.addressFieldsTooltip'})}
        />
      </Label>
      {addressFields.map((country, i) => {
        const addressParts = getSortedAddressParts(country);
        return (
          <div key={`addressField-${i}`} className="country" data-testid="country">
            <div className="delete-button-container d-flex justify-content-end">
              <button className="btn btn-primary" onClick={deleteCountry(i)}>
                <FormattedMessage id="vmpConfig.delete"/>
              </button>
            </div>
            <div className="inline-fields">
              <div className="order-icons"/>

              <SelectWithPlaceholder
                placeholder={intl.formatMessage({id: 'vmpConfig.country'})}
                showPlaceholder={!country.countryName}
                value={countryOptions.find(({value}) => value === country.countryName)}
                onChange={onCountryChange(i, null, null, true)}
                options={countryOptions}
                wrapperClassName="flex-1"
                classNamePrefix="default-select"
                theme={selectDefaultTheme}
              />

              <InputWithPlaceholder
                placeholder={intl.formatMessage({id: 'vmpConfig.displayName'})}
                showPlaceholder={!!country.countryName}
                value={country.countryName}
                onChange={onCountryChange(i, null, null, false)}
                wrapperClassName="flex-1"
              />
              {!addressParts.length ? (
                <PlusMinusButtons
                  intl={intl}
                  onPlusClick={() => addAddressPart(i)}
                  onMinusClick={() => removeAddressPart(i, ZERO)}
                  isPlusButtonVisible
                  isMinusButtonVisible={false}
                />
              ) : (
                <div className="action-icons"/>
              )}
            </div>
            {addressParts.map((addressPart, j) => {
              const name = addressPart.name;
              const isNameEmpty = !addressPart.name;
              const isFieldEmpty = !addressPart.field;
              let field = getFieldKind(addressPart.field);

              return (
                <div key={`addressField-${i}-${j}`} className="inline-fields">
                  <div className="d-flex flex-column order-icons">
                    <span
                      className={`glyphicon glyphicon-chevron-up ${j === 0 ? 'disabled' : ''}`}
                      title={intl.formatMessage({id: 'common.moveUp'})}
                      aria-hidden="true"
                      onClick={moveAddressPart(i, j, -1)}
                      data-testid="up-button"
                    />
                    <span
                      className={`glyphicon glyphicon-chevron-down ${j === addressParts.length - 1 ? 'disabled' : ''}`}
                      title={intl.formatMessage({id: 'common.moveDown'})}
                      aria-hidden="true"
                      onClick={moveAddressPart(i, j, 1)}
                      data-testid="down-button"
                    />
                  </div>
                  <div className="flex-1 input-container">
                    <SelectWithPlaceholder
                      placeholder={intl.formatMessage({id: 'vmpConfig.addressField'})}
                      showPlaceholder={!!field}
                      value={field ? {value: field, label: field} : null}
                      onChange={onAddressPartFieldChange(i, j)}
                      options={addressPartOptions(i, j)}
                      wrapperClassName="flex-1"
                      classNamePrefix="default-select"
                      theme={selectDefaultTheme}
                      className={cx({invalid: showValidationErrors && isFieldEmpty})}
                    />
                    {showValidationErrors && isFieldEmpty && <ValidationError message="vmpConfig.error.fieldTypeRequired"/>}
                  </div>
                  <div className="flex-1 input-container">
                    <InputWithPlaceholder
                      placeholder={intl.formatMessage({id: 'vmpConfig.displayName'})}
                      showPlaceholder={!!name}
                      value={name || ''}
                      onChange={onCountryChange(i, j, 'name', false)}
                      wrapperClassName="flex-1"
                      className={cx({invalid: showValidationErrors && isNameEmpty})}
                    />
                    {showValidationErrors && isNameEmpty && <ValidationError message="vmpConfig.error.displayNameRequired"/>}
                  </div>
                  <PlusMinusButtons
                    intl={intl}
                    onPlusClick={() => addAddressPart(i)}
                    onMinusClick={() => removeAddressPart(i, j)}
                    isPlusButtonVisible={j === addressParts.length - 1 && j < MAX_FIELD_TYPE_MASTER_ADDRESS_DATA_FIELDS + MAX_FIELD_TYPE_FREE_TEXT_FIELDS - 1}
                    isMinusButtonVisible
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="d-flex justify-content-end mt-2 mb-2">
        <button className="btn btn-primary" onClick={addCountry}>
          <FormattedMessage id="vmpConfig.addNewCountry"/>
        </button>
      </div>
    </>
  );
}
