/// <reference types="cypress" />

import User from "../pages/user";

context("Settings", () => {

  const url = "http://localhost:8080";
  let user;

  before(() => {
    user = new User(url);
  });

  beforeEach(() => {
    user.login();
    cy.visit(url + "/#/settings");
    cy.wait(1000);
  });

  afterEach(() => {
    user.logout();
  });

  it('Обновить "Обо мне"', () => {
    cy.get("#user-bio").should("have.value", "");
    cy.get("#user-bio").type("Тест");
    cy.get("#update-button").click();
    cy.wait(6000);
    cy.visit(url + "/#/settings");
    cy.wait(1000);
    cy.get("#user-bio").should("have.value", "Тест");
  });

  it("Ошибка при обновлении имени", () => {
    cy.get("#username").should("have.value", user.getName());
    cy.get("#username").clear().type("123456789012345678901");
    cy.get("#update-button").click();
    cy.wait(6000);
    cy.get(".error-messages > li").should(
      "contain.text",
      "username is too long (maximum is 20 characters)"
    );
  });

  it("Отмена обновления", () => {
    cy.get("#user-bio").clear().type("abracadabra");
    cy.get("#user-bio").should("have.value", "abracadabra");
    cy.get(":nth-child(1) > .nav-link").click();
    cy.wait(6000);
    cy.visit(url + "/#/settings");
    cy.wait(1000);
    cy.get("#user-bio").should("not.have.value", "abracadabra");
  });
});
