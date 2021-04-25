import { Http } from "../../app/http/http";
import configMock from "../../app/config";
import fetch from "node-fetch";

jest.mock("../../app/config", () => ({
    config: {
        rest_url: "",
    },
}));

global.fetch = fetch;

describe("http integration test", () => {

    beforeEach(() => {
        Http.inst = null;
    });


    test("GET список статей", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:3000/";
        const expectedArticle = { id: 1, text: "Тест" };
        const http = new Http();
    
        //Act
        const response = await http.doGet("articles", false);
    
        //Assert
        expect(response.status).toBe(200);
        const articles = await response.json();
        expect(articles).toEqual(expect.arrayContaining([expectedArticle]));
      });


      test("GET одна статья", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:3000/";
        const expectedArticle = { id: 1, text: "Тест" };
        const http = new Http();
    
        //Act
        const response = await http.doGet("articles/1", false);
    
        //Assert
        expect(response.status).toBe(200);
        const article = await response.json();
        expect(article).toEqual(expectedArticle);
      });


      test("GET 404", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:3000/";
        const http = new Http();
    
        //Act
        const response = await http.doGet("articles/999", false);
    
        //Assert
        expect(response.status).toBe(404);
        const article = await response.json();
        expect(article).toEqual({});
      });


      test("GET exception", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:4000/";
        const http = new Http();
    
        //Act
    
        //Assert
        await expect(() => http.doGet("articles", false)).rejects.toThrow(
          "request to http://localhost:4000/articles failed, reason: connect ECONNREFUSED 127.0.0.1:4000"
        );
      });


      test("POST article", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:3000/";
        const newArticle = { text: "Новый" };
        const http = new Http();
    
        //Act
        const response = await http.doPost(
          "articles",
          JSON.stringify(newArticle),
          false
        );
    
        //Assert
        expect(response.text).toBe(newArticle.text);
        expect(response.id).not.toBeUndefined();
      });


      test("POST 401", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:3000/";
        const newArticle = { text: "Новый" };
        const http = new Http();
    
        //Act
        const response = await http.doPost(
          "articles/777",
          JSON.stringify(newArticle),
          false
        );
    
        //Assert
        expect(response).toEqual({});
      });


      test("POST exception", async () => {
        //Arrange
        expect.hasAssertions();
    
        configMock.config.rest_url = "http://localhost:4000/";
        const newArticle = { text: "Новый" };
        const http = new Http();
    
        //Act
    
        //Assert
        await expect(() =>
          http.doPost("articles", JSON.stringify(newArticle), false)
        ).rejects.toThrow("request to http://localhost:4000/articles failed, reason: connect ECONNREFUSED 127.0.0.1:4000");
      });

})