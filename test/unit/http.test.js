import { Http } from "../../app/http/http";
import configMock from "../../app/config";
import authenticationMock from "../../app/auth/authentication";
import routerHandlerMock from "../../app/router/router-handler";

'use strict';

jest.mock('../../app/config', () => ({
    config: {
        rest_url: ''
    }
}));

jest.mock('../../app/auth/authentication', () => ({
    Authentication: {
        instance: {
        }
    }
}));

jest.mock('../../app/router/router-handler', () => ({
    RouterHandler: {
        instance: {
        }
    }
}));

describe('http - unit test', () => {

    beforeEach(() => {
        Http.inst = null;
    });


    test("GET без аутентификации", () => {
        //Arrange
        expect.hasAssertions();

        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        };
        global.fetch = jest.fn();
        const http = new Http();

        //Act
        http.doGet("articles", false);

        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles", { headers: expectedHeaders });
    });


    test("GET с аутентификацией", () => {
        //Arrange
        expect.hasAssertions();

        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Token AUTH_TOKEN',
        };
        authenticationMock.Authentication.instance = { auth: { token: 'AUTH_TOKEN' } };
        global.fetch = jest.fn();
        const http = new Http();

        //Act
        http.doGet("articles", true);

        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles", { headers: expectedHeaders });
    });


    test("GET с аутентификацией без токена", () => {
        //Arrange
        expect.hasAssertions();

        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        };
        authenticationMock.Authentication.instance = { auth: undefined };
        global.fetch = jest.fn();
        const http = new Http();

        //Act
        http.doGet("articles", true);

        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles", { headers: expectedHeaders });
    });


    test("POST без аутентификации", () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        };
        const article = { text: 'Hi!' };
        global.fetch = jest.fn().mockReturnValueOnce({ then: jest.fn() });
        const http = new Http();
    
        //Act
        http.doPost("articles", article, false);
    
        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles",
                                                  { headers: expectedHeaders,
                                                    method: 'POST',
                                                    body: article });
      });


      test("POST с аутентификацией", () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Token AUTH_TOKEN',
        };
        authenticationMock.Authentication.instance = { auth: { token: 'AUTH_TOKEN' } };
        const article = { text: 'Hi!' };
        global.fetch = jest.fn().mockReturnValueOnce({ then: jest.fn() });
        const http = new Http();
    
        //Act
        http.doPost("articles", article, true);
    
        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles",
                                                  { headers: expectedHeaders,
                                                    method: 'POST',
                                                    body: article });
      });


      test("POST с аутентификацией без токена", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = 'https://test.ru/api/';
        authenticationMock.Authentication.instance = { auth: undefined };
        routerHandlerMock.RouterHandler.instance = { router: { navigate: jest.fn() } };
        const article = { text: 'Hi!' };
        global.fetch = jest.fn();
        const http = new Http();
    
        //Act
        const resultPromis = http.doPost("articles", article, true);
    
        //Assert
        expect(global.fetch).toHaveBeenCalledTimes(0);
        expect(routerHandlerMock.RouterHandler.instance.router.navigate).toHaveBeenCalledWith('#/login');
        await expect(resultPromis).rejects.toBe(undefined);
      });


      test("POST 401", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = 'https://test.ru/api/';
        const expectedHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Token AUTH_TOKEN',
        };
        authenticationMock.Authentication.instance = { auth: { token: 'AUTH_TOKEN' } };
        routerHandlerMock.RouterHandler.instance = { router: { navigate: jest.fn() } };
        const article = { text: 'Hi!' };
        global.fetch = jest.fn(() => Promise.resolve({ status: 401,
                                                       json: jest.fn() }));
        const http = new Http();
    
        //Act
        await http.doPost("articles", article, true);
    
        //Assert
        expect(global.fetch).toHaveBeenCalledWith("https://test.ru/api/articles",
                                                  { headers: expectedHeaders,
                                                    method: 'POST',
                                                    body: article });
        expect(routerHandlerMock.RouterHandler.instance.router.navigate).toHaveBeenCalledWith('#/login');
      });

})
