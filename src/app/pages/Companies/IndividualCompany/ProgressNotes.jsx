import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import NotesCard from './NotesCard';
import MyDialog from '../../../components/Dialog/myDialog';
import CreateProgressNotes from '../../../components/Dialog/DialogTemplates/CreateProgressNotes';
import {
  getAllProgressNotesByCompanyId,
  getClientContactByCompanyId,
  postProgressNotes,
} from '../../../actions/clientActions';
import Immutable from 'immutable';
import moment from 'moment-timezone';
const styles = {
  root: {
    width: '100%',
  },
  notesCard: {
    width: '800px',
    padding: '10px',
  },
};
const contactTypeList = [
  { value: 'AD Call', label: 'AD Call' },
  { value: 'Client Visit', label: 'Client Visit' },
  { value: 'Skill Marketing/MPC', label: 'Skill Marketing/MPC' },
  { value: 'Follow up Call/Email', label: 'Follow up Call/Email' },
  { value: 'Reference Call', label: 'Reference Call' },
  { value: 'Networking Conference', label: 'Networking Conference' },
  { value: 'Proposal/Presentation', label: 'Proposal/Presentation' },
  { value: 'Procurement', label: 'Procurement' },
];

class ProgressNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: null,
      openDialog: false,
      companyId: props.company.get('id'),
      contactId: '',
      companyNodes: null,
      contact: '',
      contactCategory: null,
      clientContactId: null,
      contactName: null,
      contactType: null,
      note: null,
      contactDate: null,
      otherCategory: null,
      creating: false,
      errorMessage: Immutable.Map(),
    };
  }

  componentDidMount() {
    this.fetchData(this.state.companyId, this.state.contactId);
    this.props
      .dispatch(getClientContactByCompanyId(this.state.companyId))
      .then((res) => {
        if (res.response.length > 0) {
          this.setState({
            contactList: res.response,
          });
        }
      });
  }
  fetchData = (id, contactId) => {
    this.props
      .dispatch(getAllProgressNotesByCompanyId(id, contactId))
      .then((res) => {
        if (res.response) {
          this.setState({
            companyNodes: res.response,
          });
        }
      });
  };
  selectClientContact = (name) => {
    if (name) {
      this.setState({
        contact: name.name,
      });
      this.fetchData(this.state.companyId, name.id);
    } else {
      this.setState({
        contact: null,
      });
      this.fetchData(this.state.companyId, '');
    }
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();

    if (!form.contactName) {
      errorMessage = errorMessage.set('name', t('message:Name Is Invalid'));
    }
    if (!form.contactCategory) {
      errorMessage = errorMessage.set(
        'contactCategory',
        t('message:Contact Category Is Invalid')
      );
    }
    if (!form.contactType) {
      errorMessage = errorMessage.set(
        'contactType',
        t('message:Contact Type Is Invalid')
      );
    }
    if (!form.contactDate) {
      errorMessage = errorMessage.set(
        'contactDate',
        t('message:Contact Date Is Invalid')
      );
    }
    if (!form.note) {
      errorMessage = errorMessage.set('note', t('message:Note Is Invalid'));
    }
    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  primary = () => {
    let progressNoteDTO = {
      clientContactId: this.state.clientContactId,
      contactCategory: this.state.contactCategory,
      contactName: this.state.contactName,
      contactType: this.state.contactType,
      contactDate: this.state.contactDate,
      note: this.state.note,
      otherCategory: this.state.otherCategory,
    };
    const { t } = this.props;
    let errorMessage = this._validateForm(progressNoteDTO, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ creating: true });
    this.props
      .dispatch(postProgressNotes(this.state.companyId, progressNoteDTO))
      .then((res) => {
        this.setState({
          openDialog: false,
          creating: false,
          clientContactId: null,
          contactCategory: null,
          contactName: null,
          contactType: null,
          contactDate: null,
          note: null,
          otherCategory: null,
        });
        this.fetchData(this.state.companyId, this.state.contactId);
      });
  };
  getName = (name) => {
    this.setState({
      clientContactId: name.id,
      contactName: name.name,
      contactCategory: name.contactCategory,
      otherCategory: name.otherCategory,
    });
  };

  getContactType = (type) => {
    this.setState({
      contactType: type.value,
    });
  };
  setDate = (date) => {
    let t = date.toJSON();
    this.setState({
      contactDate: t,
    });
  };
  getNote = (note) => {
    this.setState({
      note: note,
    });
  };
  render() {
    const { classes, t, company } = this.props;
    const { contactList, openDialog, companyNodes, creating, errorMessage } =
      this.state;

    return (
      <div className={classes.root}>
        <div className="row expanded" style={{ padding: '10px' }}>
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                this.setState({ openDialog: true });
              }}
            >
              {t('tab:Create BD Progress Notes')}
            </Button>
          </div>
          <div className="small-2 columns" style={{ marginLeft: '20px' }}>
            <Select
              name="contact"
              onChange={(name) => {
                this.selectClientContact(name);
              }}
              placeholder={t('tab:Select Client Contact')}
              value={this.state.contact}
              options={contactList}
              valueKey={'name'}
              labelKey={'name'}
              autoBlur={true}
              searchable={true}
              clearable={true}
            />
            <input name="contact" type="hidden" value={this.state.contact} />
          </div>
        </div>
        <Divider />
        <div className={classes.notesCard}>
          <NotesCard companyNodes={companyNodes} />
        </div>
        <MyDialog
          btnShow={true}
          show={openDialog}
          creating={creating}
          modalTitle={t('tab:Create BD Progress Notes')}
          SubmitBtnShow={true}
          SubmitBtnMsg={t('tab:Create')}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={true}
          CancelBtnMsg={t('tab:Cancel')}
          CancelBtnVariant={''}
          primary={() => {
            this.primary();
          }}
          handleClose={() => {
            this.setState({
              openDialog: false,
              clientContactId: null,
              contactCategory: null,
              contactName: null,
              contactType: null,
              contactDate: null,
              note: null,
              otherCategory: null,
              errorMessage: errorMessage.clear(),
            });
          }}
        >
          <CreateProgressNotes
            contactList={contactList}
            contactTypeList={contactTypeList}
            errorMessage={errorMessage}
            removeErrorMessage={this.removeErrorMessage}
            getName={(name) => {
              this.getName(name);
            }}
            getContactType={(type) => {
              this.getContactType(type);
            }}
            getNote={(note) => {
              this.getNote(note);
            }}
            setDate={(date) => {
              this.setDate(date);
            }}
            t={t}
          />
        </MyDialog>
      </div>
    );
  }
}

export default withStyles(styles)(ProgressNotes);
