import { Logic } from ".";

export default class InputLine<T = any> {
    private logicInterfaces: Logic<T>[] = [];
    private nowLogic: Logic = Logic.defaultLogic;
    private splitCmd: string[];
    private dataForSendInResult: T[] = [];

    /*
     * it variable give access to new logic switch for nowLogic
     */
    private accessToSwitch: boolean = true;

    constructor(public readonly cmd: string) {
        this.splitCmd = cmd.split(/\s+/g);
    }

    public addLogic(logic: Logic<T>) {
        this.logicInterfaces.push(logic);
    }

    public execute(): T[] {
        for (let cmd of this.splitCmd) {
            if (this.nowLogic.isCmd(cmd) && this.accessToSwitch) {
                // If found new logic with keywords, switch to new logic
                this.nowLogic = this.logicInterfaces.find((logic) =>
                    logic.isCmd(cmd)
                );

                // Disable access to switch
                this.disableAccessToSwitch();
            } else {
                this.accessToSwitch = this.nowLogic.fn(cmd);
                if (this.accessToSwitch) {
                    this.nowLogic = Logic.defaultLogic;
                }
            }
        }

        return this.dataForSendInResult;
    }

    public addDataToSendResult(data: T) {
        this.dataForSendInResult.push(data);
    }

    private disableAccessToSwitch() {
        this.accessToSwitch = false;
    }

    private enableAccessToSwitch() {
        this.accessToSwitch = true;
    }
}
