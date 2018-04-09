const rules = require('./example-rules');
const validateParameters = require('./validateParameters').validateParameters;

const doSomethingValidations = [{
        'name': 'o',
        'rules': [rules.iataCodeRule, rules.domestic_US_AirportsRule]
    },
    {
        'name': 'd',
        'rules': [rules.iataCodeRule, rules.domestic_US_AirportsRule]
    },
    {
        'name': 'isRoundTrip',
        'rules': [rules.semanticBooleanValueRule]
    },
    {
        'name': 'isTestingEnv',
        'rules': [rules.strictBooleanValueRule]
    },
];


function doSomething(parameters) {
    /* Does Something */
    const {
        o,
        d,
        isRoundTrip,
        isTestingEnv
    } = validateParameters({
        parameters: parameters,
        validations: doSomethingValidations,
        strict: false,
    })

    var outData;
    if (isRoundTrip) {
        outData = 'is rt';
    } else {
        outData = 'is not rt';
    }

    return {
        didSomething: outData
    };
}

module.exports = {
    doSomething: doSomething
}
