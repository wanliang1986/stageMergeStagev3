import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

import { Cell } from 'fixed-data-table-2';
import Checkbox from '@material-ui/core/Checkbox/index';
import Switch from '@material-ui/core/Switch/index';

const styles = {
    checkboxRoot: {
        height: '100%',
        paddingTop: 0,
        paddingBottom: 0
    },
    switchRoot: {
        left: -10
    },
    switchBase: {
        height: '100%'
    }
};

class CheckCell extends React.Component {

    shouldComponentUpdate(nextProps) {
        return this._getValue(nextProps) !== this._getValue(this.props)
    }

    _getValue = ({ rowIndex, data, col, }) => {
        return data.getIn([rowIndex, col])+data.getIn([rowIndex, 'id']);
    };

    render() {
        const { rowIndex, data, col, onChange, classes, isSwitch, ...props } = this.props;
        const entry = data.get(rowIndex);

        return <Cell {...props}>
            {isSwitch ?
                <Switch
                    checked={entry.get(col)}
                    onChange={() => onChange(entry, col)}
                    color="primary"
                    classes={{
                        root: classes.switchRoot,
                        switchBase: classes.switchBase
                    }}
                    disabled={!onChange}
                /> :
                <Checkbox
                    checked={entry.get(col)}
                    onChange={() => onChange(entry, col)}
                    color="primary"
                    classes={{
                        root: classes.checkboxRoot,
                    }}
                    disabled={!onChange}
                />
            }
        </Cell>
    }
}

export default withStyles(styles)(CheckCell);


