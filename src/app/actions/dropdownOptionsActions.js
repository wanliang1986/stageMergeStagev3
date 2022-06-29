/**
 * Created by chenghui on 6/2/17.
 */
import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';

export const searchCountries = () => (dispatch, getState) => {
    return apnSDK.searchCountries()
        .then(response => {
            // console.log('get countries: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchProvinces = (countryId) => (dispatch, getState) => {
    return apnSDK.searchProvinces(countryId)
        .then(response => {
            // console.log('get provinces: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchCities = (countryId, provinceId) => (dispatch, getState) => {
    return apnSDK.searchCities(countryId, provinceId)
        .then(response => {
            // console.log('get Cities: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchCompanies = () => (dispatch, getState) => {
    return apnSDK.searchCompanies()
        .then(response => {
            // console.log('get companies: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchSkills = () => (dispatch, getState) => {
    return apnSDK.searchSkills()
        .then(response => {
            // console.log('get skills: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchColleges = () => (dispatch, getState) => {
    return apnSDK.searchColleges()
        .then(response => {
            // console.log('get colleges: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

export const searchMajors = () => (dispatch, getState) => {
    return apnSDK.searchMajors()
        .then(response => {
            // console.log('get majors: ', response);
            if (!response.message) {
                return response.data;
            }
            return [];
        })
};

