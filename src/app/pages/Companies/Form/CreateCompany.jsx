import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getPotentialServiceType } from '../../../actions/clientActions';
import { getProCompanyById } from '../../../../apn-sdk/client';
import { getTenantUserList } from '../../../selectors/userSelector';
import Immutable from 'immutable';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BasicInfo from './BasicInfo';
import Loading from '../../../components/particial/Loading';
import { replace } from 'connected-react-router';
import { showErrorMessage } from '../../../actions/index';
class CompanyCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      creating: false,
      treeList: null,
      logoUrl: '',
      companyInfo: null,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchProspectInfo();
  }

  fetchData() {
    this.props.dispatch(getPotentialServiceType());
  }

  fetchProspectInfo = () => {
    const { companyId } = this.props;
    if (companyId) {
      getProCompanyById(this.props.match.params.id, 1)
        .then((res) => {
          let obj = res.response;
          if (obj.additionalAddress.length === 0) {
            obj.additionalAddress = [
              {
                address: null,
                address2: null,
                addressType: 'COMPANY',
                city: null,
                cityId: null,
                companyAddressType: 'OTHER',
                companyId: null,
                country: null,
                language: null,
                province: null,
              },
            ];
          }
          this.setState({ companyInfo: obj });
        })
        .catch((err) => {
          if (err.status === 404) {
            this.props.dispatch(replace('/companies/nomatch'));
          } else {
            this.props.dispatch(showErrorMessage(err));
          }
        });
    } else {
      this.setState({
        companyInfo: {
          logo: '',
          name: null,
          industry: null,
          website: null,
          fortuneRank: null,
          sourceLink: null,
          primaryAddress: {
            address: '',
            address2: null,
            addressType: 'COMPANY',
            city: '',
            country: '',
            province: '',
            cityId: null,
            companyAddressType: 'PRIMARY',
            language: null,
          },
          additionalAddress: [
            {
              address: null,
              address2: null,
              addressType: 'COMPANY',
              cityId: null,
              companyAddressType: 'OTHER',
              language: null,
            },
          ],
          salesLead: [
            {
              accountProgress: 0,
              contacts: [{}],
              estimatedDealTime: null,
              leadSource: null,
              otherSource: null,
              owners: [{}],
              salesLeadStatus: 'UN_ASSIGN',
            },
          ],
          teamNumbers: [],
          businessRevenue: null,
          staffSizeType: null,
          linkedinCompanyProfile: '',
          crunchbaseCompanyProfile: '',
        },
      });
    }
  };

  _validateForm(form, t, erroFromServer = null) {
    let errorMessage = Immutable.Map();
    if (form.companyName && !form.companyName.value) {
      errorMessage = errorMessage.set(
        'companyName',
        t('message:companyNameIsRequired')
      );
    }
    // if (!form.potential.checked && !form.type.value) {
    //   errorMessage = errorMessage.set('type', t('message:levelIsRequired'));
    // }
    if (form.industry && !form.industry.value) {
      errorMessage = errorMessage.set(
        'industry',
        t('message:industryIsRequired')
      );
    }
    // if (!form.potential.checked && !form.accountManager.value) {
    //   errorMessage = errorMessage.set(
    //     'accountManager',
    //     t('message:accountManagerIsRequired')
    //   );
    // }
    // if (!form.bdManager.value) {
    //   errorMessage = errorMessage.set(
    //     'bdManager',
    //     t('message:prospectOwnerIsRequired')
    //   );
    // }

    if (form.companyWebsite && !form.companyWebsite.value) {
      errorMessage = errorMessage.set(
        'companyWebsite',
        t('message:companyWebsiteIsRequired')
      );
    }

    if (erroFromServer) {
      errorMessage = errorMessage.set('erroFromServer', erroFromServer);
    }
    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  render() {
    const { t, ...props } = this.props;
    console.log(this.props.userList.toJS());
    const { companyInfo } = this.state;
    if (!companyInfo) {
      return <Loading />;
    }
    return (
      <Paper style={{ padding: '10px' }}>
        {this.props.match.params.id ? (
          <Typography>{t('tab:Edit Prospect')}</Typography>
        ) : (
          <Typography>{t('tab:Create Prospect')}</Typography>
        )}
        <div style={{ padding: '20px' }}>
          <BasicInfo
            removeErrorMsgHandler={this.removeErrorMsgHandler}
            errorMessage={this.state.errorMessage}
            companyInfo={companyInfo}
            {...props}
          />
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  // console.log(match);
  const companyId = match.params.id || null;
  const authorities = state.controller.currentUser.get('authorities');
  return {
    companyId: companyId,
    userList: getTenantUserList(state),
    currentUser: state.controller.currentUser,
    isLimitUser:
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
};

export default withTranslation(['action', 'message', 'field', 'tab'])(
  connect(mapStateToProps)(CompanyCreation)
);
