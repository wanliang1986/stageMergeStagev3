import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Immutable, { set } from 'immutable';
import { useEffect } from 'react';
import { Box } from '@material-ui/core';
const _data = [
  {
    id: 93,
    label: 'USA',
    labelCn: 'USA',
    value: 93,
    children: [
      {
        id: 94,
        label: 'US Citizen',
        labelCn: 'US Citizen',
        value: 94,
        parentId: 93,
        checked: false,
      },
      {
        id: 95,
        label: 'Green Card',
        labelCn: 'Green Card',
        value: 95,
        parentId: 93,
        checked: false,
      },
      {
        id: 96,
        label: 'Working Visa',
        labelCn: 'Working Visa',
        value: 96,
        children: [
          {
            id: 97,
            label: 'H',
            labelCn: 'H',
            value: 97,
            parentId: 96,
            checked: false,
          },
          {
            id: 98,
            label: 'L',
            labelCn: 'L',
            value: 98,
            parentId: 96,
            checked: false,
          },
          {
            id: 99,
            label: 'O',
            labelCn: 'O',
            value: 99,
            parentId: 96,
            checked: false,
          },
        ],
        parentId: 93,
        checked: false,
      },
      {
        id: 100,
        label: 'EAD Card',
        labelCn: 'EAD Card',
        value: 100,
        children: [
          {
            id: 101,
            label: 'OPT/STEM OPT',
            labelCn: 'OPT/STEM OPT',
            value: 101,
            parentId: 100,
            checked: false,
          },
          {
            id: 102,
            label: 'Asylum',
            labelCn: 'Asylum',
            value: 102,
            parentId: 100,
            checked: false,
          },
          {
            id: 103,
            label: 'H4-EAD',
            labelCn: 'H4-EAD',
            value: 103,
            parentId: 100,
            checked: false,
          },
          {
            id: 104,
            label: 'J2-EAD',
            labelCn: 'J2-EAD',
            value: 104,
            parentId: 100,
            checked: false,
          },
          {
            id: 105,
            label: 'L2-EAD',
            labelCn: 'L2-EAD',
            value: 105,
            parentId: 100,
            checked: false,
          },
          {
            id: 106,
            label: '485 EAD',
            labelCn: '485 EAD',
            value: 106,
            parentId: 100,
            checked: false,
          },
        ],
        parentId: 93,
        checked: false,
      },
    ],
    parentId: 0,
    checked: false,
  },
  {
    id: 107,
    label: 'Canada',
    labelCn: 'Canada',
    value: 107,
    children: [
      {
        id: 108,
        label: 'Canadian Citizen',
        labelCn: 'Canadian Citizen',
        value: 108,
        parentId: 107,
        checked: false,
      },
      {
        id: 109,
        label: 'Permanent Resident',
        labelCn: 'Permanent Resident',
        value: 109,
        parentId: 107,
        checked: false,
      },
      {
        id: 110,
        label: 'Open Work Permit',
        labelCn: 'Open Work Permit',
        value: 110,
        parentId: 107,
        checked: false,
      },
      {
        id: 111,
        label: 'Student Visa',
        labelCn: 'Student Visa',
        value: 111,
        parentId: 107,
        checked: false,
      },
    ],
    parentId: 0,
    checked: false,
  },
  {
    id: 112,
    label: 'Europe',
    labelCn: 'Europe',
    value: 112,
    children: [
      {
        id: 113,
        label: 'Citizen',
        labelCn: 'Citizen',
        value: 113,
        parentId: 112,
        checked: false,
      },
      {
        id: 114,
        label: 'Permanent Resident',
        labelCn: 'Permanent Resident',
        value: 114,
        parentId: 112,
        checked: false,
      },
      {
        id: 115,
        label: 'Work permit with restrictions',
        labelCn: 'Work permit with restrictions',
        value: 115,
        parentId: 112,
        checked: false,
      },
      {
        id: 116,
        label: 'Student Visa',
        labelCn: 'Student Visa',
        value: 116,
        parentId: 112,
        checked: false,
      },
    ],
    parentId: 0,
    checked: false,
  },
];

