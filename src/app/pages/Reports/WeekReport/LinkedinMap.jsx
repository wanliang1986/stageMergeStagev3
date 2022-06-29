import React from 'react';
import { exportJson } from '../../../../utils/sheet';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import dateFns from 'date-fns';

class LinkedinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // seats: data.data.elements.map((e) => {
      //   const seat =
      //     e.pivot.value['com.linkedin.talent.reporting.wrapper.SeatUrnWrapper']
      //       .seatResolutionResult;
      //
      //   return {
      //     entityUrn: seat.entityUrn,
      //     profile: seat.profileResolutionResult,
      //   };
      // }),
    };
  }

  componentDidMount() {
    recruiterUsage(
      dateFns.addMonths(dateFns.startOfToday(), -3),
      dateFns.endOfToday()
    ).then((data) => {
      this.setState({
        seats: data.data.elements.map((e) => {
          const seat =
            e.pivot.value[
              'com.linkedin.talent.reporting.wrapper.SeatUrnWrapper'
            ].seatResolutionResult;

          return {
            entityUrn: seat.entityUrn,
            profile: seat.profileResolutionResult,
          };
        }),
      });
    });
  }

  handleExport = () => {
    const data = this.state.seats
      .map((s) => {
        return {
          'First Name': s.profile['firstName'],
          'Last Name': s.profile['lastName'],
          Linkedin: s.profile['publicProfileUrl'],
          LinkedinTalentSource: s.profile['entityUrn'],
          Headline: s.profile['headline'],
          Seat: s.entityUrn,
          'APN Name': '',
          'APN ID': '',
        };
      })
      .filter((e) => e.Linkedin);
    console.log(data);
    exportJson(data, {
      headers: [
        {
          name: 'First Name',
          width: 20,
        },
        {
          name: 'Last Name',
          width: 20,
        },
        {
          name: 'APN Name',
          width: 30,
        },
        {
          name: 'APN ID',
          width: 18,
        },
        {
          name: 'Linkedin',
          width: 40,
        },
        {
          name: 'LinkedinTalentSource',
          width: 40,
        },
        {
          name: 'Headline',
          width: 40,
        },
        {
          name: 'Seat',
          width: 18,
        },
      ],
      fileName: 'LinkedinMapping',
    });
  };

  render() {
    const { seats } = this.state;
    return (
      <div>
        <PrimaryButton onClick={this.handleExport}>export</PrimaryButton>
        {JSON.stringify(seats)}
      </div>
    );
  }
}

export default LinkedinMap;
const url = 'https://api-staging.hitalentech.com/proSearch3/api';

function recruiterUsage(from, to) {
  return fetch(url + '/linkedin/recruiterReport', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
    }),
  }).then((response) => {
    return response.ok && response.json();
  });
}
