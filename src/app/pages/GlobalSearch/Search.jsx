import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles/index';
import { trackCommonSearch } from '../../gtag';
import { searchTalents } from '../../../apn-sdk/globalSearch';
import { formatFullName } from '../../../utils';
import { CONTACT_TYPES } from '../../constants/formOptions';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import FormGroup from '@material-ui/core/FormGroup';
import Drawer from '@material-ui/core/Drawer';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Search from '@material-ui/icons/Search';

import IconInput from '../../components/particial/IconInput';
import PrimaryButton from '../../components/particial/PrimaryButton';
import Loading from '../../components/particial/Loading';
import PurchaseTalent from './PurchaseTalent';
import Filter from './Filter';
import TalentItem from './TalentItem';

const styles = {
  drawerRight: {
    '& > div:nth-child(2)': {
      overflowX: 'hidden',
    },
  },
  root: {
    padding: '18px 2px 20px 20px',
    overflow: 'hidden',
  },
  searchInput: {
    width: 550,
    marginRight: 5,
    minWidth: 290,
  },
  form: {
    minWidth: 250,
    maxWidth: 380,
    overflow: 'hidden',
    borderRight: '1px solid #cacaca',
  },
  filterContainer: {
    flex: 1,
    overflowY: 'overlay',
    overflowX: 'hidden',
    paddingRight: 15,
  },
};
const PAGE_SIZE = 30;

class GlobalSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        jobTitle: [''],
        location: [''],
        company: [''],
        skills: [''],
        name: [''],
        school: [''],
        q: [''],
      },
      candidateList: [],
      total: 0,
      purchaseTalentStep: 0,
      checkedLinkedin: false,
      checkedEmail: false,
      checkedPhone: false,
      isChinese: false,

      finished: false,
    };

    this.currentPageNo = 1;
  }

  componentDidMount() {
    let filters = localStorage.getItem('filters');

    if (filters) {
      filters = {
        ...this.state.filters,
        ...JSON.parse(filters),
      };
      this.setState({ filters });
    }
  }

  resetFilters = () => {
    this.setState({
      filters: {
        jobTitle: [''],
        location: [''],
        company: [''],
        skills: [''],
        name: [''],
        school: [''],
        q: [''],
      },
      isChinese: false,
    });
  };

  render() {
    const { classes, t } = this.props;
    const { searching, candidateList, loadingMore, total } = this.state;
    // console.log('candidateList', candidateList);
    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={styles.root}
      >
        <div
          className="flex-container"
          style={{ flexWrap: 'wrap', paddingRight: 12, flexShrink: 0 }}
        >
          <div className={classes.searchInput}>
            <IconInput
              name="q"
              style={{ paddingLeft: '2em' }}
              placeholder={'Job Title, Skills, Company, etc.'}
              Icon={Search}
              value={this.state.filters.q}
              onChange={this.onFilterValueChanged}
              form="searchForm"
            />
          </div>
          <PrimaryButton
            size="small"
            form="searchForm"
            type="submit"
            style={{ marginBottom: '.75rem ' }}
            processing={searching}
          >
            Search
          </PrimaryButton>
        </div>
        <Divider component="div" style={{ margin: '6px -20px 10px' }} />

        <div
          className="flex-container flex-child-auto"
          style={{ overflowY: 'hidden' }}
        >
          <form
            onSubmit={this.onSearch}
            id="searchForm"
            className="flex-container flex-dir-column flex-child-auto"
            style={styles.form}
          >
            <div
              className="flex-container align-justify align-middle"
              style={{
                flexShrink: 0,
                paddingRight: 15,
                paddingBottom: 8,
              }}
            >
              <Typography variant="h5" style={{ fontSize: 20 }}>
                Filters
              </Typography>
              <PrimaryButton onClick={this.resetFilters} size="small">
                {t('action:reset')}
              </PrimaryButton>
            </div>

            <div className={classes.filterContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isChinese}
                    onChange={this.handleChange('isChinese')}
                    value="isChinese"
                    color="primary"
                  />
                }
                label={t('field:Mandarin Speaking')}
              />
              <Filter
                collapsed={this.state['nameCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="name"
                label="Name"
                filter={this.state.filters.name}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another name"
              />
              <Filter
                collapsed={this.state['jobTitleCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="jobTitle"
                label={t('field:Job Title')}
                filter={this.state.filters.jobTitle}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another job title"
              />

              <Filter
                collapsed={this.state['locationCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="location"
                label={t('field:location')}
                filter={this.state.filters.location}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another location"
              />

              <Filter
                collapsed={this.state['companyCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="company"
                label={t('field:Company')}
                filter={this.state.filters.company}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another company"
              />

              <Filter
                collapsed={this.state['schoolCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="school"
                label={t('field:School')}
                filter={this.state.filters.school}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another school"
              />

              <Filter
                collapsed={this.state['skillsCollapsed']}
                toggleCollapse={this.onFilterCollapsed}
                filterType="skills"
                label={t('field:Skills')}
                filter={this.state.filters.skills}
                onChange={this.onFilterValueChanged}
                onAdd={this.addFilterInput}
                onRemove={this.removeFilterInput}
                addLabel="Add another skill"
              />
            </div>

            <div style={{ paddingRight: 15, paddingTop: 8 }}>
              <PrimaryButton fullWidth type="submit" processing={searching}>
                Search
              </PrimaryButton>
            </div>
          </form>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 5,
              minWidth: 440,
              paddingLeft: '20px',
            }}
          >
            <div>
              <div
                className="flex-container align-middle"
                style={{ flexWrap: 'wrap' }}
              >
                <Typography variant="h5" style={{ fontSize: 20 }}>
                  Search Result
                </Typography>
                <div
                  className="flex-child-auto flex-container align-center-middle"
                  style={{ height: 24 }}
                >
                  <Typography variant="subtitle1" style={{ marginRight: 12 }}>
                    Includes
                  </Typography>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.checkedLinkedin}
                          onChange={this.handleChange('checkedLinkedin')}
                          value="checkedLinkedin"
                          color="primary"
                        />
                      }
                      label="LinkedIn"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.checkedEmail}
                          onChange={this.handleChange('checkedEmail')}
                          value="checkedEmail"
                          color="primary"
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.checkedPhone}
                          onChange={this.handleChange('checkedPhone')}
                          value="checkedPhone"
                          color="primary"
                        />
                      }
                      label="Phone"
                    />
                  </FormGroup>
                </div>
              </div>

              <Typography
                variant="subtitle1"
                color={this.state.finished ? 'textPrimary' : 'textSecondary'}
              >
                {searching ? (
                  <br />
                ) : (
                  `${candidateList.length}${
                    total ? ` / ${total.toLocaleString()}` : ''
                  } results`
                )}
              </Typography>
            </div>
            <Divider style={{ margin: '10px 0 10px -20px' }} />
            <div
              onScroll={this.handleScroll}
              className="flex-container flex-dir-column"
              style={styles.filterContainer}
            >
              {searching ? (
                <Loading />
              ) : (
                <List>
                  {candidateList.map((item, key) => (
                    <TalentItem
                      key={key}
                      item={item}
                      onSelect={this.onTalentSelected}
                    />
                  ))}
                </List>
              )}
              {!searching && loadingMore && (
                <div className="flex-container align-middle align-center container-padding">
                  <CircularProgress size={32} />
                </div>
              )}
            </div>
          </div>
        </div>

        <Drawer
          anchor="right"
          open={!!this.state.esId}
          onClose={() => this.setState({ esId: null })}
          className={classes.drawerRight}
          PaperProps={{
            style: {
              userSelect: 'text',
              width: '45vw',
              minWidth: '450px',
            },
          }}
        >
          <PurchaseTalent
            t={this.props.t}
            esId={this.state.esId}
            onCloseDetails={() => this.setState({ esId: null })}
            step={this.state.purchaseTalentStep}
            revealOutsideContactInfo={this.revealOutsideContactInfo}
          />
        </Drawer>
      </Paper>
    );
  }

  revealOutsideContactInfo = (esId, email, phone) => {
    const newCandidateList = this.state.candidateList.map((ele) => {
      if (ele.esId === esId) {
        ele.purchased = true;
        ele.email = email;
        ele.phone = phone;
      }

      return ele;
    });
    this.setState({ candidateList: newCandidateList });
  };

  onFilterCollapsed = (filterType) => {
    let key = `${filterType}Collapsed`;
    this.setState({ [key]: !this.state[key] });
  };

  addFilterInput = (e) => {
    let filterType = e.currentTarget.getAttribute('data-filter-type');

    //add 1 more filter value for this type of filters
    let filterValues = this.state.filters[filterType];
    filterValues.push('');

    this.setState({
      filters: {
        ...this.state.filters,
        [filterType]: filterValues,
      },
    });
  };

  removeFilterInput = (e) => {
    //should use currentTarget instead of target
    //since the event passed to the inner element of the icon
    let filterType = e.currentTarget.getAttribute('data-filter-type'),
      index = e.currentTarget.getAttribute('data-index');

    let filterValues = this.state.filters[filterType];
    filterValues.splice(index, 1);

    this.setState({
      filters: {
        ...this.state.filters,
        [filterType]: filterValues,
      },
    });
  };

  onFilterValueChanged = (e) => {
    let filterType = e.target.name;
    let index = e.target.getAttribute('index') || 0;

    let filterValues = this.state.filters[filterType];
    filterValues.splice(index, 1, e.target.value);

    this.setState({
      filters: {
        ...this.state.filters,
        [filterType]: filterValues,
      },
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked }, this._onSearch);
  };

  onSearch = (e) => {
    e.preventDefault();
    this._onSearch();
  };

  handleScroll = (e) => {
    let div = e.target;
    const { candidateList, total, loadingMore, loadMoreFailed } = this.state;

    if (
      div.clientHeight + div.scrollTop <= div.scrollHeight - 350 &&
      loadMoreFailed
    ) {
      this.setState({ loadMoreFailed: false });
    }

    if (candidateList.length === total || loadingMore || loadMoreFailed) {
      return;
    }

    if (div.clientHeight + div.scrollTop > div.scrollHeight - 350) {
      //provide 30 pages most
      if (this.currentPageNo >= 30) {
        console.log('page number has reached 30. need to refine');
        return;
      }

      this.setState({ loadingMore: true });
      ++this.currentPageNo;

      //the es query criteria are only modified when a new search applied
      //it uses the applied criteria to load more data
      //console.log(this.state.esQuery);
      this.fetchXPageList(this.currentPageNo, this.state.filters).then(
        ({ total, dataProcessed, failed }) => {
          if (this.currentPageNo >= 30)
            console.log('page number has reached 30.');
          this.setState({
            loadingMore: false,
            candidateList: candidateList.concat(dataProcessed),
            total,
            loadMoreFailed: failed,
          });
        }
      );
    }
  };

  _onSearch = () => {
    this.currentPageNo = 1;
    this.setState({
      loadingMore: false,
      searching: true,
      candidateList: [],
      total: 0,
    });

    this.fetchXPageList(1, this.state.filters).then(
      ({ total, dataProcessed, finished }) =>
        this.setState({
          searching: false,
          candidateList: this.state.candidateList.concat(dataProcessed),
          total,
          finished,
        })
    );

    //store params
    localStorage.setItem('filters', JSON.stringify(this.state.filters));
    //ga track
    trackCommonSearch(
      this.state.filters,
      this.props.currentUser && this.props.currentUser.toJS()
    );
  };

  fetchXPageList = (pageNo) => {
    const { filters, checkedLinkedin, checkedEmail, checkedPhone, isChinese } =
      this.state;
    const contactsFilter = [];
    const chinese = [];
    if (checkedLinkedin) {
      contactsFilter.push('linkedin');
    }
    if (checkedEmail) {
      contactsFilter.push('email');
    }
    if (checkedPhone) {
      contactsFilter.push('phone');
    }
    if (isChinese) {
      chinese.push('true');
    }
    pageNo = pageNo || 1;
    let searchParam = {
      from: (pageNo - 1) * PAGE_SIZE,
      size: PAGE_SIZE,
      params: {
        jobTitle: filters.jobTitle.filter((e) => e),
        name: filters.name.filter((e) => e),
        skills: filters.skills.filter((e) => e),
        location: filters.location.filter((e) => e),
        company: filters.company.filter((e) => e),
        school: filters.school.filter((e) => e),
        q: filters.q.filter((e) => e),
        contactsFilter,
        chinese,
      },
    };

    return searchTalents(searchParam)
      .then(({ response, headers }) => {
        let total = parseInt(headers.get('pagination-count'), 10);
        let finished = headers.get('Status') === 'FINISHED';
        console.log(response);
        let dataProcessed = response.map(_mapCandidate);
        return {
          dataProcessed,
          total,
          finished,
        };
      })
      .catch((err) => {
        console.log('fetchXPageList error:', err);
        return { dataProcessed: [], failed: true, finished: true };
      });
  };

  onTalentSelected = (esId, purchased) => {
    console.log('[[selected]]', purchased);
    this.setState({
      esId,
      purchaseTalentStep: purchased || purchased === undefined ? 0 : 1,
    });
  };
}

