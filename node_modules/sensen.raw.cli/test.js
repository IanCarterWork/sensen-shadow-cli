

const { exec } = require('child_process');
const process = require('process')

const { default: SensenRawCli } = require('./libs')


const myCli = new SensenRawCli.Create({
    iD: 'my-test',
    Title: 'My CLI Test ',
    About: 'My CLI Manager',
    Execute(args){
        console.log('Execute CLI', args)
    },
})




myCli

    .Add(

        new SensenRawCli.Child({
            iD: '-create',
            Title: `Create's CLI`,
            About: `Run to create`,
            Execute(args){
                console.log('Execute Create', args)
            },
            Children: [

            ],
        }),
        
    )

    .Add(

        new SensenRawCli.Child({
            iD: '-delete',
            Title: `Delete's CLI`,
            About: `Run to delete`,
            Execute(args){
                // console.log('Execute Delete', args)
            },
            Children: [

            ],
        }),
        
    )

    .Add(

        new SensenRawCli.Child({
            iD: '-bind',
            Title: `Bond's CLI`,
            About: `Run to bind`,
            Execute(args){
                console.log('Execute Bind', args)
            },
            Children: [

                new SensenRawCli.Child({
                    iD: 'hello',
                    Title: `Hello's CLI`,
                    About: `Run to say Hello`,
                    Execute(args){
                        // console.log('//////////////\nSay Hello with', args)

                        // return `tsc -watch`
                        return `ls ./core`
                    },
                    Children: [
        
                        new SensenRawCli.Child({
                            iD: 'test',
                            Title: `Test's CLI`,
                            About: `Run to test`,
                            Execute(args){
                                // return `tsc -watch`
                                return `ls .`
                            },
                            Children: [
                
                            ]
                        }),
                        
                    ]
                }),
                
            ],
        }),
        
    )

    /** * Démarrage */
    .Run( SensenRawCli.Create.Args(process.argv, 2) )

;


// console.log('myCli is done')