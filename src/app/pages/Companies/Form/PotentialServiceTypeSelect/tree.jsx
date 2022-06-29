import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CheckBox from '@material-ui/core/Checkbox';
import Loading from '../../../../components/particial/Loading';
import lodash from 'lodash';

const useTreeItemStyles = makeStyles((theme) => ({
  content: {
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
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
  root: {
    marginLeft: '10px',
  },
}));

const StyledTreeItem = (props) => {
  const classes = useTreeItemStyles();
  const { labelText, labelInfo, labelRoot, label, list, ...other } = props;
  const checkedList = [];

  ///获取点击节点方法
  const deepQuery = (tree, id) => {
    let List = tree;
    var retNode = null;
    function deepSearch(tree, id) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deepSearch(tree[i].children, id);
        }
        if (id === tree[i].id) {
          retNode = tree[i];
          //1，有子节点，但是没有父节点，说明此节点为1级节点
          if (retNode.children && !retNode.parentId) {
            retNode.children.forEach((item, index) => {
              deepSearch(tree, item.id);
            });
          }
          if (!retNode.children && retNode.parentId) {
            //该节点有父节点，但是没有子节点，说明该节点为最底层节点
            deepSearch(tree, retNode.parentId);
          }
          // if(retNode.children&&retNode.parentId) { //该节点既有父节点，又有子节点，说明该节点为中间级节点
          //   let type=retNode.children.every((item,index)=>{
          //     return item.checked===false
          //   })
          //   if(type&&retNode.checked===true){
          //     deepSearch(tree,retNode.parentId)
          //   }else if(!type&&retNode.checked===true){
          //     deepSearch(tree,retNode.parentId)
          //     retNode.children.forEach((item,index)=>{
          //         item.checked=false
          //    })
          //   }else if(type&&retNode.checked===false){
          //     deepSearch(tree,retNode.parentId)
          //     retNode.children.forEach((item,index)=>{
          //         item.checked=true
          //    })
          //   }else if(!type&&retNode.checked===false){
          //     deepSearch(tree,retNode.parentId)
          //     retNode.children.forEach((item,index)=>{
          //       item.checked=false
          //    })
          //   }
          // }

          tree[i].checked = !tree[i].checked;
          break;
        }
      }
    }
    deepSearch(tree, id);
    console.log(tree);
    props.setList(tree);
    props.getSelect(tree);
    return retNode;
  };

  const checkedTree = (label) => {
    let List = lodash.cloneDeep(list);
    // if(label.parentId&&label.children){
    //   deepQuery(List,label.id)
    //   checkedTree(label.children)
    //   let selectParent = deepQuery(List,label.parentId)
    //   if(selectParent){
    //     checkedTree(selectParent)
    //   }
    // }else if(!label.parentId&&label.children){
    //   deepQuery(List,label.id)
    //   checkedTree(label.children)
    // }else if(label.parentId&&!label.children){
    deepQuery(List, label.id);
  };

  // const checkedItem = (label,arr)=>{
  //     // console.log(label)
  //     let List = lodash.cloneDeep(list))
  //     List.forEach((item,index)=>{
  //       if(label.id===item.id&&item.children){
  //           item.checked=!item.checked
  //               item.children.forEach((child,index)=>{
  //                   if(item.checked===true){
  //                       child.checked = true
  //                   }else{
  //                       child.checked = false
  //                   }
  //               })
  //       }else if(label.id!==item.id&&item.children){
  //           item.children.forEach((child,index)=>{
  //               if(label.id===child.id&&child.children){
  //                   child.checked=!child.checked
  //                   child.children.forEach((childItem,index)=>{
  //                           if(item.checked===true){
  //                               child.checked = true
  //                           }else{
  //                               child.checked = false
  //                           }
  //                           let type= child.children.some((item,index)=>{
  //                               return item.checked===false
  //                           })
  //                           if(type===false){
  //                               item.checked=false
  //                           }else{
  //                               item.checked = true
  //                           }
  //                       })
  //               }else if(label.id===child.id&&!child.children){
  //                   child.checked=!child.checked
  //                   let type= item.children.some((i,index)=>{
  //                       return i.checked===false
  //                   })
  //                   if(type===false){
  //                       item.checked=true
  //                   }else{
  //                       item.checked = false
  //                   }
  //               }else{
  //                 checkedItem(label)
  //               }
  //           })
  //       }
  //   })
  //   props.setList(List)
  //   props.getSelect(List)
  // }
  const handleChange = (label) => {
    checkedTree(label);
  };
  return (
    <TreeItem
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      label={
        <div className={classes.labelRoot}>
          <CheckBox
            color="primary"
            checked={label.checked}
            onChange={() => handleChange(label)}
          />
          <span>{label.typeName}</span>
        </div>
      }
      {...other}
    />
  );
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function GmailTreeView(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [list, setList] = useState(null);

  useEffect(() => {
    setList(props.data);
  }, [props.data]);

  const handleToggle = (event, nodeIds) => {
    console.log(nodeIds);
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    console.log(nodeIds);
    setSelected(nodeIds);
  };

  const getSelectMsg = (list) => {
    let msg = [];
    list.forEach((item, index) => {
      if (!item.children && item.checked === true) {
        msg.push(item.typeName);
      } else if (item.checked === true && item.children) {
        item.children.forEach((child, key) => {
          let nmsg = item.typeName + '-' + child.typeName;
          msg.push(nmsg);
        });
      } else if (item.checked !== true && item.children) {
        item.children.forEach((child, key) => {
          if (child.checked === true) {
            let nmsg = item.typeName + '-' + child.typeName;
            msg.push(nmsg);
          }
        });
      }
    });
    return msg;
  };

  const getSelect = (list) => {
    const msg = getSelectMsg(list).join(',');
    props.getMsg(list, msg);
  };

  const renderTree = (nodes) =>
    nodes.map((item, index) => {
      return (
        <StyledTreeItem
          key={item.id}
          nodeId={`${item.id}`}
          selected={selected}
          label={item}
          setList={setList}
          list={list}
          getSelect={(arr) => {
            getSelect(arr);
          }}
        >
          {item.children ? renderTree(item.children) : null}
        </StyledTreeItem>
      );
    });

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
      //   onNodeSelect={handleSelect}
    >
      {list ? (
        renderTree(list)
      ) : (
        <div className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </div>
      )}
    </TreeView>
  );
}
