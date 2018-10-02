const expect = require("chai").expect;

function addTwoNumbers(x, y) {
  return x + y;
}

describe("addTwoNumbers()", () => {
  it("should add two numbers", () => {
    let x = 5;
    let y = 1;
    let sum1 = x + y;

    //Act
    const sum2 = addTwoNumbers(x, y);

    //assert
    expect(sum2).to.be.equal(sum1);
  });
});
