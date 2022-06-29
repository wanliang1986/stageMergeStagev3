import React from 'react';
import { connect } from 'react-redux';
import { getActiveTenantUserArray } from '../../../../selectors/userSelector';

import Select from 'react-select';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Info from '@material-ui/icons/Info';

import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';

class Ownerships extends React.Component {
  constructor(props) {
    super(props);
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    this.state = {
      createdBy: props.basicInfo.get('id')
        ? props.basicInfo.getIn(['createdUser', 'id'])
        : props.currentUser.get('id'),
      share: paserBasicInfo.ownerships
        ? paserBasicInfo.ownerships
            .filter((t) => t.ownershipType === 'SHARE')
            .map((s) => s.userId)
            .join(',')
        : '',
      flag: !paserBasicInfo.ownerships,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {
    this.setState({
      createdBy: this.props.basicInfo.get('id')
        ? this.props.basicInfo.getIn(['createdUser', 'id'])
        : this.props.currentUser.get('id'),
    });
  }

  render() {
    const { createdBy, share, flag } = this.state;
    const { t, userOptions } = this.props;
    return (
      <div style={{ minHeight: 104 }}>
        <div className="flex-container align-justify align-middle">
          <Typography variant="h6">{t('common:ownerships')}</Typography>
        </div>
        <div className="row">
          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:createdBy')}>
              <Select
                name="createdBy"
                value={createdBy}
                options={userOptions}
                valueKey={'id'}
                labelKey={'fullName'}
                disabled
              />
            </FormReactSelectContainer>
          </div>
          {flag && (
            <div className="small-6 columns" style={{ paddingTop: 25 }}>
              <div className="flex-container">
                <span
                  style={{ color: '#3398dc', cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({ flag: !flag });
                  }}
                >
                  {t('field:Add shares')}
                </span>
                &nbsp;
                <Tooltip title={t('message:shareDef')} arrow>
                  <Info fontSize="small" color="disabled" />
                </Tooltip>
              </div>
            </div>
          )}
          {!flag && (
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={
                  <div className="flex-container">
                    <span>{t('field:shares')}</span>
                  </div>
                }
              >
                <Select
                  value={share}
                  options={userOptions}
                  valueKey={'id'}
                  labelKey={'fullName'}
                  multi
                  onChange={(share) => {
                    this.setState({ share });
                  }}
                  placeholder={'select'}
                  simpleValue
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="share"
                value={share || ''}
                form="candidateBasic"
              />
            </div>
          )}
        </div>
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userOptions: getActiveTenantUserArray(state),
    currentUser: state.controller.currentUser,
  };
};

export default connect(mapStateToProps)(Ownerships);
