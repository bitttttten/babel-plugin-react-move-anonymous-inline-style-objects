# babel-plugin-react-move-anonymous-inline-style-objects

Lift inline anonymous objects on `style` and `css` values to the module's scope. This will benefit a component that will be rendered multiple times as it prevents a new anonymous object being created on every render.

Taking suggestions for a name too :)

## Example

**In**

```js
import React from "react";

const MyComponent = () => <div style={{ color: `red` }}>
};
```

**Out**

```js
import React from "react";

var bpmio__style__0 = {
  color: "red",
};

const MyComponent = () => <div style={bpmio__style__0}>
```