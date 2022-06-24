import { defaultInputLineOptions, InputLineOptions, Logic } from ".";

export default class InputLine<T = any> {
    private logicInterfaces: Logic<T>[] = [];
    private nowLogic: Logic = Logic.defaultLogic;
    private splittedCmd: string[];
    private dataForSendInResult: T[] = [];

    /*
     * it variable give access to new logic switch for nowLogic
     */
    private accessToSwitch: boolean = true;

    constructor(
        public readonly cmd: string,
        public readonly options: InputLineOptions = defaultInputLineOptions
    ) {
        this.splitCmd();
    }

    private splitCmd() {
        if (this.options.enableQoute) {
            this.splittedCmd = this.cmd.split(/"([^"]*)"/);
        } else {
            this.splittedCmd = this.cmd.split(/\s+/g);
        }

        this.splittedCmd = this.splittedCmd
            .map((item) => item.trim())
            .filter((cmd) => cmd !== "");
    }

    public addLogic(logic: Logic<T>) {
        this.logicInterfaces.push(logic);
    }

    public execute(): T[] {
        for (let cmd of this.splittedCmd) {
            if (this.nowLogic.isCmd(cmd) && this.accessToSwitch) {
                // If found new logic with keywords, switch to new logic
                this.nowLogic = this.logicInterfaces.find((logic) =>
                    logic.isCmd(cmd)
                );

                if (this.nowLogic === undefined) {
                    this.nowLogic = Logic.defaultLogic;
                } else {
                    // Disable access to switch
                    this.disableAccessToSwitch();
                }
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
