export type LogicFunction = (data: string) => boolean;
export default class Logic<T = any> {
    private isLogicWorkForAnything: boolean = false;

    constructor(
        private cmdKeywords: string[],
        public readonly fn: LogicFunction
    ) {
        if (cmdKeywords.length === 0) {
            this.isLogicWorkForAnything = true;
        }
    }

    public static defaultLogic: Logic = new Logic([], () => {
        return true;
    });

    public isCmd(keyword: string): boolean {
        if (this.isLogicWorkForAnything) {
            return true;
        }
        return this.cmdKeywords.some((_keyword) =>
            _keyword.toLowerCase().includes(keyword.toLowerCase())
        );
    }
}
