import React from 'react';
import clsx from "clsx";
import withStyles from "@material-ui/core/styles/withStyles";

import { Cell } from 'fixed-data-table-2';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../../../components/Icons';

import { styles } from '../params';

const SortTypes = {
    ASC: 'ASC',
    DESC: 'DESC',
};


class HeaderCell extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _onSortChange = (e) => {
        e.preventDefault();

        if (this.props.onSortChange && this.props.column.sortable) {
            let sortDir;
            let columnKey;
            const currentSortDir = this.props.sortDir;
            const currentColumnKey = this.props.column.col;
            if (currentSortDir) {
                if (currentSortDir === SortTypes.DESC) {
                    sortDir = SortTypes.ASC;
                    columnKey = currentColumnKey;
                } else {
                    sortDir = null;
                    columnKey = null;
                }

            } else {
                sortDir = SortTypes.DESC;
                columnKey = currentColumnKey;

            }

            this.props.onSortChange(
                columnKey,
                sortDir
            );

        }

    };

    render() {
        const {
            className, classes,
            column, sortDir, onSortChange, t, ...props
        } = this.props;
        return (
            <Cell className={clsx(className, classes.headerCell)} {...props}>
                <div onClick={this._onSortChange} className="flex-container align-middle">
                    <span>{t(`field:${column.colName}`)}</span>
                    {onSortChange && column.sortable && (sortDir ? (sortDir === SortTypes.DESC ?
                            <SortDownIcon className={clsx(classes.sortIcon, classes.active)} /> :
                            <SortUpIcon className={clsx(classes.sortIcon, classes.active)} />) :
                            <SortIcon className={classes.sortIcon} />
                    )
                    }
                </div>
            </Cell>
        );
    }
}

export default withStyles(styles)(HeaderCell)

