let expect = require("chai").expect;
let request = require("request");

describe("Status and content", () => {
  describe("Status", function () {
    // This test expects the status code of the url to be equal to 200
    it("status", (done) => {
      request("http://localhost:8080", (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    // This test expects the body to be in a string format
    it("content", (done) => {
      request("http://localhost:8080", (error, response, body) => {
        expect(body).to.be.a("string");
        done();
      });
    });
  });
});
