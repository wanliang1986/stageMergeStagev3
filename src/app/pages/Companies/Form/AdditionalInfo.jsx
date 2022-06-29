import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../components/particial/FormInput';
import FormTextArea from '../../../components/particial/FormTextArea';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { staffSize, businessRevenue } from '../../../constants/formOptions';
import { truncate } from 'lodash';

const fortuneRankingList = [
  { value: 'FORTUNE_1000', label: 'FORTUNE_1000' },
  { value: 'FORTUNE_500', label: 'FORTUNE_500' },
];

class AdditionalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationName:
        (props.companyInfo.organizationName &&
          props.companyInfo.organizationName) ||
        '',
      website: props.companyInfo.website || '',
      size: props.companyInfo.staffSizeType || null,
      founded:
        (props.companyInfo.founded && moment(props.companyInfo.founded)) ||
        null,
      email: props.companyInfo.email || '',
      phone: props.companyInfo.phone || '',
      fax: props.companyInfo.fax || '',
      bdManager:
        (props.companyInfo.bdManager && props.companyInfo.bdManager.id) || '',
      business: props.companyInfo.businessRevenue || null,
      fortuneRank: props.companyInfo.fortuneRank || null,
      crunchbaseCompanyProfile:
        props.companyInfo.crunchbaseCompanyProfile || null,
      linkedinCompanyProfile: props.companyInfo.linkedinCompanyProfile || null,
      note: props.companyInfo.description || null,
      sourceLink: props.companyInfo.sourceLink || null,
    };
  }

  inputChangeHandler = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  };

  render() {
    const {
      t,
      companyBriefList,
      userList,
      errorMessage,
      removeErrorMsgHandler,
    } = this.props;
    // const { showPrimaryAdd, showBillingAdd, showOtherAdd } = this.state;
    return (
      <section style={{ margin: '0 -0.25rem' }}>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:StaffSize')}>
              <Select
                name="staffSize"
                value={this.state.size}
                onChange={(size) => this.setState({ size })}
                simpleValue
                options={staffSize}
                searchable={false}
                clearable={false}
                autoBlur={true}
              />
            </FormReactSelectContainer>
            <input name="size" type="hidden" value={this.state.size} />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:BusinessRevenue')}>
              <Select
                value={this.state.business}
                onChange={(business) => {
                  this.setState({ business: business.value });
                }}
                options={businessRevenue}
                valueKey={'value'}
                labelKey={'label'}
                autoBlur={true}
                searchable={true}
              />
            </FormReactSelectContainer>
            <input
              name="businessRevenue"
              type="hidden"
              value={this.state.business}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:organizationName')}>
              <FormInput
                name="organizationNameSelect"
                value={this.state.organizationName}
                onChange={(e) => {
                  this.props.setOrganization(e.target.value);
                  this.setState({ organizationName: e.target.value });
                }}
              />
            </FormReactSelectContainer>
            <input
              name="organizationName"
              type="hidden"
              value={this.state.organizationName}
            />
          </div>

          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:Fortune Ranking')}>
              <Select
                value={this.state.fortuneRank}
                onChange={(fortuneRanking) => {
                  if (fortuneRanking) {
                    this.setState({
                      fortuneRank: fortuneRanking.value,
                    });
                  } else {
                    this.setState({
                      fortuneRank: fortuneRanking,
                      sourceLink: null,
                    });
                  }
                  this.props.setfortuneRank(fortuneRanking);
                }}
                options={fortuneRankingList}
                valueKey={'value'}
                labelKey={'label'}
                autoBlur={true}
                searchable={true}
              />
            </FormReactSelectContainer>
            <input
              name="fortuneRanking"
              type="hidden"
              value={this.state.fortuneRank}
            />
            {/* 财富排名不为空时，显示该信息来源input */}
            {this.state.fortuneRank ? (
              <FormInput
                name="sourceLink"
                value={this.state.sourceLink}
                onChange={(e) => {
                  removeErrorMsgHandler('sourceLink');
                  this.setState({ sourceLink: e.target.value });
                }}
                placeholder={`Please provide a source link`}
                errorMessage={
                  errorMessage && errorMessage.get('sourceLink')
                    ? errorMessage.get('sourceLink')
                    : null
                }
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              name="linkedInCompanyProfile"
              label={t('field:LinkedIn Company Profile')}
              defaultValue={this.state.linkedinCompanyProfile}
              onChange={this.inputChangeHandler}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="crunchbaseCompanyProfile"
              label={t('field:Crunchbase Company Profile')}
              value={this.state.crunchbaseCompanyProfile}
              onChange={this.inputChangeHandler}
            />
          </div>
        </div>

        <div className="row expanded" style={{ marginBottom: '6px' }}>
          <div className="small-12 columns">
            <FormTextArea
              name="note"
              label={t('field:note')}
              value={this.state.note}
              onChange={this.inputChangeHandler}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(['action', 'message', 'field'])(AdditionalInfo);

// toggleshowPrimaryAdd = () => {
//     this.setState({ showPrimaryAdd: !this.state.showPrimaryAdd });
// };

// toggleshowBillingAdd = () => {
//     this.setState({ showBillingAdd: !this.state.showBillingAdd });
// };

// toggleshowOtherAdd = () => {
//     this.setState({ showOtherAdd: !this.state.showOtherAdd });
// };

// <Divider />
//                 <section style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography variant="body1" style={{ margin: '10px 0' }}>
//                         Primary Address
//                         </Typography>
//                     <IconButton onClick={this.toggleshowPrimaryAdd}>
//                         {!showPrimaryAdd ? <ArrowDown /> : <ArrowUp />}

//                     </IconButton>
//                 </section>
//                 {showPrimaryAdd ? <AddressGroup {...this.props} /> : null}
//                 <Divider />

//                 <section style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography variant="body1" style={{ margin: '10px 0' }}>
//                         Billing Address
//                         </Typography>
//                     <IconButton onClick={this.toggleshowBillingAdd}>
//                         {!showBillingAdd ? <ArrowDown /> : <ArrowUp />}

//                     </IconButton>
//                 </section>
//                 {showBillingAdd ? <AddressGroup {...this.props} /> : null}
//                 <Divider />

//                 <section style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography variant="body1" style={{ margin: '10px 0' }}>
//                         Other Addresses
//                         </Typography>
//                     <IconButton onClick={this.toggleshowOtherAdd}>
//                         {!showOtherAdd ? <ArrowDown /> : <ArrowUp />}

//                     </IconButton>
//                 </section>
//                 {showOtherAdd ? <AddressGroup {...this.props} /> : null}
//                 <Divider />
