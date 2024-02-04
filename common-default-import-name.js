module.exports = {
    meta: {
      type: 'problem',
      docs: {
        description: '@common 하위에서 default import 하는경우 불러온 파일명을 이름으로 해야합니다.',
      },
      messages: {
        importName:
          '@common에서 불러온 모듈은 파일명인 {{expectedImportName}} 을 이름으로 해야하지만 현재 {{defaultImportName}} 로 불러오고 있습니다',
      },
      fixable: 'code',
      schema: [],
    },
    create(context) {
      const includePath = '@common';
      const obj = {};
      return {
        ImportDeclaration(node) {
          const isDefaultImport =
            node.specifiers.length === 1 && node.specifiers[0].type === 'ImportDefaultSpecifier';
  
          if (isDefaultImport) {
            const defaultImportName = node.specifiers[0].local.name;
            const expectedImportName = node.source.value.includes(includePath)
              ? node.source.value.split('/').reverse()[0]
              : defaultImportName;
  
            if (defaultImportName !== expectedImportName) {
              obj[defaultImportName] = expectedImportName;
              context.report({
                node,
                messageId: 'importName',
                data: {
                  defaultImportName,
                  expectedImportName,
                },
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [node.specifiers[0].range[0], node.specifiers[0].range[1]],
                    expectedImportName,
                  );
                },
              });
            }
          }
        },
        Identifier(node) {
          const defaultImportName = node.name;
          const expectedImportName = obj[defaultImportName];
          if (
            !expectedImportName ||
            node.parent.type === 'ImportDefaultSpecifier' ||
            (node.parent.type === 'MemberExpression' && node.parent.property.name === node.name)
          )
            return;
  
          context.report({
            node,
            messageId: 'importName',
            data: {
              defaultImportName,
              expectedImportName,
            },
            fix(fixer) {
              return fixer.replaceTextRange([node.range[0], node.range[1]], expectedImportName);
            },
          });
        },
      };
    },
  };
  