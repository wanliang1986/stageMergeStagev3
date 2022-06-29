import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { JOB_TYPES } from '../constants/formOptions';

const getTalentId = (_, talentId) => parseInt(talentId, 10);
const getStarts = (state) => state.relationModel.starts;
const getJobs = (state) => state.model.jobs;
const getTalents = (state) => state.model.talents;
const getApplications = (state) => state.relationModel.applications;
const getStartIds = (state) => state.controller.searchStarts.all.ids;
const getApplicationId = (_, applicationId) => parseInt(applicationId, 10);

export const getActiveStartByTalent = createSelector(
  [getTalentId, getStarts],
  (talentId, starts) => {
    return starts
      .toList()
      .find(
        (s) => s.get('talentId') === talentId && s.get('status') === 'ACTIVE'
      );
  }
);

export const getActiveStartListByTalent = createSelector(
  [getTalentId, getStarts],
  (talentId, starts) => {
    return starts.toList().filter((s) => {
      console.log(talentId, s.get('talentId'), s.get('status'));
      return s.get('talentId') === talentId && s.get('status') === 'ACTIVE';
    });
  }
);

export const getStartListByTalent = createSelector(
  [getTalentId, getStarts],
  (talentId, starts) => {
    return starts.toList().filter((s) => {
      console.log(talentId, s.get('talentId'), s.get('status'));
      return (
        s.get('talentId') === talentId &&
        (s.get('status') === 'ACTIVE' ||
          s.get('status') === 'CONTRACT_TERMINATED')
      );
    });
  }
);

export const getStartList = createSelector(
  [getStartIds, getStarts],
  (ids, starts) => {
    console.log(
      `%c create start selector for all`,
      'color: green',
      ids && ids.toJSON()
    );
    return ids
      ? ids
          .map((id) => {
            let start = starts.get(String(id));

            return start;
          })
          .filter((s) => s.get('status').toLowerCase() === 'active')
      : Immutable.List();
  }
);

export const makeGetStartByApplicationId = () => {
  return createSelector(
    [getApplicationId, getStarts],
    (applicationId, starts) => {
      return starts
        .filter((s) => s.get('applicationId') === applicationId)
        .sortBy((el) => el.get('id'))
        .last();
    }
  );
};

export const getStartByApplicationId = makeGetStartByApplicationId();

export const makeGetPreStartByApplicationId = () => {
  return createSelector(
    [getApplicationId, getApplications, getJobs, getTalents],
    (applicationId, applications, jobs, talents) => {
      const application = applications.get(String(applicationId));
      if (application.get('status') !== 'Offer_Accepted') {
        return null;
      }
      const job = jobs.get(String(application.get('jobId')));
      const candidate = talents.get(String(application.get('talentId')));
      const startCommissions = application
        .get('applicationCommissions')
        .filter((ac) => ac.get('applicationId') === applicationId)
        .toList();
      // console.log('application', application.toJS());

      const offerLetter = application.get('applicationOfferLetter')
        ? application.get('applicationOfferLetter').toJS()
        : {};
      const positionType = job && job.get('jobType');
      const startContractRate =
        positionType !== JOB_TYPES.FullTime && offerLetter
          ? {
              currency: offerLetter.currency || 'USD',
              rateUnitType: offerLetter.rateUnitType || 'HOURLY',
              totalBillAmount: offerLetter.totalBillAmount || '',

              startDate: offerLetter.startDate,
              endDate: offerLetter.endDate,

              finalBillRate: offerLetter.finalBillRate,
              finalPayRate: offerLetter.finalPayRate,
              estimatedWorkingHourPerWeek:
                offerLetter.estimatedWorkingHourPerWeek,
              taxBurdenRate: offerLetter.taxBurdenRate,
              mspRate: offerLetter.mspRate,
              immigrationCost: offerLetter.immigrationCost,
              extraCost: offerLetter.extraCost,
            }
          : {};
      const startFteRate =
        positionType === JOB_TYPES.FullTime && offerLetter
          ? {
              currency: offerLetter.currency || 'USD',
              rateUnitType: offerLetter.rateUnitType || 'YEARLY',
              totalBillAmount: offerLetter.totalBillAmount || '',
              salary: offerLetter.salary,
              signOnBonus: offerLetter.signOnBonus,
              retentionBonus: offerLetter.retentionBonus,
              annualBonus: offerLetter.annualBonus,
              relocationPackage: offerLetter.relocationPackage,
              extraFee: offerLetter.extraFee,
              totalBillableAmount: offerLetter.totalBillableAmount,
              feeType: offerLetter.feeType || 'PERCENTAGE',
              feePercentage: offerLetter.feePercentage,
            }
          : {};
      return Immutable.Map({
        applicationId,
        talentId: application.get('talentId'),
        talentName: candidate.get('fullName'),
        jobId: application.get('jobId'),
        jobCode: job && job.get('code'),
        jobTitle: job && job.get('title'),
        company: job && job.getIn(['company', 'name']),
        companyId: job && job.getIn(['company', 'id']),
        clientContactId: job && job.getIn(['clientContactName', 'id']),
        startDate:
          application.getIn(['applicationOfferLetter', 'startDate']) ||
          application.get('eventDate') ||
          null,
        warrantyEndDate:
          application.getIn(['applicationOfferLetter', 'warrantyEndDate']) ||
          null,
        startAddress: job && job.getIn(['locations', 0]),
        startContractRates: [startContractRate],
        startFteRate,
        startClientInfo: {},
        positionType: job && job.get('jobType'),
        startCommissions,
      });
    }
  );
};
export const getPreStartByApplicationId = makeGetPreStartByApplicationId();

export const getExtensionList = createSelector(
  [getApplicationId, getStarts],
  (applicationId, starts) => {
    return starts
      .filter(
        (s) =>
          s.get('applicationId') === applicationId &&
          s.get('startType') === 'CONTRACT_EXTENSION'
      )
      .sortBy((el) => -el.get('id'));
  }
);

export default getStartList;
