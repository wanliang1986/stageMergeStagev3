import authRequest from './request';

export const myTemplateList = () => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/my-email-templates`, config);
};

export const tenantTemplateList = () => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/email-templates?isRichText=true`, config);
};

export const getEmailTemplate = (templateId = '') => {
    const config = {
        method: 'GET',
        headers: {},
    };

    return authRequest.send(`/email-templates/${templateId}`, config);
};

export const upsertEmailTemplate = (template, templateId = '') => {
    const config = {
        method: templateId ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
    };

    return authRequest.send(`/email-templates/${templateId}`, config);
};

export const deleteEmailTemplate = (templateId = '') => {
    const config = {
        method: 'DELETE',
        headers: {},
    };

    return authRequest.send(`/email-templates/${templateId}`, config);
};