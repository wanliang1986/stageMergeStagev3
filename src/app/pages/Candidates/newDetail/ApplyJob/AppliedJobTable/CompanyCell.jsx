import React from 'react';

class CompanyCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, data } = this.props;
    return (
      <span>{(data.company && data.company.name) || data.companyName}</span>
    );
  }
}

export default CompanyCell;
