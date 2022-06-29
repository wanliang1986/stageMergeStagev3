import React from 'react';
import { withStyles } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import FormInput from "../../components/particial/FormInput";
import Typography from "@material-ui/core/Typography";
import LinkButton from "../../components/particial/LinkButton";
import Divider from "@material-ui/core/Divider";

import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import HighlightOff from '@material-ui/icons/HighlightOff';

const styles = {
    listItem: {
        padding: '5px 3px 5px 0'
    },
    contentContainer: {
        height: 31, margin: '3px 0 5px 0'
    },
    removeFilter: {
        display: 'inline-block',
        // paddingTop: 10,
        color: '#bbb',
        '&:hover': { color: '#999' },
        margin: '0 5px',
        height: 24,
        outline: 'none',
        '&$hidden': {
            visibility: 'hidden'
        }
    },
    hidden: {},
    link: {
        fontSize: 13,
        margin: '3px 0 6px 0'
    }
};

class Filter extends React.Component {
    render() {
        const {
            classes, collapsed, toggleCollapse, filterType, label, filter,

            onChange, onAdd, onRemove, addLabel,
        } = this.props;


        return <div>
            <ListItem button className={classes.listItem} onClick={() => toggleCollapse(filterType)}>
                <ListItemText inset primary={label} style={{ paddingLeft: 0 }} />
                {!collapsed ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={!collapsed}>
                {
                    filter.map((f, i) => {
                        return (
                            <div className={clsx("flex-container align-middle", classes.contentContainer)}
                                 key={i}>
                                <div className="flex-child-auto">
                                    <FormInput
                                        name={filterType}
                                        style={{ margin: 0 }}
                                        value={f}
                                        index={i}
                                        onChange={onChange}
                                    />
                                </div>
                                <button type='button'
                                        className={clsx(classes.removeFilter,
                                            { [classes.hidden]: filter.length <= 1 })
                                        }
                                        onClick={onRemove} data-index={i}
                                        data-filter-type={filterType}>
                                    <HighlightOff />
                                </button>
                            </div>
                        );
                    })
                }
                <Typography className={classes.link}>
                    <LinkButton type='button' onClick={onAdd} data-filter-type={filterType}>{addLabel}</LinkButton>
                </Typography>
            </Collapse>
            <Divider style={{ margin: "3px 0" }} />
        </div>
    }
}

export default withStyles(styles)(Filter)
