const { RuleTester } = require('eslint');
const fooBarRule = require('./common-default-import-name');

const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
};

const ruleTester = new RuleTester({
  parser,
  parserOptions,
});

const validationsError = {
  messageId: 'importName',
  data: {
    defaultImportName: 'validations',
    expectedImportName: 'validators',
  },
};

const utilitiesError = {
  messageId: 'importName',
  data: {
    defaultImportName: 'utilities',
    expectedImportName: 'utils',
  },
};

ruleTester.run('common-default-import-name', fooBarRule, {
  valid: [
    {
      code: `
        import utils from "@common/utils"

        const utilResult = utils.addition(1, 2)
        utils.addition(1, 2)
        console.log(utils.addition(1, 2))
        `,
    },
    {
      code: `
        import utils from "@common/utils"
        import validators from "@common/validators"

        const utilResult = utils.addition(1, 2)
        utils.addition(1, 2)
        console.log(utils.addition(1, 2))

        const validatorResult = validators.isMobilePhone("010-123-4567")
        validators.isMobilePhone("010-123-4567")
        console.log(validators.isMobilePhone("010-123-4567"))
      `,
    },
    {
      code: `
        import commonHelper from "../helper"
        import commonConstant from "../constant"

        const helperResult = commonHelper.test(1, 2)
        commonHelper.test(1, 2)
        console.log(commonHelper.test(1, 2))

        const result = commonConstant.MAX_LENGTH
        commonConstant.MAX_LENGTH
        console.log(commonConstant.MAX_LENGTH)
      `,
    },
  ],
  invalid: [
    {
      code: `
        import utilities from "@common/utils"

        const utilResult = utilities.addition(1, 2)
        utilities.addition(1, 2)
        console.log(utilities.addition(1, 2))
        `,
      output: `
        import utils from "@common/utils"

        const utilResult = utils.addition(1, 2)
        utils.addition(1, 2)
        console.log(utils.addition(1, 2))
        `,
      errors: [utilitiesError, utilitiesError, utilitiesError, utilitiesError],
    },
    {
      code: `
        import utilities from "@common/utils"
        import validations from "../../validators"

        const utilResult = utilities.addition(1, 2)
        utilities.addition(1, 2)
        console.log(utilities.addition(1, 2))

        const validatorResult = validations.isMobilePhone("010-123-4567")
        validations.isMobilePhone("010-123-4567")
        console.log(validations.isMobilePhone("010-123-4567"))
        `,
      output: `
        import utils from "@common/utils"
        import validations from "../../validators"

        const utilResult = utils.addition(1, 2)
        utils.addition(1, 2)
        console.log(utils.addition(1, 2))

        const validatorResult = validations.isMobilePhone("010-123-4567")
        validations.isMobilePhone("010-123-4567")
        console.log(validations.isMobilePhone("010-123-4567"))
        `,
      errors: [utilitiesError, utilitiesError, utilitiesError, utilitiesError],
    },
    {
      code: `
        import utilities from "@common/utils"
        import validations from "@common/validators"

        const utilResult = utilities.addition(1, 2)
        utilities.addition(1, 2)
        console.log(utilities.addition(1, 2))

        const validatorResult = validations.isMobilePhone("010-123-4567")
        validations.isMobilePhone("010-123-4567")
        console.log(validations.isMobilePhone("010-123-4567"))
        `,
      output: `
        import utils from "@common/utils"
        import validators from "@common/validators"

        const utilResult = utils.addition(1, 2)
        utils.addition(1, 2)
        console.log(utils.addition(1, 2))

        const validatorResult = validators.isMobilePhone("010-123-4567")
        validators.isMobilePhone("010-123-4567")
        console.log(validators.isMobilePhone("010-123-4567"))
        `,
      errors: [
        utilitiesError,
        validationsError,
        utilitiesError,
        utilitiesError,
        utilitiesError,
        validationsError,
        validationsError,
        validationsError,
      ],
    },
  ],
});