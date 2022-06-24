import { Logic, InputLine } from "../core/index";

test("Main Test of inputLine", () => {
    const inputLine = new InputLine<string>("CREATE foo DELETE");

    inputLine.addLogic(
        new Logic(["create"], (data) => {
            inputLine.addDataToSendResult("create > " + data);
            return true;
        })
    );

    inputLine.addLogic(
        new Logic(["Delete"], (data) => {
            inputLine.addDataToSendResult("delete > " + data);
            return true;
        })
    );

    expect(inputLine.execute()).toEqual(["create > foo"]);
});

test("Main Test of inputLine #2", () => {
    const inputLine = new InputLine<string>("CREATE foo DELETE foo");

    inputLine.addLogic(
        new Logic(["create"], (data) => {
            inputLine.addDataToSendResult("create > " + data);
            return true;
        })
    );

    inputLine.addLogic(
        new Logic(["Delete"], (data) => {
            inputLine.addDataToSendResult("delete > " + data);
            return true;
        })
    );

    expect(inputLine.execute()).toEqual(["create > foo", "delete > foo"]);
});

test("Main Test of inputLine #3", () => {
    const inputLine = new InputLine<any>('CREATE "example" DELETE "example"', {
        enableQoute: true,
    });

    inputLine.addLogic(
        new Logic(["create"], (data) => {
            inputLine.addDataToSendResult(data);
            return true;
        })
    );

    expect(inputLine.execute()).toEqual(["example"]);
});
