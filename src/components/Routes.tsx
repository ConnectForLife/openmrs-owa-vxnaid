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
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Breadcrumbs from './common/Breadcrumbs';
import _ from 'lodash';
import Header from './common/Header';
import ErrorBoundary from './common/ErrorBoundary';
import { connect } from 'react-redux';
import Unauthorized from './common/Unauthorized';
import { Spinner } from 'reactstrap';
import Customize from '../components/customize/customize';
import { routeConfig } from '../shared/constants/routes';

export interface IRoutesProps extends StateProps, DispatchProps {}

class Routes extends React.Component<IRoutesProps> {
  renderComponent = route => {
    const { authenticated, privileges, loading } = this.props;
    if (route.requiredPrivilege) {
      if (loading) {
        return <Spinner />;
      } else if (!authenticated || !privileges.includes(route.requiredPrivilege)) {
        return <Unauthorized />;
      } else {
        // Do nothing
      }
    }
    const Component = route.component;
    return <Component {...this.props} />;
  };

  render = () => (
    <Router>
      <Customize />
      <Header />
      <div className="content">
        <Breadcrumbs />
        <ErrorBoundary>
          <Switch>
            {_.map(routeConfig, route => (
              <Route path={route.path} key={route.path}>
                {this.renderComponent(route)}
              </Route>
            ))}
          </Switch>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

const mapStateToProps = ({ session }) => ({
  authenticated: session.authenticated,
  loading: session.loading,
  privileges: session.privileges
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
