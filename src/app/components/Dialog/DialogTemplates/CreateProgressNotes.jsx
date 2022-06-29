import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import FormTextArea from '../../particial/FormTextArea';
import moment from 'moment-timezone';
import FormInput from '../../particial/FormInput';
const styles = {
  root: {
    width: '475px',
    height: '400px',
    padding: '10px',
  },
};

class CreateProgressNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      type: '',
      date: '',
      time: '',
    };
  }

  setSelectDate = (date) => {
    return date < new Date();
  };

  render() {
    const { classes, contactList, t, contactTypeList, errorMessage } =
      this.props;
    return (
      <div className={classes.root}>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormReactSelectContainer
              label={t('tab:Name')}
              isRequired={true}
              errorMessage={
                errorMessage && errorMessage.get('name')
                  ? errorMessage.get('name')
                  : null
              }
            >
              <Select
                name="Name"
                value={this.state.name}
                onChange={(name) => {
                  this.setState({
                    name: name,
                  });
                  this.props.getName(name);
                  this.props.removeErrorMessage('name');
                }}
                options={contactList}
                valueKey={'id'}
                labelKey={'name'}
                autoBlur={true}
                searchable={true}
                clearable={false}
              />
            </FormReactSelectContainer>
          </div>
          <div className="small-12 columns">
            <FormReactSelectContainer
              label={t('field:Contact Category')}
              isRequired={true}
              errorMessage={
                errorMessage && errorMessage.get('contactCategory')
                  ? errorMessage.get('contactCategory')
                  : null
              }
            >
              <FormInput
                name="Category"
                value={
                  this.state.name && this.state.name.contactCategory
                    ? this.state.name.contactCategory !== 'OTHER'
                      ? this.state.name.contactCategory
                      : this.state.name.contactCategory +
                        ':' +
                        this.state.name.otherCategory
                    : ''
                }
                onChange={() => {
                  this.props.removeErrorMessage('contactCategory');
                }}
                disabled={true}
              />
            </FormReactSelectContainer>
          </div>
          <div className="small-12 columns">
            <FormReactSelectContainer
              label={t('tab:Contact Type')}
              isRequired={true}
              errorMessage={
                errorMessage && errorMessage.get('contactType')
                  ? errorMessage.get('contactType')
                  : null
              }
            >
              <Select
                name="contactType"
                value={this.state.type}
                onChange={(type) => {
                  this.setState({
                    type: type,
                  });
                  this.props.getContactType(type);
                  this.props.removeErrorMessage('contactType');
                }}
                options={contactTypeList}
                valueKey={'value'}
                labelKey={'label'}
                autoBlur={true}
                searchable={true}
                clearable={false}
              />
            </FormReactSelectContainer>
          </div>
        </div>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormReactSelectContainer
              label={t('field:Contact Date & Time')}
              isRequired={true}
              errorMessage={
                errorMessage && errorMessage.get('contactDate')
                  ? errorMessage.get('contactDate')
                  : null
              }
            >
              {/* <DatePicker
                            selected={this.state.date}
                            onChange={(date) => {
                                this.setState({
                                    date:date
                                })
                                this.props.setDate(date)}
                            }
                        /> */}
              <DatePicker
                selected={this.state.date}
                onChange={(date) => {
                  this.setState({
                    date: date,
                  });
                  this.props.setDate(date);
                  this.props.removeErrorMessage('contactDate');
                }}
                filterDate={this.setSelectDate}
                showTimeSelect
                timeFormat="HH:mm"
                // injectTimes={[
                //   setHours(setMinutes(new Date(), 1), 0),
                //   setHours(setMinutes(new Date(), 5), 12),
                //   setHours(setMinutes(new Date(), 59), 23)
                // ]}
                dateFormat="MM-DD-YYYY h:mm a"
              />
            </FormReactSelectContainer>
          </div>
          {/* <div className="small-6 columns" style={{paddingTop:'21px'}}>
                    <FormReactSelectContainer
                            label={''}
                        >
                        <DatePicker
                            selected={this.state.time}
                            onChange={(time) => {
                                this.setState({
                                    time:time
                                })
                                this.props.setTime(time)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm a"
                        />
                    </FormReactSelectContainer>
                    </div> */}
        </div>
        <div className="row expanded">
          <div className="small-12 columns">
            {/* <FormReactSelectContainer
                            label={t('field:Progress Note')}
                            isRequired={true}
                        > */}
            <FormTextArea
              name="notes"
              label={t('field:Progress Note')}
              defaultValue={''}
              onChange={(event) => {
                this.props.getNote(event.target.value);
              }}
              isRequired
              rows="3"
              onBlur={() => this.props.removeErrorMessage('note')}
              errorMessage={errorMessage.get('note')}
            />
            {/* </FormReactSelectContainer> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CreateProgressNotes);
