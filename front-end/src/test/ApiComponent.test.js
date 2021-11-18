import React from "react";
// Here I import the test module
import renderer from "react-test-renderer";
// Here I import the component
import ApiComponent from "../Components/ApiComponent";

// This test takes a snapshot of the imported component
test("renders correctly", () => {
  const tree = renderer.create(<ApiComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