const useTreeItemStyles = makeStyles((theme) => ({
  content: {
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '& .MuiTreeItem-iconContainer': {
      width: '24px',
      '& .MuiSvgIcon-root': {
        fontSize: 24,
      },
    },
  },
  group: {
    marginLeft: 10,
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

const StyledTreeItem = (props) => {
  const classes = useTreeItemStyles();
  const { label, labelInfo, item, ...other } = props;

  return (
    <>
      <TreeItem
        label={
          <div className={classes.labelRoot}>
            <Checkbox
              color="primary"
              onChange={() => {
                props.setChecked(item);
              }}
              checked={item.checked}
            />
            <Typography variant="body2" className={classes.label}>
              {label}
            </Typography>
          </div>
        }
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          selected: classes.selected,
          group: classes.group,
          label: classes.label,
        }}
        {...other}
      ></TreeItem>
    </>
  );
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function SelectTree(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState([]);

  // 获取首次列表 并判断是否回显
  useEffect(() => {
    if (props.checkedList.length == 0) {
      setData(props.dataList);
    } else {
      let resultArr = [];
      getId(props.dataList, props.checkedList);
      // props.dataList.map((item) => {
      //   if (props.checkedList.includes(item.id)) {
      //     item.checked = true;
      //   }
      //   if (item.children) {
      //     let length = item.children.length;
      //     item.children.map((ele, index) => {
      //       if (props.checkedList.includes(ele.id)) {
      //         ele.checked = true;
      //       }
      //       if (index + 1 == length) {
      //         // arr.push(item.label)
      //         resultArr.push(item.id);
      //       }
      //       if (ele.children) {
      //         let length2 = ele.children.length;
      //         ele.children.map((val, index) => {
      //           if (props.checkedList.includes(val.id)) {
      //             val.checked = true;
      //           }
      //           if (index + 1 == length2) {
      //             // arr.push(item.label)
      //             resultArr.push(ele.id);
      //           }
      //         });
      //       }
      //     });
      //   }
      // });

      setData(props.dataList);
    }
  }, [props.dataList, props.checkedList]);

  // 统计选中的id
  const changeFlag = () => {
    let box = [];
    // data.forEach((val) => {
    //   if (val.checked === true) {
    //     box.push(val.id);
    //   }
    //   val.children &&
    //     val.children.forEach((item) => {
    //       if (item.checked === true) {
    //         box.push(item.id);
    //       }
    //       item.children &&
    //         item.children.forEach((ele) => {
    //           if (ele.checked === true) {
    //             box.push(ele.id);
    //           }
    //         });
    //     });
    // });
    getTrueId(data, box);

    // 回调数据
    props.callback(box);
  };

  const getId = (oldArr, checkedList) => {
    oldArr.map((val) => {
      checkedList.includes(val.id) ? (val.checked = true) : '';
      if (val.children?.length) {
        getId(val.children, checkedList);
      }
    });
  };

  //odlArr需要遍历的数组 ,newArr外部创建的空数组
  const getTrueId = (oldArr, newArr) => {
    oldArr.forEach((val) => {
      val.checked ? newArr.push(val.id) : '';
      if (val.children?.length) {
        getTrueId(val.children, newArr);
      }
    });
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const renderTree = (nodes) =>
    nodes.map((item, index) => {
      return (
        <StyledTreeItem
          key={item.id}
          setChecked={(item) => {
            setChecked(item);
          }}
          nodeId={`${item.id}`}
          item={item}
          label={props.language ? item.label : item.labelCn}
        >
          {item.children ? renderTree(item.children) : null}
        </StyledTreeItem>
      );
    });

  const setChecked = (item) => {
    if (item.parentId === 0) {
      item.checked = !item.checked;
      childrenChecked(item, item.children);
    } else if (item.parentId !== 0 && !item.children) {
      item.checked = !item.checked;
      itemChecked(item);
    } else if (item.parentId !== 0 && item.children) {
      item.checked = !item.checked;
      hasChildren(item);
    }
  };

  //父级勾选，子集选中
  const childrenChecked = (item) => {
    if (item.checked === true) {
      item.children &&
        item.children.forEach((_item, index) => {
          if (!_item.children) {
            _item.checked = true;
          } else {
            _item.checked = true;
            childrenChecked(_item, _item.children);
          }
        });
    } else {
      item.children &&
        item.children.forEach((_item, index) => {
          if (!_item.children) {
            _item.checked = false;
          } else {
            _item.checked = false;
            childrenChecked(_item, _item.children);
          }
        });
    }

    changeFlag();
  };
  //有父级，没有子集勾选
  const itemChecked = (item) => {
    let arr = [...selected];
    let parentId = item.parentId;
    let parentItem = getChidlren(parentId);
    console.log(parentId, parentItem);
    let checkedList = parentItem.children.filter((item, index) => {
      return item.checked === true;
    });

    if (checkedList.length === parentItem.children.length) {
      parentItem.checked = true;
      if (parentItem.parentId) {
        itemChecked(parentItem);
      }
    } else {
      parentItem.checked = false;
      if (parentItem.parentId) {
        itemChecked(parentItem);
      }
    }
    setSelected(arr);
    changeFlag();
  };
  //有父级，有子集
  const hasChildren = (item) => {
    itemChecked(item);
    childrenChecked(item, item.children);

    changeFlag();
  };

  const getChidlren = (id) => {
    var hasFound = false, // 表示是否有找到id值
      result = null;
    var fn = function (data) {
      // let _data = JSON.parse(JSON.stringify(data))
      if (Array.isArray(data) && !hasFound) {
        // 判断是否是数组并且没有的情况下，
        data.forEach((item) => {
          if (item.id === id) {
            // 数据循环每个子项，并且判断子项下边是否有id值
            result = item; // 返回的结果等于每一项
            hasFound = true; // 并且找到id值
          } else if (item.children) {
            fn(item.children); // 递归调用下边的子项
          }
        });
      }
    };
    fn(data); // 调用一下
    return result;
  };

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={['375']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {renderTree(data)}
    </TreeView>
  );
}
