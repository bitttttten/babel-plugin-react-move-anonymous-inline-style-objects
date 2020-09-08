"use strict";

const pluginTester = require("babel-plugin-tester").default;
const reactMoveAnonymousInlineStyleObjects = require("./src/index.js");

const testSimple = `
import React from "react";
import SomeComponent from "react-library";

export const MComponent = () => {
    const fn = () => alert('hey there');
    return (
        <SomeComponent
            css={{
                color: "red",
            }}
            style={{
                padding: 10,
                backgroundColor: "yellow",
            }}
            isActive
            onPress={fn}
        >
            Text
        </SomeComponent>
    );
};
`;

const testTenaryAndLogicalExpression = `
import React from "react";

export const MComponent = () => {
    const myValue = 0.3;
    return (
        <div
            css={{
                color: "red",
                margin: \`\$\{myValue > 0.5 ? 10 : 20\}px\`,
            }}
            style={{
                padding: 10,
                backgroundColor: "yellow",
            }}
            untouched
        >
            Text
        </div>
    );
};
`;

const testConditionalExpression = `
import React from "react";

const displayNewStyles = true;

export const MComponent = () => {
    return (
        <div
            css={{
                color: "red",
                backgroundColor: displayNewStyles ? "orange" : "transparent",
            }}
        >
            Text
        </div>
    );
};
`;

pluginTester({
  pluginName: "react-move-anonymous-inline-style-objects",
  plugin: reactMoveAnonymousInlineStyleObjects,
  snapshot: true,
  babelOptions: require("./babel.config.js"),
  tests: [
    { code: testTenaryAndLogicalExpression },
    { code: testSimple },
    { code: testConditionalExpression },
  ],
});
