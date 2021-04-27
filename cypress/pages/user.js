import { Guid } from 'js-guid';

export default class User {

    constructor(url){
        this._url = url;
        // this._name = 'jk8gz1nc58e4bd3gbz1';
        // this._email = 'jk8gz1nc58e4bd3gbz1@maul.ru';
        // this._pass = 'jk8gz1nc58e4bd3gbz';
        this._createUser();
    }

    _createUser(){
        cy.visit(this._url + '/#/register');
        cy.wait(1000);
        this._name = Guid.newGuid().toString().substring(0,20);
        this._email = this._name + '@mail.ru';
        this._pass = this._name;
        cy.get('#username').type(this._name);
        cy.get('#email').type(this._email);
        cy.get('#password').type(this._pass);
        cy.get('#register-button').click();
        cy.wait(6000);
        this.logout();
    }

    login(){
        cy.visit(this._url + '/#/login');
        cy.wait(1000);
        cy.get('#email').type(this._email);
        cy.get('#password').type(this._pass);
        cy.get('#signin-button').click();
        cy.wait(6000);
    }

    logout(){
        cy.visit(this._url + '/#/settings');
        cy.wait(1000);
        cy.get('#logoutButton').click();
        cy.wait(6000);
    }

    getName(){
        return this._name;
    }

    getEmail(){
        return this._email;
    }

    getPass(){
        return this._pass;
    }
}