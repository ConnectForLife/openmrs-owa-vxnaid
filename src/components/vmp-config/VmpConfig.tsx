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
import {connect} from 'react-redux';
import './VmpConfig.scss';
import {FormattedMessage, injectIntl, IntlShape} from 'react-intl';
import {
  DEFAULT_AUTH_STEPS,
  DEFAULT_REGIMEN_UPDATE_PERMITTED,
  DEFAULT_SYNC_SCOPES,
  DEFAULT_VMP_CONFIG,
  FREE_TEXT_ORDERED,
  MASTER_ADDRESS_DATA_ORDERED,
  ORDERED_ADDRESS_FIELD_PARTS,
  SETTING_KEY as VMP_CONFIG_SETTING_KEY
} from '../../shared/constants/vmp-config';
import {VMP_VACCINATION_SCHEDULE_SETTING_KEY} from '../../shared/constants/vmp-vaccination-schedule';
import {createSetting, getSettingByQuery, updateSetting} from '../../redux/reducers/setttings';
import {parseJson} from '../../shared/util/json-util';
import '../Inputs.scss';
import {Button, Spinner} from 'reactstrap';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ROOT_URL} from '../../shared/constants/openmrs';
import {IVmpConfig} from '../../shared/models/vmp-config';
import {extractEventValue, getPlaceholder, validateRegex} from '../../shared/util/form-util';
import {errorToast, successToast} from '../toast-handler/toast-handler';
import {TEN, ZERO} from '../../shared/constants/input';
import {ConfirmationModal} from '../common/form/ConfirmationModal';
import {getPatientLinkedRegimens} from '../../redux/reducers/patient';
import {SyncScope} from './SyncScope';
import {OperatorCredentialsOfflineRetentionTime, OperatorSessionTimeout} from './OperatorTimeout';
import {CanUseDifferentManufacturers, Manufacturers} from './Manufacturer';
import {Regimen} from './Regimen';
import {PersonLanguages} from './PersonLanguages';
import {AuthSteps} from './AuthSteps';
import {IrisScore} from './IrisScore';
import {AddressFields} from './AddressFields';
import {AllowManualParticipantIDEntry, ParticipantIDRegex} from './ParticipantId';
import {IVmpVaccinationSchedule} from '../../shared/models/vmp-vaccination-schedule';
import {scrollToTop} from '../../shared/util/window-util';
import {COUNTRY_CONCEPT_REPRESENTATION, COUNTRY_CONCEPT_UUID} from '../../shared/constants/concept';
import {IConceptSetMember} from '../../shared/models/concept';
import {getConcept} from '../../redux/reducers/concept';
import {FREE_TEXT, MASTER_ADDRESS_DATA} from '../../shared/constants/address';
import {defaults, clone, cloneDeep} from 'lodash';

export interface IVmpConfigProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: IntlShape;
}

interface IStore {
  concept: {
    concept: {
      setMembers: IConceptSetMember[];
    };
    loading: {
      concept: boolean;
    };
  };
}

export interface IVmpConfigState {
  vmpConfig: IVmpConfig;
  vmpConfigSetting: {};
  vmpVaccinationSchedule: IVmpVaccinationSchedule[];
  vmpVaccinationScheduleSetting: {};
  savedRegimen: any[];
  isModalOpen: boolean;
  modalHeader: {};
  modalBody: {};
  onModalConfirm: any;
  onModalCancel: any;
  isManufacturerWarningModalOpen: boolean;
}

const MS_IN_A_MINUTE = 1000 * 60;
const MS_IN_A_DAY = MS_IN_A_MINUTE * 60 * 24;

export class VmpConfig extends React.Component<IVmpConfigProps, IVmpConfigState> {
  state = {
    vmpConfig: {} as IVmpConfig,
    vmpConfigSetting: {uuid: null, value: null},
    vmpVaccinationSchedule: [],
    vmpVaccinationScheduleSetting: {uuid: null, value: null},
    savedRegimen: [],
    isModalOpen: false,
    modalHeader: {id: '', values: {}},
    modalBody: {id: '', values: {}},
    onModalConfirm: null,
    onModalCancel: null,
    isManufacturerWarningModalOpen: false
  };

  componentDidMount() {
    this.props.getSettingByQuery(VMP_CONFIG_SETTING_KEY);
    this.props.getSettingByQuery(VMP_VACCINATION_SCHEDULE_SETTING_KEY);
    this.props.getPatientLinkedRegimens();
    this.props.getConcept(COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION);
  }

  componentDidUpdate(prevProps: Readonly<IVmpConfigProps>, prevState: Readonly<IVmpConfigState>, snapshot?: any) {
    const {intl, config, loading, success, error} = this.props;
    if (prevProps.config !== config) {
      this.extractConfigData();
    }
    if (!prevProps.success && success) {
      successToast(intl.formatMessage({id: 'vmpConfig.success'}));
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    } else {
      // Do nothing
    }
  }

