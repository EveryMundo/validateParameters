const example = require('./example');
const rules = require('./example-rules');
const validateParameters = require('./validateParameters');


function assertReturns(testName, fn, shouldReturnThis) {
    const fnResult = fn();
    if (JSON.stringify(fnResult) === JSON.stringify(shouldReturnThis)) {
        console.log(`'test passed - ${testName}'.`);
        return;
    }

    console.log(`'test failed - ${testName}'!`);
    throw new Error(
        `'test failed - ${testName}'! \n` +
        `${JSON.stringify(fnResult)} != ${JSON.stringify(shouldReturnThis)}`
    );

}

function assertThrows(testName, fn, errorName) {
    let e;
    try {
        const returned = fn();
        console.log(`Returned when fn should have thrown ${JSON.stringify(returned)}`);
        returned
    } catch (error) {
        if (error.name == errorName) {
            console.log(`'test passed - ${testName}'.`);
            return;
        }
        console.log(`'${error.name}'!= '${e}'`);
        e = error;
    }
    console.log(`'test failed - ${testName}'!`);
    throw e || new Error(`'test failed - ${testName}'!`);
}

function test() {

    assertThrows(
        'doesnt allow not domestic',
        _ => example.doSomething({
            o: 'MIA',
            d: 'YYZ',
            isRoundTrip: true,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow not domestic',
        _ => example.doSomething({
            o: 'mia',
            d: 'yyz',
            isRoundTrip: true,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow isRoundTrip not a semantic boolean (25)',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: 25,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow isRoundTrip not a semantic boolean ({})',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: {},
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow isRoundTrip not a semantic boolean ("maybe")',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: "maybe",
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow isTestingEnv not a strict boolean',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: true,
            isTestingEnv: "false",
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow o not valid airport',
        _ => example.doSomething({
            o: 'MIAMIA',
            d: 'NYC',
            isRoundTrip: true,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow d not valid airport',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYCNYC',
            isRoundTrip: true,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );
    assertThrows(
        'doesnt allow o and/or d not valid airport',
        _ => example.doSomething({
            o: 'MIAMIA',
            d: 'NYCNYC',
            isRoundTrip: true,
            isTestingEnv: false,
        }),
        'InvalidParameterError'
    );

    // These tests should all validate succesfully

    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: true,
            isTestingEnv: false,
        }), {
            'didSomething': 'is rt'
        }
    );

    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'mia',
            d: 'NYC  ',
            isRoundTrip: true,
            isTestingEnv: false,
        }), {
            'didSomething': 'is rt'
        }
    );
    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'mia',
            d: ' nyc ',
            isRoundTrip: "true",
            isTestingEnv: false,
        }), {
            'didSomething': 'is rt'
        }
    );
    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: "1",
            isTestingEnv: false,
        }), {
            'didSomething': 'is rt'
        }
    );
    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: 1,
            isTestingEnv: false,
        }), {
            'didSomething': 'is rt'
        }
    );

    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: "0",
            isTestingEnv: false,
        }), {
            'didSomething': 'is not rt'
        }
    );

    assertReturns(
        'should pass validation, these need a better name',
        _ => example.doSomething({
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: "NO",
            isTestingEnv: false,
        }), {
            'didSomething': 'is not rt'
        }
    );

    validateParameters.validateParameters({
        parameters: {
            o: 'mia',
            d: '    NYC',
            isRoundTrip: 'yes',
            isTestingEnv: true
        },
        validations: [{
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
        ],
        strict: true,
    })

    assertThrows(
        'Test strict=true doesnt cast to different types or fix formating and throws error',
        _ => validateParameters.validateParameters({
            parameters: {
                o: 'mia',
                d: '    NYC',
                isRoundTrip: 'yes',
                isTestingEnv: true
            },
            validations: [{
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
            ],
            strict: true,
        }),
        'InvalidParameterError'
    );
    assertReturns(
        'Test strict=true with correct types and valid data passes back same data',
        _ => validateParameters.validateParameters({
            parameters: {
                o: 'MIA',
                d: 'NYC',
                isRoundTrip: 'true',
                isTestingEnv: true
            },
            validations: [{
                    'name': 'o',
                    'rules': [rules.iataCodeRule, rules.domestic_US_AirportsRule]
                },
                {
                    'name': 'd',
                    'rules': [rules.iataCodeRule, rules.domestic_US_AirportsRule]
                },
                {
                    'name': 'isRoundTrip',
                    // Semantic boolean will cast 'true' to true even with strict=true
                    // What it won't do is cast things like 'yes', 't', '1'
                    'rules': [rules.semanticBooleanValueRule]
                },
                {
                    'name': 'isTestingEnv',
                    'rules': [rules.strictBooleanValueRule]
                },
            ],
            strict: false,
        }), {
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: true,
            isTestingEnv: true,
        }
    );
    assertReturns(
        'Test strict=false casts to correct types and fixes common data formatting problems',
        _ => validateParameters.validateParameters({
            parameters: {
                o: 'mia',
                d: '    NYC',
                isRoundTrip: 'yes',
                isTestingEnv: true
            },
            validations: [{
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
            ],
            strict: false,
        }), {
            o: 'MIA',
            d: 'NYC',
            isRoundTrip: true,
            isTestingEnv: true,
        }
    );
};

test();