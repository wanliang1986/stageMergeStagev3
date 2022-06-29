import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { formatUserName } from '../../../utils';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[1],
    // maxHeight: 200,
    overflow: 'visible',
    // wordBreak: 'break-all',
    margin: '4px 0',
    padding: '8px 20px',
    minWidth: '1000px',
  },
});

class CompanyTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  SetsalesLeadOwner = () => {
    const { data, rowIndex, t } = this.props;
    const dataToJS = data.toJS();
    console.log(dataToJS[rowIndex]);
    return (
      <Table style={{ minWidth: '800px' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('tab:Sales Lead Owner')}</TableCell>
            <TableCell>{t('tab:Estimated Deal Time')}</TableCell>
            <TableCell>{t('tab:Account Progress')} </TableCell>
            <TableCell>{t('tab:Potential Service Type')}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dataToJS[rowIndex] && dataToJS[rowIndex]['saleLead']
            ? dataToJS[rowIndex]['saleLead'].map((item, index) => {
                return (
                  <TableRow key={index}>
                    {/* saleLeadOwner */}
                    <TableCell>
                      {item.saleLeadOwner.length > 0 &&
                        item.saleLeadOwner.map((item2) => {
                          return item2
                            ? `${item2.firstName} ${item2.lastName}`
                            : '****';
                        })}
                    </TableCell>
                    {/* estimatedDealTime */}
                    <TableCell>
                      {moment(item.estimatedDealTime).format('YYYY-MM-DD')}
                    </TableCell>
                    {/* accountProgress */}
                    <TableCell>
                      {item.accountProgress && item.accountProgress * 100 + '%'}
                    </TableCell>
                    {/* serviceTypes */}
                    <TableCell>
                      {item.serviceTypes.length > 0 &&
                        item.serviceTypes.map((item3) => {
                          if (item.serviceTypes.length > 1) {
                            return item3.label + ', ';
                          } else {
                            return item3.label;
                          }
                        })}
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    );
  };

  render() {
    const { classes, LeadOwner } = this.props;
    // console.log(classes);
    // console.log('%c ToolTip show!', 'background:red');
    return (
      <Tooltip
        arrow
        interactive
        classes={classes}
        // open
        title={this.SetsalesLeadOwner()}
      >
        <div style={{ cursor: 'pointer' }}>{LeadOwner}</div>
      </Tooltip>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(CompanyTooltip));