  extractConfigData = () => {
    let config = parseJson(this.props.config);

    if (this.props.setting?.property === VMP_CONFIG_SETTING_KEY) {
      config = defaults(config, DEFAULT_VMP_CONFIG);
      const addressFields = config.addressFields;

      // make it a list so it's possible to maintain the order while replacing country name
      config.addressFields = Object.keys(addressFields).map(countryName => ({
        countryName,
        fields: addressFields[countryName]
      }));

      config.operatorCredentialsRetentionTime = config.operatorCredentialsRetentionTime / MS_IN_A_DAY;
      config.operatorOfflineSessionTimeout = config.operatorOfflineSessionTimeout / MS_IN_A_MINUTE;

      this.setState({
        vmpConfig: config,
        vmpConfigSetting: this.props.setting,
        savedRegimen: clone(config.vaccine)
      });
    } else if (this.props.setting?.property === VMP_VACCINATION_SCHEDULE_SETTING_KEY) {
      this.setState({
        vmpVaccinationSchedule: config,
        vmpVaccinationScheduleSetting: this.props.setting
      });
    } else {
      // Do nothing
    }
  };

  generateConfig = () => {
    const config = cloneDeep(this.state.vmpConfig);

    this.revertAddressFieldsBackToMap(config);
    this.revertTimeoutsBackToMs(config);

    // filter out empty rows
    if (!!config.manufacturers) {
      config.manufacturers = config.manufacturers.filter(mf => !!mf.name);
    }
    if (!!config.vaccine) {
      config.vaccine = config.vaccine.filter(vc => !!vc.name);
      config.vaccine.forEach(vc => {
        vc.name = vc.name.trim();
        vc.manufacturers = !!vc.manufacturers ? vc.manufacturers.filter(vcm => !!vcm) : [];
      });
    }
    if (!!config.personLanguages) {
      config.personLanguages = config.personLanguages.filter(pl => !!pl.name);
    }
    if (!!config.authSteps) {
      config.authSteps = config.authSteps.filter(as => !!as.type);
    }
    return config;
  };

  revertAddressFieldsBackToMap = (config) => {
    config.addressFields = !!config.addressFields
      ? config.addressFields.reduce((map, obj) => {
        const masterAddressDataOrdered = [...MASTER_ADDRESS_DATA_ORDERED];
        const freeTextOrdered = [...FREE_TEXT_ORDERED];

        if (!!obj.countryName) {
          map[obj.countryName] = (obj.fields || []).map((field, i) => {
            field.displayOrder = i + 1;

            //logic to convert New dropdowns to old ones
            if (field.field === MASTER_ADDRESS_DATA || MASTER_ADDRESS_DATA_ORDERED.includes(field.field)) {
              field.field = masterAddressDataOrdered.shift();
            } else if (field.field === FREE_TEXT || FREE_TEXT_ORDERED.includes(field.field)) {
              field.field = freeTextOrdered.shift();
            } else {
              // Do nothing
            }

            return ORDERED_ADDRESS_FIELD_PARTS.reduce((fieldPart, key) => {
              fieldPart[key] = field[key];
              return fieldPart;
            }, {});
          });
        }
        return map;
      }, {})
      : {};
  };

  revertTimeoutsBackToMs = (config) => {
    if (!!config.operatorCredentialsRetentionTime) {
      config.operatorCredentialsRetentionTime = config.operatorCredentialsRetentionTime * MS_IN_A_DAY;
    }
    if (!!config.operatorOfflineSessionTimeout) {
      config.operatorOfflineSessionTimeout = config.operatorOfflineSessionTimeout * MS_IN_A_MINUTE;
    }
  };

  onValueChange = name => e => {
    const {vmpConfig} = this.state;
    vmpConfig[name] = extractEventValue(e);
    this.setState({
      vmpConfig
    });
  };

  onVaccinationScheduleChange = vmpVaccinationSchedule => this.setState({vmpVaccinationSchedule});

