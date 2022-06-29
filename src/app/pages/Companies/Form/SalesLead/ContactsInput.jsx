import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../components/particial/FormInput';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    width: '100%',
  },
};
// 校验名字是否含有中文
function sortingName(ChineseName, EnglishName) {
  let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  if (reg.test(ChineseName) || reg.test(EnglishName)) {
    return EnglishName + ChineseName || '';
  } else {
    if (ChineseName && EnglishName) {
      let tmp =
        EnglishName.substring(0, 1).toUpperCase() + EnglishName.substring(1);
      let chaTmp =
        ChineseName.substring(0, 1).toUpperCase() + ChineseName.substring(1);
      return chaTmp + ' ' + tmp;
    } else {
      return '';
    }
  }
}

class ContactsInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: '',
    };
  }

  hasError = (index) => {
    const { leadIndex, contactsError } = this.props;
    let arr = contactsError.filter((_item, _index) => {
      return _item.salesLeadIndex === leadIndex && _item.contactIndex === index;
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
      contactList,
      isReduired,
      itemIndex,
      companyId,
      contacts,
      errorMessage,
      contactsError,
      leadIndex,
    } = this.props;
    const { owner } = this.state;
    console.log(contacts);
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
                  this.props.addContact();
                }}
              >
                {this.props.t('tab:Add Contact')}
              </Button>
            </div>
          </div>
          {contactList.map((val, key) => {
            return (
              <div key={key}>
                <FormReactSelectContainer
                  errorMessage={
                    errorMessage &&
                    errorMessage.get('contacts') &&
                    this.hasError(key)
                      ? errorMessage.get('contacts')
                      : null
                  }
                >
                  <div className="row expanded">
                    <div
                      className={
                        contactList.length === 1 && !contactList[0].name
                          ? 'small-12 columns'
                          : 'small-10 columns'
                      }
                      style={{ padding: '0px' }}
                    >
                      {companyId ? (
                        <Select
                          name="contacts"
                          value={sortingName(val.firstName, val.lastName)}
                          onChange={(name) => {
                            this.props.setContact(name, key);
                          }}
                          // simpleValue
                          valueKey={'name'}
                          labelKey={'name'}
                          options={contacts}
                          searchable
                          clearable={false}
                          autoBlur={true}
                        />
                      ) : (
                        <FormInput
                          name="contact"
                          defaultValue={
                            sortingName(val.firstName, val.lastName)
                            // val.firstName + val.lastName || ''
                          }
                          disabled={true}
                          errorMessage={
                            errorMessage &&
                            errorMessage.get('contacts') &&
                            this.hasError(key)
                          }
                        />
                      )}
                    </div>
                    {contactList.length > 1 || contactList[0].name ? (
                      <div className="small-2 columns">
                        <DeleteIcon
                          style={{
                            color: 'rgb(142, 142, 142)',
                            marginTop: '5px',
                          }}
                          onClick={() => {
                            this.props.deleteContact(key);
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

export default withTranslation('tab')(withStyles(styles)(ContactsInput));
