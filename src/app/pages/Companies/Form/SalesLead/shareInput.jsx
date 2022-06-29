import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    width: '100%',
  },
};
// const ownerList = [
//   { value: 'jing', label: 'jing',id:1 },
//   { value: 'wang', label: 'wang' ,id:2 },
//   { value: 'lin', label: 'lin' ,id:3 },
// ];

class ShareInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: null,
    };
  }

  changeOwner = (key, owner) => {
    this.setState({ owner: owner });
    this.props.changeOwner(key, owner);
  };
  hasError = (index) => {
    const { leadIndex, salesLeadError } = this.props;
    let arr = salesLeadError.filter((_item, _index) => {
      return (
        _item.salesLeadIndex === leadIndex &&
        _item.ownerIndex === index &&
        _item.errorMessage === true
      );
    });
    if (arr.length > 0) {
      return true;
    }
    return false;
  };
  render() {
    const {
      classes,
      label,
      owners,
      leadIndex,
      salesLeadError,
      errorMessage,
      isReduired,
    } = this.props;
    const { owner } = this.state;
    console.log(salesLeadError);
    return (
      <>
        <div>
          <div className="row expanded">
            <div
              className="small-6 columns"
              style={{ fontSize: '12px', padding: '0px' }}
            >
              {label} <span style={{ color: 'red' }}>*</span>
            </div>
            <div className="small-6 columns" style={{ textAlign: 'right' }}>
              <Button
                size="small"
                style={{ fontSize: '12px', padding: '0px' }}
                color="primary"
                onClick={() => {
                  this.props.addShare();
                }}
              >
                {this.props.t('tab:Add Share')}
              </Button>
            </div>
          </div>

          {owners.map((val, index) => {
            return (
              <div key={index}>
                <FormReactSelectContainer
                  errorMessage={
                    errorMessage &&
                    errorMessage.get('salesLeadOwner') &&
                    this.hasError(index)
                      ? errorMessage.get('salesLeadOwner')
                      : null
                  }
                >
                  <div className="row expanded">
                    <div
                      className={
                        owners.length === 1
                          ? 'small-12 columns'
                          : 'small-10 columns'
                      }
                      style={{ padding: '0px' }}
                    >
                      <Select
                        name="Sales Lead Owner"
                        value={owners[index].fullName}
                        onChange={(owner) => {
                          this.changeOwner(index, owner);
                        }}
                        selectedValue={owners[index]}
                        options={this.props.userList.toJS()}
                        valueKey={'fullName'}
                        labelKey={'fullName'}
                        autoBlur={true}
                        searchable={true}
                        clearable={false}
                      />
                    </div>
                    {owners.length > 1 ? (
                      <div className="small-2 columns">
                        <DeleteIcon
                          style={{
                            color: 'rgb(142, 142, 142)',
                            marginTop: '5px',
                          }}
                          onClick={() => {
                            this.props.deleteOwner(index);
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </FormReactSelectContainer>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(ShareInput));
