import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getPotentialServiceType } from '../../../actions/clientActions';
import { getProspectDetail } from '../../../../apn-sdk/client';
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

  setCompanyInfo = (company) => {
    console.log(company);
    let _salesLead = company.salesLeadDetails.map((item, index) => {
      return {
        accountProgress: item.accountProgress,
        contacts: item.salesLeadClientContacts,
        estimatedDealTime: item.estimatedDealTime,
        leadSource: item.leadSource,
        otherSource: item.otherSource,
        owners: item.salesLeadsOwner,
        salesLeadStatus: item.salesLeadStatus,
        serviceType: item.companyServiceTypes,
      };
    });
    let primary = company.companyAddresses.filter((item, index) => {
      return item.companyAddressType === 'PRIMARY';
    });
    let _primaryAddress = primary.map((item, index) => {
      return {
        address: item.address,
        address2: item.address2,
        addressType: item.companyAddressType,
        city: item.geoInfoEN.city,
        country: item.geoInfoEN.country,
        province: item.geoInfoEN.province,
        cityId: item.geoInfoEN.cityId,
        companyAddressType: item.companyAddressType,
        similarity: 'city',
      };
    });
    let additional = company.companyAddresses.filter((item, index) => {
      return item.companyAddressType === 'OTHER';
    });
    let _additionalAddress = additional.map((item, index) => {
      return {
        address: item.address,
        address2: item.address2,
        addressType: item.companyAddressType,
        city: item.geoInfoEN.city,
        country: item.geoInfoEN.country,
        province: item.geoInfoEN.province,
        cityId: item.geoInfoEN.cityId,
        companyAddressType: item.companyAddressType,
        similarity: 'city',
      };
    });
    let companyInfo = {
      logo: company.logo,
      name: company.name,
      industry: company.industry,
      website: company.website,
      fortuneRank: company.fortuneRank,
      sourceLink: company.sourceLink,
      primaryAddress: _primaryAddress[0],
      additionalAddress: _additionalAddress,
      salesLead: _salesLead,
      teamNumbers: company.companyAssignTeamMembers,
      businessRevenue: company.businessRevenue,
      staffSizeType: company.staffSizeType,
      linkedinCompanyProfile: company.linkedinCompanyProfile,
      crunchbaseCompanyProfile: company.crunchbaseCompanyProfile,
    };
    return companyInfo;
  };

  fetchProspectInfo = () => {
    const { companyId } = this.props;
    if (companyId) {
      getProspectDetail(this.props.match.params.id, 1)
        .then((res) => {
          console.log(res);
          let _companyInfo = this.setCompanyInfo(res.response);
          console.log(_companyInfo);
          this.setState({ companyInfo: _companyInfo });
        })
        .catch((err) => {
          if (err.status === 404) {
            this.props.dispatch(replace('/companies/nomatch'));
          } else {
            this.props.dispatch(showErrorMessage(err));
          }
        });
    } else {
      // companyInfo = {
      //   logo:null,
      //   name:null,
      //   industry:null,
      //   website:null,
      //   fortuneRank:null,
      //   sourceLink:null,
      //   businessRevenue:null,
      //   staffSizeType:null,
      //   linkedinCompanyProfile:null,
      //   crunchbaseCompanyProfile:null,
      //   salesLeadDetails:[
      //     {
      //       accountProgress: 0,
      //       salesLeadClientContacts: [{}],
      //       estimatedDealTime: null,
      //       leadSource: null,
      //       otherSource: null,
      //       salesLeadsOwner: [{}],
      //       salesLeadStatus: 'UN_ASSIGN',
      //       companyServiceTypes:[]
      //     },
      //   ],
      //   companyAssignTeamMembers:[],
      //   companyAddresses:[{
      //     address:null,
      //     companyAddressType:"",
      //     geoInfoEN:{
      //       cityId:"",
      //     }
      //   }]
      // }
      this.setState({
        companyInfo: {
          logo: null,
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
              salesLeadStatus: 'PROSPECT',
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
          <Typography>Edit Prospect</Typography>
        ) : (
          <Typography>Create Prospect</Typography>
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

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStateToProps)(CompanyCreation)
);
