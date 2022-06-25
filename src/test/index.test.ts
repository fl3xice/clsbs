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

test("Someone logic is a cmd", () => {
    const inputLine = new InputLine<any>('CREATE DELETE "example"', {
        enableQoute: true,
    });

    inputLine.addLogic(
        new Logic(["create"], (data) => {
            if (inputLine.isSomeoneCmd(data)) {
                inputLine.throwError("Use another logic for this cmd");
                return true;
            } else {
                inputLine.addDataToSendResult(data);
                return true;
            }
        })
    );

    inputLine.addLogic(
        new Logic(["delete"], (data) => {
            inputLine.addDataToSendResult(data);
            return true;
        })
    );

    expect(inputLine.execute()).toEqual(["example"]);
    expect(inputLine.errors).toEqual(["Use another logic for this cmd"]);
});
