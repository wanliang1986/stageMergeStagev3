import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Pannel from '../../components/particial/Pannel';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Immutable from 'immutable';

const reportCategoriesMap = {
  admin: [
    {
      title: 'tab:Job Analytics',
      ab: 'J',
      defaultExpanded: true,
      reports: [
        {
          value: 1,
          label: 'tab:Job Analytics by Company',
        },
        {
          value: 2,
          label: 'tab:Job Analytics by User(AM)',
        },
        {
          value: 4,
          label: 'tab:Job Analytics Details',
        },
      ],
    },
    {
      title: 'tab:Pipeline Analytics',
      ab: 'P',
      defaultExpanded: true,
      reports: [
        {
          value: 7,
          label: 'tab:Pipeline Analytics by Users',
        },
        {
          value: 8,
          label: 'tab:Pipeline Analytics by Company',
        },
        {
          value: 17,
          label: 'tab:Pipeline Analytics per Submittal Perspective',
        },
        {
          value: 9,
          label: 'tab:Pipeline Analytics Details',
        },
      ],
    },

    {
      title: 'tab:Analytics Graph',
      ab: 'G',
      defaultExpanded: true,
      reports: [
        {
          value: 12,
          label: 'tab:Job Chart',
        },
        {
          value: 36,
          label: 'tab:Pipeline Analytics by Submitted Date',
        },
        {
          value: 37,
          label: 'tab:User Activities',
        },
        {
          value: 38,
          label: 'tab:Pipeline Analytics by Updated Date',
        },
      ],
    },
    {
      title: 'tab:Company Report',
      ab: 'C',
      defaultExpanded: true,
      reports: [
        {
          value: 51,
          label: 'tab:BD Report',
        },
      ],
    },
    {
      title: 'tab:Week Report',
      ab: 'W',
      defaultExpanded: true,
      reports: [
        {
          value: 41,
          label: 'tab:Resource Usage',
        },
        // {
        //   value: 42,
        //   label: 'tab:Submittal Aging Report'
        // },
        {
          value: 43,
          label: 'tab:Common Search Usage',
        },
        {
          value: 45,
          label: 'tab:Linkedin Usage',
        },
        // {
        //   value: 1001,
        //   label: 'tab:Linkedin Map',
        // },
      ],
    },
    {
      title: 'tab:Status Monitor',
      ab: 'S',
      defaultExpanded: true,
      reports: [
        {
          value: 48,
          label: 'tab:Current Jobs and Candidates',
        },
        {
          value: 46,
          label: 'tab:Inactive Job Status Monitor',
        },
        {
          value: 47,
          label: 'tab:Inactive Candidate Status Monitor',
        },
      ],
    },

    // add by bill
    {
      title: 'tab:Hires Report',
      ab: 'H',
      defaultExpanded: true,
      reports: [
        {
          value: 52,
          label:
            'tab:Hires Report - General Recruiting(FTE)/General Staffing(Contract) ',
        },
        {
          value: 55,
          label:
            'tab:Weekly New Offers Report - General Recruiting(FTE)/General Staffing(Contract)',
        },
      ],
    },

    // {
    //   title: 'Weekly New Offers Report',
    //   ab: 'W',
    //   defaultExpanded: true,
    //   reports: [
    //     {
    //       value: 55,
    //       label:
    //         'Weekly New Offers Report - General Recruiting(FTE)/General Staffing(Contract)',
    //     },
    //   ],
    // },
  ],
  leader: [
    {
      title: 'tab:Job Analytics',
      ab: 'J',
      defaultExpanded: true,
      reports: [
        {
          value: 1,
          label: 'tab:Job Analytics by Company',
        },
        {
          value: 2,
          label: 'tab:Job Analytics by Users(AM)',
        },
        //
        // {
        //   value: 4,
        //   label: 'tab:Job Analytics Details'
        // }
      ],
    },
    {
      title: 'tab:Pipeline Analytics',
      ab: 'P',
      defaultExpanded: true,
      reports: [
        {
          value: 7,
          label: 'tab:Pipeline Analytics by Users',
        },
        {
          value: 8,
          label: 'tab:Pipeline Analytics by Company',
        },
        {
          value: 17,
          label: 'tab:Pipeline Analytics per Submittal Perspective',
        },
        // {
        //   value: 9,
        //   label: 'tab:Pipeline Analytics Details'
        // }
      ],
    },

    {
      title: 'tab:Analytics Graph',
      ab: 'G',
      defaultExpanded: true,
      reports: [
        {
          value: 12,
          label: 'tab:Job Chart',
        },
        // {
        //   value: 10,
        //   label: 'tab:User Activities - Submitted to AM'
        // },
        // {
        //   value: 11,
        //   label: 'tab:User Activities - Submitted to Client'
        // },
        //
        // {
        //   value: 15,
        //   label: 'tab:Pipeline Analytics by Sourcer - AM'
        // },
        // {
        //   value: 16,
        //   label: 'tab:Pipeline Analytics by Sourcer - Client'
        // },
        {
          value: 36,
          label: 'tab:Pipeline Analytics per Submittal Perspective',
        },
        {
          value: 37,
          label: 'tab:User Activities',
        },
      ],
    },
    {
      title: 'tab:Usage Report',
      ab: 'W',
      defaultExpanded: false,
      reports: [
        {
          value: 41,
          label: 'tab:Resource Usage',
        },

        {
          value: 43,
          label: 'tab:Common Search Usage',
        },

        // {
        //   value: 45,
        //   label: 'tab:Linkedin Usage'
        // }
      ],
    },
    {
      title: 'tab:Status Monitor',
      ab: 'S',
      defaultExpanded: true,
      reports: [
        {
          value: 48,
          label: 'tab:Current Jobs and Candidates',
        },
        // {
        //   value: 46,
        //   label: 'tab:Inactive Job Status Monitor',
        // },
        // {
        //   value: 47,
        //   label: 'tab:Inactive Candidate Status Monitor',
        // },11
      ],
    },
  ],
  normal: [
    {
      title: 'tab:Job Analytics',
      ab: 'J',
      defaultExpanded: true,
      reports: [
        {
          value: 1,
          label: 'tab:Job Analytics by Company',
        },
        {
          value: 2,
          label: 'tab:Job Analytics by Users(AM)',
        },
      ],
    },
    // {
    //   title: 'tab:Pipeline Analytics',
    //   ab: 'P',
    //   defaultExpanded: true,
    //   reports: [
    //     {
    //       value: 7,
    //       label: 'tab:Pipeline Analytics by Users',
    //     },
    //     // {
    //     //   value: 8,
    //     //   label: 'tab:Pipeline Analytics by Company',
    //     // },
    //     // {
    //     //   value: 17,
    //     //   label: 'tab:Pipeline Analytics per Submittal Perspective',
    //     // },
    //     // {
    //     //   value: 9,
    //     //   label: 'tab:Pipeline Analytics Details'
    //     // }
    //   ],
    // },
    {
      title: 'tab:Status Monitor',
      ab: 'S',
      defaultExpanded: true,
      reports: [
        {
          value: 48,
          label: 'tab:Current Jobs and Candidates',
        },
        // {
        //   value: 46,
        //   label: 'tab:Inactive Job Status Monitor',
        // },
        // {
        //   value: 47,
        //   label: 'tab:Inactive Candidate Status Monitor',
        // },
      ],
    },
  ],
};

