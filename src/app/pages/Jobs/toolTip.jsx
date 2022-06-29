import React from 'react';
import { withTranslation } from 'react-i18next';

class ToolTipInfor extends React.PureComponent {
  render() {
    return (
      <>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          {this.props.t('tab:Here is a list of items to get at the MINIMUM')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          -{' '}
          {this.props.t(
            'tab:Must-Have vs Nice-to-Have Skills (with years of experience)'
          )}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          - {this.props.t('tab:Salary / Rate Expectations (max budget)')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          - {this.props.t('tab:Benefits')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          - {this.props.t('tab:Work Location (WFH, in office, hours, etc.)')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          -{' '}
          {this.props.t(
            'tab:Candidate Submission Notes (what the client wants to see, format)'
          )}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          - {this.props.t('tab:Interview Process')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          - {this.props.t('tab:Reporting Manager (Name and Title)')}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          -{' '}
          {this.props.t(
            'tab:EVP / USP (Employee Value Proposition / Unique Selling Points of the client)'
          )}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          -{' '}
          {this.props.t(
            'tab:Walking out of the intake call knowing you set all the expectations and FEELING CONFIDENT.'
          )}
        </div>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}>
          -{' '}
          {this.props.t(
            "tab:If you're not feeling confident, go back and get your concerns answered!"
          )}
        </div>
      </>
    );
  }
}

export default withTranslation('tab')(ToolTipInfor);
