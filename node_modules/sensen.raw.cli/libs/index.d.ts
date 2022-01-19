/// <reference types="node" />
import { ChildProcess } from "child_process";
export declare type TCliEmitter = {
    Begin?: (args?: string[]) => void;
    Stream?: (args?: string[], stream?: any) => void;
    Error?: (args?: any) => void;
    End?: (args?: string[]) => void;
};
export interface TCliProps {
    iD: string;
    Title: string;
    About?: string;
    Children?: CliChildProcess[];
    Execute: (args: string[]) => ChildProcess | void;
    Emit?: TCliEmitter;
}
declare class Create {
    Props: TCliProps;
    /**
     * CLI Properties
     * @param { CliProps } props
     */
    constructor(props: TCliProps);
    /**
     *
     * @param { string[] } args Tableau de chaines de caratères
     * @param { number } from Reduire le tableau à partir
     * @param { number } to Reduire le tableau jusqu'à
     * @returns { string[] }
     */
    static Args(args: string[], from?: number, to?: number): string[];
    Add(child: CliChildProcess): this;
    Find(args: string[], children: CliChildProcess[]): CliChildProcess | undefined;
    Run(args: string[]): this;
    ChildHelper(iD: string | null, children: CliChildProcess[]): this;
    Helper(): this;
}
declare class CliChildProcess {
    Props: TCliProps;
    /**
     * CLI Properties
     * @param { CliProps } props
     */
    constructor(props: TCliProps);
    Emit(emitter: keyof TCliEmitter, args?: any): this;
}
declare const SensenRawCli: {
    Props: TCliProps;
    Create: typeof Create;
    Child: typeof CliChildProcess;
    $Console: {
        Parse(args: any[], foreColor: string, bgColor: string): any[];
        Log(...args: any[]): any;
        Notice(...args: any[]): any;
        Success(...args: any[]): any;
        Warning(...args: any[]): any;
        Error(...args: any[]): any;
        Message(...args: any[]): any;
        Lite(...args: any[]): any;
    };
};
export default SensenRawCli;
//# sourceMappingURL=index.d.ts.map