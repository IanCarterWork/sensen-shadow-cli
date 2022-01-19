
import { exec, ChildProcess, ExecException } from "child_process";




export type TCliEmitter = {

    Begin?: (args?: string[]) => void;

    Stream?: (args?: string[], stream?: any) => void;

    Error?: (args?: any) => void;

    End?: (args?: string[]) => void;
    
}




export interface TCliProps{

    iD: string;
    
    Title: string;
    
    About?: string;
    
    Children?: CliChildProcess[];

    Execute: (args: string[]) => ChildProcess | void;

    Emit?: TCliEmitter
    
}



const Kernel = {

    Version: 1,

    VersionName: 'Raw CLI',

    VersionString: '0.0.1',
    
}





const $Console = {

    Parse(args: any[], foreColor: string, bgColor: string){

        const a: any[] = []

        if(args.length){

            for (let x = 0; x < args.length; x++) {

                if(typeof args[x] == 'string' && x === 0){ a.push("\x1b[0m"), a.push(bgColor || ""), a.push(foreColor || "\x1b[37m"); }

                a.push(args[x])
                
                if(typeof args[x] == 'string' && x === 0){ a.push("\x1b[0m"); }

            }

            a.push("\x1b[0m")

        }

        return a

    },

    Log(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[37m", "\x1b[40m"))

        return this;

    },

    Notice(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[37m", "\x1b[44m"))
           
        return this;

    },

    Success(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[37m", "\x1b[42m"))
           
        return this;

    },

    Warning(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[30m", "\x1b[43m"))
           
        return this;

    },

    Error(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[37m", "\x1b[41m"))
           
        return this;

    },

    Message(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[30m", "\x1b[47m"))
           
        return this;

    },

    Lite(...args: any[]){

        console.log.apply(this, this.Parse(args||[], "\x1b[39m", ""))
           
        return this;

    },

    
}





class Create{

    Props: TCliProps

    /**
     * CLI Properties
     * @param { CliProps } props 
     */
    constructor(props: TCliProps){

        this.Props = props;

        this.Props.Children = this.Props.Children || [];

    }



    /**
     * 
     * @param { string[] } args Tableau de chaines de caratères
     * @param { number } from Reduire le tableau à partir
     * @param { number } to Reduire le tableau jusqu'à
     * @returns { string[] }
     */
    static Args(args: string[], from?: number, to?: number){

        const out : string[] = []

        from = from || 0;
        
        to = to || args.length;


        from = from < 1 ? 0 : from;

        to = to > args.length ? args.length : to;


        for (let x = (from); x < args.length; x++) { out.push( args[x] ); }
        
        return out;
        
    }
    


    Add(child: CliChildProcess){

        this.Props.Children?.push( child )

        return this;

    }
    



    Find(args: string[], children: CliChildProcess[]){

        let found : CliChildProcess | undefined;


        if(Array.isArray(children||'')){

            const iD = args[0]

            children.map(child=>{

                if(iD == child.Props.iD){

                    child.Props.Emit = (typeof child.Props.Emit == 'object') ? child.Props.Emit : {};

                    const arg = Create.Args(args, 1);


                    /** * Execution */
                    if(typeof child.Props.Execute == 'function'){


                        child.Emit('Begin', [arg])
                    
                        const cmd = child.Props.Execute( arg )

                        if(typeof cmd == 'string' || cmd instanceof ChildProcess){

                            child.Emit('Stream', [arg, cmd])


                            const stream = exec(`${ cmd instanceof ChildProcess ? cmd.spawnargs : cmd }`, (err: ExecException | null, stdout: string, stderr: string)=>{

                                if(err){

                                    console.log(`Error :\n`, stderr)
                                    
                                    child.Emit('Error', [arg])

                                    return;

                                }

                                child.Emit('End', [arg])


                                this.Find(arg, child.Props.Children||[]);

                            })


                            stream.stdout?.on('data', (chunk)=>{ console.log(chunk); })

                            return;

                        }
                            
                        child.Emit('End', [arg])
                    
                        found = this.Find(arg, child.Props.Children||[]) || child;

                    }
                    
                    else{

                        if(child.Props.Children){

                            found = this.Find(arg, child.Props.Children||[]) || child;

                        }

                        else{

                            found = child;
                            
                        }


                    }



                }

                
            })
            
        }
        

        return found;
        
    }
    
    


    Run(args: string[]){

        $Console.Message(`Sensen ${ Kernel.VersionName }, verion ${ Kernel.Version }/${ Kernel.VersionString }`, `$`, `${ this.Props.iD } ${ args.join(' ') }`)

        if(!this.Find(args, this.Props.Children || [])){

            $Console.Notice(`Commands Helper`, `Command's Available`)

            if(typeof this.Props.Execute == 'function'){

                this.Props.Execute( Create.Args(args, 1) )
                
            }

            this.Helper()

        }
        
        return this;

    }




    ChildHelper(iD: string | null, children: CliChildProcess[]){

        if( children ){

            if( children.length ){

                children.map(child=>{

                    $Console.Message(`$ ${ iD ? `${ iD } ` : '' }${ child.Props.iD }`, `${ child.Props.Title } ${ (child.Props.About) ? `, ${ child.Props.About }` : '' }`)

                    this.ChildHelper(`${ iD ? `${ iD } ` : '' }${ child.Props.iD }`, child.Props.Children || [])
                    
                })
                
            }
            
        }

        return this;
        
    }
    
    


    Helper(){

        this.ChildHelper(this.Props.iD, this.Props.Children || [] )

        return this;
        
    }
    
    
    
    
}




class CliChildProcess{

    Props: TCliProps

    /**
     * CLI Properties
     * @param { CliProps } props 
     */
    constructor(props: TCliProps){

        this.Props = props;
        
    }


    Emit(emitter: keyof TCliEmitter, args?: any ){

        if(typeof this.Props.Emit == 'object'){ 

            if(typeof this.Props.Emit[emitter] == 'function'){ 
                
                this.Props.Emit[emitter]?.apply(this, args ); 

            }

        }

        return this;

    }
    
    
}




const CliProps : TCliProps = {

    /**
     * @type { string }
     */
    iD: '',
    
    /**
     * @type { string }
     */
    Title: '',
    
    /**
     * @type { string }
     */
    About: '',
    
    /**
     * @type { Array<CliChildProcess> }
     */
    Children: [],
    
    /**
     * @type { (args: string[]) => ChildProcess | void }
     */
    Execute: (args=>{}),

    /**
     * 
     */
    Emit: {
    
        /**
         * @type { (args: string[]) => void }
         */
        Begin: (args=>null),
    
        /**
         * @type { (args: string[]) => void }
         */
        Stream: ((args, stream)=>null),

        /**
         * @type { (args: any) => void }
         */
        Error: (args=>null),

        /**
         * @type { (args: string[]) => void }
         */
        End: (args=>null),
        
    }
    

}




const SensenRawCli = {
    
    Props: CliProps,
    
    Create,

    Child: CliChildProcess,

    $Console,

}



export default SensenRawCli