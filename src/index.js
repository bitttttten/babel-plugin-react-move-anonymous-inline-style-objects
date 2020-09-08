const attributes = new Set(["css", "style"]);
const supportedKeys = new Set(["NumericLiteral", "StringLiteral"]);

module.exports = function (babel) {
  const t = babel.types;
  let count = 0;
  let root;

  return {
    visitor: {
      Program(path) {
        root = path;
      },
      JSXAttribute: (path) => {
        // this is a boolean value
        if (!path.node.value) return;

        // if we are not looking at a jsx expression then skip
        if (path.node.value.type !== "JSXExpressionContainer") return;

        // we only want to move plain objects and not ones with compilicated values
        // so i am only going to move the object if it's a string or a numerical literal
        // note: template literals could still contain logical expressions or conditional
        // expressions so that's why i am leaving them out for now
        const properties = path.node.value.expression.properties || [];
        const hasComplicatedType = properties.find(
          (property) => !supportedKeys.has(property.value.type)
        );

        if (hasComplicatedType) {
          return;
        }

        // if it is not an attribute name we care about, then return
        const attributeName = path.node.name.name;
        if (!attributes.has(attributeName)) return;

        // create a new variable name with a unique name + create the identifier
        const varName = `bpmio__${attributeName}__${count++}`;
        const identifier = t.Identifier(varName);

        // create a new variable that holds the expression i.e. value of our attribute
        const variable = t.VariableDeclaration("var", [
          t.variableDeclarator(identifier, path.node.value.expression),
        ]);
        // find the last import statement, and try to insert the new variable after it
        // otherwise just insert to the top of the module
        const lastImport = root
          .get("body")
          .filter((p) => p.isImportDeclaration())
          .pop();

        if (lastImport) lastImport.insertAfter(variable);
        else root.unshiftContainer("body", variable);

        // and replace the value of the attribute with a reference to the new var
        path.get("value").replaceWith(t.JSXExpressionContainer(identifier));

        return;
      },
    },
  };
};
