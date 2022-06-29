import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Immutable from 'immutable';
import clsx from 'clsx';

import Button from '@material-ui/core/Button';
import AlertError from '@material-ui/icons/Error';

import MyDialog from '../../../components/Dialog/myDialog';
import NoContractClientTemplate from '../../../components/Dialog/DialogTemplates/NoContractClientTemplate.jsx';
const styles = {
  flash: {
    animation: 'flash .8s linear infinite',
  },
};

class ErrorResumes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      flashing: false,
    };
  }

  //   componentDidMount() {
  //     console.timeEnd('ErrorResumes');
  //     this.fetchData();
  //   }

  //   fetchData = () => {

  //   };
  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  render() {
    console.time('ErrorResumes');
    const { parseRecordList, hotListList, classes, t, noContractClientCount } =
      this.props;
    const { flashing, openDialog } = this.state;
    return (
      <>
        {
          <div className="item-padding">
            <Button
              onClick={() => this.setState({ openDialog: true })}
              variant="outlined"
              color="secondary"
              style={{ borderRadius: 30 }}
              startIcon={<AlertError />}
              size="small"
              className={clsx({ [classes.flash]: flashing })}
            >
              {noContractClientCount} {t('tab:No contract Client')}
            </Button>
          </div>
        }

        <MyDialog
          btnShow={true}
          show={openDialog}
          modalTitle={'Contract Upload Required'}
          CancelBtnShow={true}
          CancelBtnMsg={'Closed'}
          CancelBtnVariant={'contained'}
          handleClose={() => {
            this.handleClose();
          }}
        >
          <NoContractClientTemplate />
        </MyDialog>
      </>
    );
  }
}

// function mapStoreStateToProps(state) {
//   return {
//     parseRecordList: parseRecordSelector(state),
//   };
// }

export default withStyles(styles)(ErrorResumes);
