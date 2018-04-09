'use strict';

//==================
// checkRequiredParam function and helpers
//==================

const ruleReturnValueKey = '_value';
const ruleReturnErrorMsgKey = '_error';

function makeRuleReturnObj(outValue) {
    return {
        [ruleReturnValueKey]: outValue
    };
}

function makeRuleErrorObj(errorMsg) {
    return {
        [ruleReturnErrorMsgKey]: errorMsg
    };
}

function validateParameters(obj) {
    const errors = [],
        outObj = {};

    const parameters = obj.parameters;
    const validations = obj.validations;
    const strict = obj.strict;

    // Check each parameter
    for (let validation of validations) {
        let paramName = validation.name,
            rules = validation.rules,
            paramValue = parameters[paramName];

        // Check each rule for this parameter
        // re-assigning any new values it gives us before applying the next rule
        for (let rule of rules) {
            let ruleResult = rule(paramValue, strict);
            if (ruleResult[ruleReturnErrorMsgKey]) {
                errors.push(`${paramName}: ` + ruleResult[ruleReturnErrorMsgKey]);
                break;
            } else {
                paramValue = ruleResult[ruleReturnValueKey];
            }
        }

        // capture the last value into the obj to be returned later
        outObj[paramName] = paramValue;
    }

    if (errors.length) {
        let paramValidationError = new Error(errors);
        // preserve original stack trace
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(paramValidationError, validateParameters);
        }
        paramValidationError.name = 'InvalidParameterError';
        throw paramValidationError;
    }

    return outObj;
}

module.exports = {
    validateParameters: validateParameters,
    makeRuleReturnObj: makeRuleReturnObj,
    makeRuleErrorObj: makeRuleErrorObj,    
};
