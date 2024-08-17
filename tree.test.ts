import { expect, test } from "bun:test";
import { b } from ".";

test("shoudl build correct tree only with root", () => {
  expect(b.Node("ROOT").build()).toEqual({ ROOT: {} });
});

test("should build correct tree with node and params", () => {
  expect(
    b
      .Node("ROOT")
      .addParam("rootParam", 42 as const)
      .addNode(b.Node("NODE").addParam("nodeParam", 13 as const))
      .build(),
  ).toEqual({
    ROOT: {
      rootParam: 42,
      NODE: {
        nodeParam: 13,
      },
    },
  });
});
