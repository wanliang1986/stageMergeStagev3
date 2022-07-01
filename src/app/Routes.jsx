import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/Account/ForgotPassword';
import Settings from './components/Account/Settings';
import TenantAdmin from './pages/TenantAdmin/index';
import Register from './components/Account/Register';
import ResetPassword from './components/Account/ResetPassword';
import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Loading from './components/particial/Loading';
// import PDFEditor from './pages/PDFEditor/AddLogo';

const AsyncCandidates = lazy(() => import('./pages/Candidates'));
const AsyncJobs = lazy(() => import('./pages/Jobs'));
const AsyncTenants = lazy(() => import('./pages/Tenants'));
const AsyncDashboard = lazy(() => import('./pages/Dashboard'));
const AsyncReports = lazy(() => import('./pages/Reports'));
const AsyncTemplates = lazy(() => import('./pages/Templates'));
const AsyncGlobalSearch = lazy(() => import('./pages/GlobalSearch'));
const AsyncFinance = lazy(() => import('./pages/Finance'));
const AsyncCompany = lazy(() => import('./pages/Companies'));
const AsyncEmailBlast = lazy(() => import('./pages/EmailBlast'));
const AsyncPDFEditor = lazy(() => import('./pages/PDFEditor/AddLogo'));

const styles = {
  container: {
    overflow: 'auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
};

function Routes({ classes }) {
  return (
    <div className={classes.container}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PrivateRoute exact path="/" component={AsyncCompany} />
          {/* <PrivateRoute exact path="/dashboard" component={AsyncDashboard} /> */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/forget-password" component={ResetPassword} />
          <PrivateRoute path="/addLogo" component={AsyncPDFEditor} />
          <PrivateRoute path="/candidates" component={AsyncCandidates} />
          <PrivateRoute path="/jobs" component={AsyncJobs} />
          {/*<PrivateRoute path="/hotlists" component={AsyncHotLists} />*/}
          {/* <PrivateRoute path="/emailblast" component={AsyncEmailBlast} /> */}
          {/* <PrivateRoute path="/reports" component={AsyncReports} /> */}
          {/* <PrivateRoute path="/templates" component={AsyncTemplates} /> */}
          {/* <PrivateRoute path="/settings" component={Settings} /> */}
          <PrivateRoute path="/tenantAdminPortal" component={TenantAdmin} />
          <PrivateRoute path="/myteam" component={AsyncTenants} />
          {/* <PrivateRoute path="/finance" component={AsyncFinance} /> */}
          {/* <PrivateRoute path="/search" component={AsyncGlobalSearch} /> */}
          <PrivateRoute path="/companies" component={AsyncCompany} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default withStyles(styles)(Routes);