class ReportPanels extends React.PureComponent {
  render() {
    const { t, userRole } = this.props;

    return (
      <ResponsiveMasonry columnsCountBreakPoints={{ 420: 1, 840: 2, 1260: 3 }}>
        <Masonry>
          {(reportCategoriesMap[userRole] || reportCategoriesMap.normal).map(
            (reportCategory, index) => (
              <div style={{ padding: 8 }} key={index}>
                <Pannel
                  title={t(reportCategory.title)}
                  defaultExpanded={reportCategory.defaultExpanded}
                >
                  <List style={{ width: '100%' }}>
                    {reportCategory.reports.map((report, index) => (
                      <NavLink
                        key={index}
                        to={{ pathname: '/reports/detail/' + report.value }}
                      >
                        <ListItem button key={index} title={t(report.label)}>
                          <ListItemIcon>
                            <span style={{ lineHeight: '24px' }}>
                              {reportCategory.ab}.{index + 1}
                            </span>
                          </ListItemIcon>
                          <ListItemText primary={t(report.label)} />
                        </ListItem>
                      </NavLink>
                    ))}
                  </List>
                </Pannel>
              </div>
            )
          )}
        </Masonry>
      </ResponsiveMasonry>
    );
  }
}
function mapStateToProps(state) {
  let userRole = 'normal';
  const authorities = state.controller.currentUser.get('authorities');
  if (authorities) {
    if (
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' }))
    ) {
      userRole = 'leader';
    }
    if (
      authorities.includes(Immutable.Map({ name: 'PRIVILEGE_REPORT' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
    ) {
      userRole = 'admin';
    }
  }
  return {
    userRole,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(ReportPanels)
);
