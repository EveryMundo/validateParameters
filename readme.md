# validateParameters

Provides a method to validate parameters and optionally correct simple formatting errors. Validations exist as series of "Rules" which can be chained together.

The main benefit of this over other methods of validation (or not validating and handling exceptions as they occur) is more verbose error reporting. This module can report which part of validation was failed and even catch multiple errors with multiple parameters.

```javascript
// Let's assume we're validating airport codes
validateParameters.validateParameters({
        parameters: {
            o: 'mia',
            d: '    NYC',
            isRoundTrip: 'yes',
            // etc...
        },
        // validations go here etc...
})

// will throw the error:
"InvalidParameterError: o: 'mia' can only be uppercase letters, d: '    NYC' is not 3 characters, isRoundTrip: 'yes' did not match a boolean value."
```

Tests can be run with `npm test`

To include this in your own project, validateParameters.js is the only file needed. You will need to create your own rule functions.


# Example Usage

A more detailed usage can be found in example.js and the test.js files.

```javascript
    function doSomething(parameters) {
        // parameters is an object with unvalidated parameters
        // this will throw an error if it does not validate
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
        // o, d, isRoundTrip, isTestingEnv now guaranteed to be validated and have proper formatting
    
        return null;
    }
```

`parameters` is an object with keys matching the parameter names (here it is "o", "d", "isRoundTrip", "isTestingEnv"). `validations` is a list of validation objects whose names must match the parameter names (see below).

## Validations

A validation is the parameter name and the chain of rules it must pass. The name is required for better error logging, and also to later re-assign variables by name.

Here is a validation for a parameter named "o" which must be formatted like an IATA Airport Code, and must be in our list of US airports. The 'rules' array takes any series of functions which must return a certain format (more on that below):

```javascript
    {
        'name': 'o',
        'rules': [rules.iataCodeRule, rules.domestic_US_AirportsRule]
    }
```

The example below is for a hypothetical airport-based method. The order of parameters does not matter. The order of rules DOES matter if strict=false, because then rules may modify incoming values before passing it to the next rule.

```javascript
    const doSomethingValidations = [
        {
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
```


## Rules

Rules are just functions. They take 2 arguments, the value to be validated, and whether or not it should be considered "strict". The meaning of "strict" is for the developer to decide, but a good rule of thumb is no changes should be made to the value if strict=true.

Rules then return either a RuleReturnObj or a RuleErrorObj using the 2 helper functions:

```javascript
    // Helper Functions
    makeRuleReturnObj(valueToReturn)
    makeRuleErrorObj(errorMessage)
```

```javascript
    // Example rule function which uses helper functions
    function whateverRule(value, strict) {
        if (value == 10) {
            if (strict)
                return makeRuleErrorObj('10 is not a valid value');
            else
                return makeRuleReturnObj(value + 1);
        }
        return makeRuleReturnObj(value);
    }
```

Here is an example rule that validates whether or not a string matches the format of an airport code (3 letters, all uppercase). If strict=false, then it will "fix" simple errors, such as casting to uppercase and trimming extra whitespace.

```javascript
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
            return makeRuleErrorObj(`${value} is not 3 characters`);
        if (!/^[A-Z]+$/.test(valueToTest))
            return makeRuleErrorObj(`${value} can only be uppercase letters`);
    
        return makeRuleReturnObj(valueToTest);
    }
```

