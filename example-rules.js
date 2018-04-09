/*
* EXAMPLES OF RULE USAGE
*/

const validateParametersModule = require('./validateParameters');
const makeRuleReturnObj = validateParametersModule.makeRuleReturnObj;
const makeRuleErrorObj = validateParametersModule.makeRuleErrorObj;

function iataCodeRule(value, strict) {
    /*
     * Only allows strings of 3 uppercase characters
     * if strict=false, lowercase strings will be cast to uppercase
     */
    let valueToTest;
    if (strict)
        valueToTest = value;
    else
        valueToTest = value.trim().toUpperCase();

    if (valueToTest.length !== 3)
        return makeRuleErrorObj(`'${value}' is not 3 characters`);
    if (!/^[A-Z]+$/.test(valueToTest))
        return makeRuleErrorObj(`'${value}' can only be uppercase letters`);

    return makeRuleReturnObj(valueToTest);
}

function strictBooleanValueRule(value, strict) {
    /*
     * Only allows exactly true or false (as booleans) to pass without error. 
     */
    if (value === true || value === false)
        return makeRuleReturnObj(value);
    else
        return makeRuleErrorObj(`'${value}' did not match true or false.`);
}

function semanticBooleanValueRule(value, strict) {
    /*
     * Allows booleans, 0 or 1, or "boolean-ish" strings
     * with strict = true
     *      true  <- true, 1, 'true', 'TRUE', 'True', 'tRue', etc
     *      false <- false, 0, 'false', 'FALSE', 'False', 'FALse', etc
     * with strict = false
     *      true  <- list above + '1', t', 'yes', 'YES', etc
     *      false <- list above + '0', 'f', 'no', 'NO', etc
     */

    // First check if value is already a natural boolean or 0 or 1
    // otherwise it must be a string
    if (value === true || value === false)
        return makeRuleReturnObj(value);
    if (value === 0 || value === 1)
        return makeRuleReturnObj(value === 1);
    if (typeof value !== 'string')
        return makeRuleErrorObj(`'${value}' is not a boolean or string.`);

    const valueLower = value.toLowerCase();

    if (strict) {
        if (valueLower === 'true')
            return makeRuleReturnObj(true);
        else if (valueLower === 'false')
            return makeRuleReturnObj(false);
    } else {
        if (['true', 't', '1', 'yes'].includes(valueLower))
            return makeRuleReturnObj(true);
        else if (['false', 'f', '0', 'no'].includes(valueLower))
            return makeRuleReturnObj(false);
    }

    return makeRuleErrorObj(`'${value}' did not match a boolean value.`);
}

function domestic_US_AirportsRule(value, strict) {
    /*
     * only allows airport codes that are in USA
     * airport code must be exact, ("NYC" not "nyc" or " NYC ")
     * in reality this list would be much longer and not a hard-coded array
     */
    const vaAirportList = ['MIA', 'NYC', 'JFK', 'LAX', 'IAD', 'SEA'];
    if (vaAirportList.includes(value)) {
        return makeRuleReturnObj(value);
    }
    return makeRuleErrorObj(`'${value}' is not a domestic airport for US.`);
}


module.exports = {
    iataCodeRule: iataCodeRule,
    strictBooleanValueRule: strictBooleanValueRule,
    semanticBooleanValueRule: semanticBooleanValueRule,
    domestic_US_AirportsRule: domestic_US_AirportsRule,
}