  onNumberValueChange = (name, min?, max?) => e => {
    const {vmpConfig} = this.state;
    const extractedEventValue = extractEventValue(e);
    const value = !!extractedEventValue ? Number.parseInt(extractedEventValue, TEN) : !!min ? min : ZERO;
    if (Number.isInteger(value)) {
      if ((min !== null && value < min) || (max !== null && value > max)) return;
      vmpConfig[name] = value;
      this.setState({
        vmpConfig
      });
    }
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  isFormValid = () => {
    const {manufacturers, vaccine, addressFields} = this.state.vmpConfig;
    const clonedManufacturers = cloneDeep(manufacturers);
    const clonedVaccines = cloneDeep(vaccine);
    const clonedAddressFields = cloneDeep(addressFields);
    let isFormValid = true;

    clonedManufacturers.forEach(({name, barcodeRegex}, manufacturerIdx) => {
      if (!name || !validateRegex(barcodeRegex) || !barcodeRegex) {
        clonedManufacturers[manufacturerIdx].isValid = false;
          isFormValid = false;
      }
    });

    clonedVaccines.forEach((regimen, regimenIdx) => {
      if (!regimen.name ||
          !regimen.manufacturers.length ||
          this.isRegimenNameDuplicated(clonedVaccines, regimen, regimenIdx)) {
        clonedVaccines[regimenIdx].isValid = false;
        isFormValid = false;
      }
    });

    clonedAddressFields?.forEach(countryConfig => {
      countryConfig?.fields?.forEach(({name, field}, countryConfigIdx) => {
        if (!name || !field) {
          countryConfig.fields[countryConfigIdx].isValid = false;
          isFormValid = false;
        }
      });
    });

    this.setState({
      vmpConfig: {
        ...this.state.vmpConfig,
        manufacturers: clonedManufacturers,
        vaccine: clonedVaccines,
        addressFields: clonedAddressFields
      }
    });

    return isFormValid;
  };

  save = () => {
    const isManufacturersBarcodeRegexDuplicated = this.isManufacturersBarcodeRegexDuplicated();
    if (this.isFormValid()) {
      if (isManufacturersBarcodeRegexDuplicated) {
        this.openManufacturerWarningModal();
      } else {
        this.savePage();
      }
    } else {
      this.setState({
        isModalOpen: true,
        modalHeader: {id: 'vmpConfig.error.header'},
        modalBody: {id: 'vmpConfig.error.configurationInvalid'},
        onModalConfirm: () => {
          this.closeModal();
          scrollToTop();
        },
        onModalCancel: null
      });
    }
  };

  isManufacturersBarcodeRegexDuplicated = () => {
    const manufacturers = this.state.vmpConfig.manufacturers;
    const barcodeRegexes = manufacturers.map(el => el.barcodeRegex);
    let isBarcodeRegexDuplicated = false;
    isBarcodeRegexDuplicated = barcodeRegexes.some((element, index) => {
      return barcodeRegexes.indexOf(element) !== index;
    });

    return isBarcodeRegexDuplicated;
  }

  savePage = () => {
    const {vmpVaccinationSchedule, vmpConfigSetting, vmpVaccinationScheduleSetting} = this.state;

    const config = this.generateConfig();
    const configJson = JSON.stringify(config);
    if (vmpConfigSetting?.uuid) {
      vmpConfigSetting.value = configJson;
      this.props.updateSetting(vmpConfigSetting);
    } else {
      this.props.createSetting(VMP_CONFIG_SETTING_KEY, configJson);
    }
    if (vmpVaccinationScheduleSetting?.uuid) {
      vmpVaccinationScheduleSetting.value = JSON.stringify(vmpVaccinationSchedule);
      this.props.updateSetting(vmpVaccinationScheduleSetting);
    }
  }

  isRegimenNameDuplicated = (vaccine, regimen, idx) =>
    !!regimen.name && !this.state.savedRegimen.includes(regimen) && !!vaccine.find((r, j) => idx !== j && r.name === regimen.name);

  modal = () => (
    <ConfirmationModal
      header={this.state.modalHeader}
      body={this.state.modalBody}
      onYes={this.state.onModalConfirm}
      onNo={this.state.onModalCancel}
      isOpen={this.state.isModalOpen}
      customYesButtonText={null}
    />
  );

  renderManufacturerWarningModal = () => (
    <ConfirmationModal
      header={{ id: 'vmpConfig.warning.header' }}
      body={{ id: 'vmpConfig.warning.duplicatedManufacturerBarcodeRegex' }}
      onYes={() => {
        this.savePage();
        this.closeManufacturerWarningModal();
      }}
      onNo={this.closeManufacturerWarningModal}
      isOpen={this.state.isManufacturerWarningModalOpen}
      customYesButtonText={{ id: 'custom.yesButtonText' }}
    />
  );

  closeManufacturerWarningModal = () => this.setState({ isManufacturerWarningModalOpen: false });

  openManufacturerWarningModal = () => this.setState({ isManufacturerWarningModalOpen: true });

  openModal = (modalHeader, modalBody, onModalConfirm = null, onModalCancel = null) => {
    this.setState({
      isModalOpen: true,
      modalHeader: {id: modalHeader},
      modalBody: {id: modalBody},
      onModalConfirm: () => {
        if (!!onModalConfirm) {
          onModalConfirm();
        }
        this.closeModal();
      },
      onModalCancel
    });
  };

  closeModal = () => this.setState({isModalOpen: false});

  render() {
    const {intl, appError, appLoading, loading, patientLinkedRegimens, syncScopes, authSteps, regimenUpdatePermitted, loadingConcept, countryOptions} = this.props;
    const {vmpConfig, vmpVaccinationSchedule, savedRegimen} = this.state;
    const isLoading = appLoading || (loading && !vmpConfig) || loadingConcept;
    return (
      <div className="vmp-config">
        {this.modal()}
        {this.renderManufacturerWarningModal()}
        <h2>
          <FormattedMessage id="vmpConfig.title"/>
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {isLoading ? (
            <Spinner/>
          ) : (
            <>
              <div className="section" data-testid="syncScopeSection">
                <SyncScope intl={intl} syncScopes={syncScopes} config={vmpConfig} onValueChange={this.onValueChange}/>
              </div>
              <div className="inline-sections">
                <div className="section" data-testid="operatorCredentialsOfflineRetentionTimeSection">
                  <OperatorCredentialsOfflineRetentionTime
                    intl={intl}
                    config={vmpConfig}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
                <div className="section" data-testid="operatorSessionTimeoutSection">
                  <OperatorSessionTimeout
                    intl={intl}
                    config={vmpConfig}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
              </div>
              <div className="section" data-testid="manufacturersSection">
                <Manufacturers
                  intl={intl}
                  config={vmpConfig}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                />
              </div>
              <div className="section" data-testid="regimenSection">
                <Regimen
                  intl={intl}
                  config={vmpConfig}
                  vaccinationSchedule={vmpVaccinationSchedule}
                  savedRegimen={savedRegimen}
                  patientLinkedRegimens={patientLinkedRegimens}
                  isRegimenNameDuplicated={this.isRegimenNameDuplicated}
                  readOnly={!regimenUpdatePermitted}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                  onVaccinationScheduleChange={this.onVaccinationScheduleChange}
                />
              </div>
              <div className="section" data-testid="canUseDifferentManufacturersSection">
                <CanUseDifferentManufacturers intl={intl} config={vmpConfig} onValueChange={this.onValueChange}/>
              </div>
              <div className="section" data-testid="personLanguagesSection">
                <PersonLanguages intl={intl} config={vmpConfig} onValueChange={this.onValueChange}/>
              </div>
              <div className="section" data-testid="authStepsSection">
                <AuthSteps intl={intl} config={vmpConfig} options={authSteps} onValueChange={this.onValueChange}/>
              </div>
              <div className="section" data-testid="allowManualParticipantIDEntrySection">
                <AllowManualParticipantIDEntry intl={intl} config={vmpConfig} onValueChange={this.onValueChange}/>
              </div>
              <div className="section" data-testid="participantIDRegexSection">
                <ParticipantIDRegex intl={intl} config={vmpConfig} onValueChange={this.onValueChange}/>
              </div>
              <div className="section" data-testid="irisScoreSection">
                <IrisScore intl={intl} config={vmpConfig} onNumberValueChange={this.onNumberValueChange}/>
              </div>
              <div className="section" data-testid="addressFieldsSection">
                <AddressFields
                  intl={intl}
                  config={vmpConfig}
                  onValueChange={this.onValueChange}
                  countryOptions={countryOptions}
                />
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return} data-testid="cancelButton">
                    <FormattedMessage id="common.return"/>
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.save} disabled={loading} data-testid="saveButton">
                    <FormattedMessage id="common.save"/>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
                           apps,
                           settings,
                           cflPatient,
                           concept: {
                             concept: {setMembers: countries},
                             loading: {concept: loadingConcept}
                           }
                         }) => ({
  syncScopes: apps?.vmpSyncScopes ?? DEFAULT_SYNC_SCOPES,
  authSteps: apps?.vmpAuthSteps ?? DEFAULT_AUTH_STEPS,
  regimenUpdatePermitted: apps?.vmpRegimenUpdatePermitted ?? DEFAULT_REGIMEN_UPDATE_PERMITTED,
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  patientLinkedRegimens: cflPatient.patientLinkedRegimens,
  countryOptions: countries
    .sort((countryA, countryB) => countryA.display.localeCompare(countryB.display))
    .map(({display}) => ({label: display, value: display})),
  countryNames: countries.map(({display: fullySpecified, names}) => ({
    fullySpecified,
    short: names.find(({display}) => display !== fullySpecified)?.display
  })),
  loadingConcept
});

const mapDispatchToProps = {getSettingByQuery, updateSetting, createSetting, getPatientLinkedRegimens, getConcept};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(VmpConfig)));
