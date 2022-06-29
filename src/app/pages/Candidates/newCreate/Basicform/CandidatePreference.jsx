import React from 'react';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { currency, payRateUnitTypes } from '../../../../constants/formOptions';
import { isNum } from '../../../../../utils/search';

import Select from 'react-select';
import Divider from '@material-ui/core/Divider';

import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../components/particial/FormInput';
// import Location from '../../../../components/jobLocation';
import Location from '../../../../components/particial/Location';

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: 10,
  },
};

class CandidatePreference extends React.Component {
  constructor(props) {
    super(props);
    const basicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    this.state = {
      candidateFlag:
        basicInfo.preferredLocations ||
        (basicInfo.additionalInfo &&
          basicInfo.additionalInfo.preferredSalaryRange) ||
        false,
      preferredPayType:
        (basicInfo.additionalInfo &&
          basicInfo.additionalInfo.preferredPayType) ||
        'YEARLY',
      preferredCurrency:
        (basicInfo.additionalInfo &&
          basicInfo.additionalInfo.preferredCurrency) ||
        'USD',
      preferredLocations: basicInfo.preferredLocations || [{ id: Date.now() }],
      preferredSalaryRange: (basicInfo.additionalInfo &&
        basicInfo.additionalInfo.preferredSalaryRange) || {
        gte: null,
        lte: null,
      },
    };
  }

  addCandidate = () => {
    this.setState({
      candidateFlag: true,
    });
  };

  deleteCandidate = () => {
    this.setState({
      candidateFlag: false,
      preferredLocations: [{ id: Date.now() }],
      preferredPayType: 'YEARLY',
      preferredCurrency: 'USD',
      preferredSalaryRange: { gte: null, lte: null },
    });
  };

  addLocationList = () => {
    this.setState({
      preferredLocations: this.state.preferredLocations.concat([
        { id: Date.now() },
      ]),
    });
  };

  deleteSingleLocation = (index2) => {
    this.setState({
      preferredLocations: this.state.preferredLocations.filter(
        (_, index) => index !== index2
      ),
    });
  };

  getSingleLocation = (data, index) => {
    const newList = this.state.preferredLocations.slice();
    data.id = newList[index].id;
    newList[index] = data;
    this.setState({ preferredLocations: newList });
  };

  changeMinNum = (event) => {
    let number = isNum(event.target.value, 9);
    let rangeTwo = { ...this.state.preferredSalaryRange };
    rangeTwo.gte = number ? number * 1 : null;
    this.setState({
      preferredSalaryRange: rangeTwo,
    });
  };

  changeMaxNum = (event) => {
    let number = isNum(event.target.value, 9);
    let rangeTwo = { ...this.state.preferredSalaryRange };
    rangeTwo.lte = number ? number * 1 : null;
    this.setState({
      preferredSalaryRange: rangeTwo,
    });
  };

  render() {
    const { t, classes, removeErrorMessage, errorMessage } = this.props;
    const {
      candidateFlag,
      preferredPayType,
      preferredCurrency,
      preferredLocations,
      preferredSalaryRange,
    } = this.state;
    return (
      <div>
        <div className="flex-container align-justify align-middle">
          <Typography variant="h6">{'Candidate Preference'}</Typography>
          {candidateFlag ? (
            <div className={classes.flex} onClick={this.deleteCandidate}>
              <DeleteOutlineIcon
                style={{ color: '#e85919', fontSize: '21px' }}
              />
              <p style={{ color: '#e85919', marginTop: 0 }}>{'Delete'}</p>
            </div>
          ) : (
            <div className={classes.flex} onClick={this.addCandidate}>
              <AddIcon style={{ color: '#3398dc', fontSize: '21px' }} />
              <p style={{ color: '#3398dc', marginTop: 0 }}>{'Add'}</p>
            </div>
          )}
        </div>
        {candidateFlag ? (
          <>
            <div className="row small-12 expanded" style={{ marginTop: 15 }}>
              <div className="small-6 row">
                <div className="columns">
                  <FormReactSelectContainer
                    label={t('field:Preferred Salary Range')}
                  >
                    <Select
                      labelKey={'label2'}
                      options={currency}
                      value={preferredCurrency}
                      onChange={(preferredCurrency) =>
                        preferredCurrency &&
                        this.setState({ preferredCurrency })
                      }
                      simpleValue
                      noResultsText={''}
                      autoBlur={true}
                      clearable={false}
                      openOnFocus={true}
                    />
                  </FormReactSelectContainer>
                </div>
                <div className="columns">
                  <FormReactSelectContainer label="&nbsp;">
                    <Select
                      value={preferredPayType}
                      onChange={(preferredPayType) =>
                        preferredPayType && this.setState({ preferredPayType })
                      }
                      simpleValue
                      options={payRateUnitTypes}
                      autoBlur={true}
                      searchable={false}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
              <div className="small-6 row">
                <div className="columns">
                  <FormInput
                    name="minRange"
                    label="&nbsp;"
                    value={preferredSalaryRange.gte}
                    onChange={this.changeMinNum}
                    placeholder={'Min'}
                    errorMessage={errorMessage.get('candidateRange')}
                    onBlur={() => removeErrorMessage('candidateRange')}
                  />
                </div>
                <div className="columns">
                  <FormInput
                    name="maxRange"
                    label="&nbsp;"
                    value={preferredSalaryRange.lte}
                    onChange={this.changeMaxNum}
                    placeholder={'Max'}
                    errorMessage={errorMessage.get('candidateRange')}
                    onBlur={() => removeErrorMessage('candidateRange')}
                  />
                </div>
              </div>
            </div>
            <div className="row small-12 expanded">
              <span style={{ fontSize: 12, marginLeft: 6 }}>
                {t('field:Preferred Locations')}
              </span>
              {preferredLocations.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="row small-12 expanded"
                    style={{ marginTop: 3 }}
                  >
                    <div className="small-11 columns">
                      <Location
                        handleChange={(data) => {
                          this.getSingleLocation(data, index);
                        }}
                        value={item}
                        placeholder={' '}
                      />
                    </div>
                    <div className="small-1 columns">
                      {index === 0 ? (
                        preferredLocations.length > 1 ? (
                          <div style={{ display: 'flex' }}>
                            <AddCircleIcon
                              style={{ marginTop: 4, cursor: 'pointer' }}
                              onClick={() => {
                                this.addLocationList();
                              }}
                            />
                            <DeleteIcon
                              style={{ marginTop: 4, cursor: 'pointer' }}
                              onClick={() => {
                                this.deleteSingleLocation(index);
                              }}
                            />
                          </div>
                        ) : (
                          <AddCircleIcon
                            style={{ marginTop: 4, cursor: 'pointer' }}
                            onClick={() => {
                              this.addLocationList();
                            }}
                          />
                        )
                      ) : (
                        <DeleteIcon
                          style={{ marginTop: 4, cursor: 'pointer' }}
                          onClick={() => {
                            this.deleteSingleLocation(index);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <input
              type="hidden"
              name="preferredCurrency"
              value={preferredCurrency}
              form="candidateBasic"
            />
            <input
              type="hidden"
              name="preferredPayType"
              value={preferredPayType}
              form="candidateBasic"
            />
            <input
              type="hidden"
              name="preferredSalaryRange"
              value={JSON.stringify(preferredSalaryRange)}
              form="candidateBasic"
            />
            <input
              type="hidden"
              name="preferredLocations"
              value={JSON.stringify(preferredLocations)}
              form="candidateBasic"
            />
          </>
        ) : null}

        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </div>
    );
  }
}

export default connect()(withStyles(styles)(CandidatePreference));
