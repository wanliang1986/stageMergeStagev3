/**
 * Created by chenghui on 6/2/17.
 */
import authRequest from './request';

export const searchCities = (q) => {
    const config = {
        method: 'GET',
        headers: {}
    };
    return authRequest.send(`/api/es/cities/search/${q}`, config);
};

export const searchProvinces = (q) => {
    const config = {
        method: 'GET',
        headers: {}
    };
    return authRequest.send(`/api/es/provinces/search/${q}`, config);
};

export const searchCountries = (q) => {
    const config = {
        method: 'GET',
        headers: {}
    };
    return authRequest.send(`/api/es/countries/search?queryString=${q}`, config);
};

export const searchCompanies = (q) => {
    const config = {
        method: 'GET',
        headers: {}
    };
    return authRequest.send(`/companyBriefList?search=name:${q}&size=10`, config);
};

export const searchSkills = () => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/api/skills`, config);
};

export const searchColleges = () => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/api/colleges`, config);
};

export const searchMajors = () => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/api/majors`, config);
};