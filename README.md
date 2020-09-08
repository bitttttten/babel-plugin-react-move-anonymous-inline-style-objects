# babel-plugin-react-move-anonymous-inline-style-objects

Lift inline anonymous objects on `style` and `css` values to the module's scope. This will benefit a component that will be rendered multiple times as it prevents a new anonymous object being created on every render.

Taking suggestions for a name too 🌚

## Disclaimer

This was written just to learn how to create a babel plugin, I wouldn't recommend using it 👻

## Example

**In**

```js
import React from "react"

const MyComponent = () => <div style={{ color: "red" }} />
```

**Out**

```js
import React from "react"

var bpmio__style__0 = {
  color: "red",
}

const MyComponent = () => <div style={bpmio__style__0} />
```

## Gotchas

This is only a proof of concept, and a big emphasis on it being a work in progress.

It currently does not support logical expressions or conditonal expressions inside the `style` or `css` props. This is because there is additional work to be done to detect if it's safe to move the object to the top of the module scope without breaking any references to scopes it does not have access to, like variables from state. This means this plugin only moves the anonymous object if *all* values are a string literal (not a template literal) or a numerical literal.

**Supported**

```js
import React from "react"

const SupportedStringLiteral = () => <div style={{ color: "red" }} />
const SupportedNumericLiteral = () => <div style={{ padding: 32 }} />
```

**Not supported**

```js
import React from "react"

const NotSupportedTemplateLiteral = () => <div style={{ color: `red` }} />
const NotSupportedTemplateLiteralWithConditional = () => <div style={{ padding: `${process.env.IS_TOUCH_DEVICE ? 32 : 0}` }} />
const NotSupportedConditional = () => <div style={{ color: process.env.IS_SOME_VALUE && `red` }} />
const NotSupportedTenary = () => <div style={{ color: process.env.IS_SOME_VALUE ? "yellow" : "blue" }} />
```
