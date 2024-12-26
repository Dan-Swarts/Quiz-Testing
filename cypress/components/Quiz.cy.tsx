import React from "react";
import { questionSet1, questionSet2 } from "../questions.js";
import Quiz from "../../client/src/components/Quiz.tsx";

describe("<Quiz />", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", questionSet1);
  });

  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Quiz />);
  });

  it("shows the first question when clicking on the 'start quiz' button", () => {
    // mount the quiz component
    cy.mount(<Quiz />);
    // click on 'start quiz'
    cy.get(".btn-primary").click();
    // check for the correct value
    const questionText = questionSet1[0].question;
    cy.get(".card h2").should("have.text", questionText);
  });

  it("shows the multiple choice options when clicking on the 'start quiz' button", () => {
    // mount the quiz component
    cy.mount(<Quiz />);
    // click on 'start quiz'
    cy.get(".btn-primary").click();

    // iterates though the multiple choice options for the first question:
    questionSet1[0].answers.forEach((value, index) => {
      // check for the correct value
      cy.get(".d-flex .alert-secondary")
        .eq(index)
        .should("have.text", value.text);
    });
  });

  it("shows all questions thoughout the quiz", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();
    // iterates though the questions:
    questionSet1.forEach((value) => {
      // check for the correct value
      cy.get(".card h2").should("have.text", value.question);
      // click onto the next question
      cy.get(".btn-primary").eq(0).click();
    });
  });

  it("shows all multiple choice options thoughout the quiz", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();
    // iterates though the questions:
    questionSet1.forEach((value) => {
      // iterates though the multiple choice options for each question:
      value.answers.forEach((value, index) => {
        // check for the correct value
        cy.get(".d-flex .alert-secondary")
          .eq(index)
          .should("have.text", value.text);
      });
      // click onto the next question
      cy.get(".btn-primary").eq(0).click();
    });
  });

  it("shows your score at the end of a quiz", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < questionSet1.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // check for the "quiz completed" button
    cy.get(".card h2").should("have.text", "Quiz Completed");
    // check for the "your score" button
    cy.get(".alert-success").should("include.text", "Your score:");
  });

  it("gives the correct score", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    let score = 0;
    questionSet1.forEach((question) => {
      // select a random value from the multiple choice options
      let randomIndex = Math.floor(Math.random() * 4);
      cy.get(".btn-primary").eq(randomIndex).click();
      // check to see if the answer is actually correct
      if (question.answers[randomIndex].isCorrect) {
        score += 1;
      }
    });

    // check to see if the score tally is correct
    cy.get(".alert-success").should(
      "have.text",
      `Your score: ${score}/${questionSet1.length}`
    );
  });

  it("lets you take a second quiz", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < questionSet1.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // check for the "take new quiz" button
    cy.get(".btn-primary").should("have.text", "Take New Quiz");

    // replace API results with the second question set
    cy.intercept("GET", "/api/questions/random", questionSet2);

    // select the next quiz
    cy.get(".btn-primary").click();

    let score = 0;
    questionSet2.forEach((question) => {
      // select a random value from the multiple choice options
      let randomIndex = Math.floor(Math.random() * 4);
      cy.get(".btn-primary").eq(randomIndex).click();
      // check to see if the answer is actually correct
      if (question.answers[randomIndex].isCorrect) {
        score += 1;
      }
    });

    // check to see if the score tally is correct
    cy.get(".alert-success").should(
      "have.text",
      `Your score: ${score}/${questionSet2.length}`
    );
    // check for the "quiz completed" button
    cy.get(".card h2").should("have.text", "Quiz Completed");

    // check for the "your score" button
    cy.get(".alert-success").should("include.text", "Your score:");

    // check for the "take new quiz" button
    cy.get(".btn-primary").should("have.text", "Take New Quiz");
  });
});
