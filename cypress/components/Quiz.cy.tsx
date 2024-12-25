import React from "react";
import Quiz from "../../client/src/components/Quiz.tsx";

describe("<Quiz />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Quiz />);
  });
});
