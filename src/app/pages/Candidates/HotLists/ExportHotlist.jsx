import React from 'react';
import { formatFullName } from '../../../../utils';
import { exportJson } from '../../../../utils/sheet';
import { asyncPool } from '../../../../utils/asyncPool';
import { getHotListTalentsByHotListId2 } from '../../../../apn-sdk';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import { CONTACT_TYPES } from '../../../constants/formOptions';
import { withTranslation } from 'react-i18next';
class ExportHotlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
    };
  }

  handleExport = () => {
    this.setState({ processing: true });
    const { hotlistIds, chinese } = this.props;
    asyncPool(3, hotlistIds.toArray(), (hotlistId) => {
      return getHotListTalentsByHotListId2(hotlistId)
        .then(({ response }) => {
          console.log(response);
          if (chinese) {
            response = response.filter((el) => el.talent.chinese === chinese);
          }
          return response;
        })
        .catch((err) => []);
    }).then((response) => {
      const talents = response.flat().map(({ talent, createdDate }) => {
        let { fullName, firstName, lastName, contacts, experiences } = talent;
        contacts = contacts
          ? contacts.sort((a, b) => {
              let aSort = a.sort || 100;
              let bSort = b.sort || 100;
              return aSort - bSort;
            })
          : [];
        const emailContact = contacts.find(
          (c) => c.type === CONTACT_TYPES.Email
        );
        const phoneContact = contacts.find(
          (c) => c.type === CONTACT_TYPES.Phone
        );

        let companies =
          experiences && experiences.map(({ company }, index) => company);
        let jobTitles =
          experiences && experiences.map(({ title }, index) => title);

        jobTitles = jobTitles ? Array.from(new Set(jobTitles)).join(', ') : '';
        companies = companies ? Array.from(new Set(companies)).join(', ') : '';
        return {
          Name:
            firstName && lastName
              ? formatFullName(firstName, lastName)
              : fullName,
          Email: emailContact && emailContact.contact,
          Phone: phoneContact && phoneContact.contact,
          Company: companies,
          'Job Title': jobTitles,
          'First Name': firstName || '',
          'Last Name': lastName || '',
          'Add to HotList Date': new Date(createdDate),
        };
      });
      exportJson(talents, {
        headers: [
          {
            name: 'Name',
            width: 40,
          },
          {
            name: 'Email',
            width: 40,
          },
          {
            name: 'Phone',
            width: 40,
          },
          {
            name: 'Job Title',
            width: 40,
          },
          {
            name: 'Company',
            width: 18,
          },
          {
            name: 'First Name',
            width: 18,
          },
          {
            name: 'Last Name',
            width: 18,
          },
          {
            name: 'Add to HotList Date',
            width: 18,
          },
        ],
        fileName: 'hotlist',
      });
      this.setState({ processing: false });
    });
  };

  render() {
    const { processing } = this.state;
    return (
      <>
        <PrimaryButton processing={processing} onClick={this.handleExport}>
          {this.props.t('action:Export')}
        </PrimaryButton>
      </>
    );
  }
}

export default withTranslation('action')(ExportHotlist);
