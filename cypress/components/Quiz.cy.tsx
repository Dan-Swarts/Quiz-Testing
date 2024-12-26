import React from "react";
import { questionSet1, questionSet2, shortQuiz } from "../questions.js";
import Quiz from "../../client/src/components/Quiz.tsx";

describe("<Quiz />", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", questionSet1);
  });

  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Quiz />);
  });

  it("sets the quizStarted state variables to false before quiz started", () => {
    // mount the quiz component
    cy.mount(<Quiz />);

    // when !quizStarted, this shouldn't give an error
    // (see the component in the client/src/components folder)
    cy.get(".btn-primary").should("have.text", "Start Quiz");
  });

  it("renders correctly when quistions.length is 0", () => {
    // mount the quiz component
    cy.mount(<Quiz />);

    // passes an empty array to the api call
    cy.intercept("GET", "/api/questions/random", []);

    // start the quiz
    cy.get(".btn-primary").click();

    // this shouldn't give an error if quiestions.length is 0
    // (see the component in the client/src/components folder)
    cy.get(".visually-hidden").should("have.text", "Loading...");
  });

  it("renders correctly when the quiz has started", () => {
    cy.mount(<Quiz />);

    // start the quiz
    cy.get(".btn-primary").click();

    // checks for the correct rendering
    // (see the component in the client/src/components folder)
    cy.get(".alert-secondary");
  });

  it("presents 4 multiple choice options", () => {
    cy.mount(<Quiz />);

    // start the quiz
    cy.get(".btn-primary").click();

    // checks for 4 options
    cy.get(".alert-secondary").should("have.length", 4);
  });

  it("presents the correct multiple choice index", () => {
    cy.mount(<Quiz />);

    // start the quiz
    cy.get(".btn-primary").click();

    // checks for the correct rendering
    for (let i = 0; i < 3; i++) {
      cy.get(".btn-primary")
        .eq(i)
        .should("have.text", i + 1);
    }
  });

  it("correctly updates 'quizCompleted' boolean", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < questionSet1.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // check for correct rendering
    // (see the component in the client/src/components folder)
    cy.get(".btn-primary").should("have.text", "Take New Quiz");
  });

  it("works correctly on a 1-question quiz", () => {
    cy.mount(<Quiz />);

    const question = [
      {
        question: "What is the output of 'hello' + 'world'?",
        answers: [
          { text: "hello world", isCorrect: false },
          { text: "helloworld", isCorrect: true },
          { text: "hello+world", isCorrect: false },
          { text: "hello world!", isCorrect: false },
        ],
      },
    ];
    cy.intercept("GET", "/api/questions/random", question);
    cy.get(".btn-primary").click();
    cy.get(".btn-primary").eq(0).click();
    cy.get(".btn-primary").should("have.text", "Take New Quiz");
  });

  it("correct usage of score state variable", () => {
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

    // select the next quiz
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < questionSet1.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }
  });
});

describe("Second-order Quiz tests", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", shortQuiz);
  });

  it("sets the quizStarted state variables to false before quiz started", () => {
    // mount the quiz component
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < questionSet1.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }
  });

  it("renders correctly when quistions.length is 0", () => {
    // mount the quiz component
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // passes an empty array to the api call
    cy.intercept("GET", "/api/questions/random", []);

    // select the next quiz
    cy.get(".btn-primary").click();

    // this shouldn't give an error if quiestions.length is 0
    // (see the component in the client/src/components folder)
    cy.get(".visually-hidden").should("have.text", "Loading...");
  });

  it("renders correctly when the quiz has started", () => {
    cy.mount(<Quiz />);

    // start the quiz
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // checks for the correct rendering
    // (see the component in the client/src/components folder)
    cy.get(".alert-secondary");
  });

  it("presents 4 multiple choice options", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // checks for 4 options
    cy.get(".alert-secondary").should("have.length", 4);
  });

  it("presents the correct multiple choice index", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // checks for the correct rendering
    for (let i = 0; i < 3; i++) {
      cy.get(".btn-primary")
        .eq(i)
        .should("have.text", i + 1);
    }
  });

  it("correctly updates 'quizCompleted' boolean", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // check for correct rendering
    // (see the component in the client/src/components folder)
    cy.get(".btn-primary").should("have.text", "Take New Quiz");
  });

  it("correct usage of score state variable", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    let score = 0;
    shortQuiz.forEach((question) => {
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
      `Your score: ${score}/${shortQuiz.length}`
    );
  });

  it("lets you take a third quiz", () => {
    cy.mount(<Quiz />);
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }

    // next quiz
    cy.get(".btn-primary").click();

    // skip to the end of the quiz
    for (let i = 0; i < shortQuiz.length; i++) {
      cy.get(".btn-primary").eq(0).click();
    }
  });
});