const mapStateToProps = (state, props) => {
  return {
    currentUser: state.controller.currentUser,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(GlobalSearch))
);

const _mapCandidate = (candidate) => {
  // console.log(candidate)
  let skillsList = candidate.skills
    ? candidate.skills.map((skill) => skill.skillName)
    : [];
  let linkedInContact = candidate.contacts.find(
    (c) => c.type === CONTACT_TYPES.LinkedIn
  );

  //todo: show all contacts
  // let emailContact = candidate.contacts.filter(c => c.type === 'Email' || c.type === 'Primary_Email')[0];
  // let phoneContact = candidate.contacts.filter(c => c.type === 'Cell_Phone' || c.type === 'Primary_Phone')[0];
  // console.log(linkedInContact, candidate.esId);

  let emailContact = candidate.contacts.find(
    (c) => c.type === CONTACT_TYPES.Email
  );
  let phoneContact = candidate.contacts.find(
    (c) => c.type === CONTACT_TYPES.Phone
  );

  let linkedInUrl = linkedInContact && linkedInContact.details;
  if (candidate.esId && linkedInUrl) {
    linkedInUrl = `https://www.linkedin.com/in/${candidate.esId}`;
  }

  let fullName = candidate.fullName || candidate.esId;
  const firstName = (candidate.firstName || '').trim();
  const lastName = (candidate.lastName || '').trim();
  if (firstName && lastName) {
    fullName = formatFullName(firstName, lastName);
  }

  return {
    esId: candidate.esId,
    fullName,
    title: candidate.title,
    company: candidate.company,
    skills: skillsList.join(', '),
    linkedInUrl,
    email: emailContact && emailContact.contact,
    phone: phoneContact && phoneContact.contact,
    purchased: candidate.purchased,
  };
};
