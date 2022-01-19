
/**
 * Requires
 */

require = require('esm')(module /*, options*/);

const { exec } = require('child_process');

const fs = require('fs');

const fse = require('fs-extra');

const path = require('path');

const rimraf = require("rimraf");




/**
 * Sensen Dependencies
 */
// const ProjectManager = require('./project.js')

const ThemeManager = require('./Theme.js')

const RouterManager = require('./Router.js')

const ViewManager = require('./View.js')

const BuildProjectDependencies = require('./BuildProjectDependencies.js')

const Deploy = require('./Deploy.js')

const CreateProject = require('./CreateProject.js')

const ProgressBar = require('./ProgressBar.js')

const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js')

const ScanDirectory = require('./ScanDirectory');

const GetRawFile = require('./GetRawFile');

const SetRawFile = require('./SetRawFile');

const { Grafts } = require('./Grafts.js');

const { default: SensenRawCli } = require('sensen.raw.cli');






/**
 * Sensen Kernel
 */
const Kernel = {
    
    Version: 1,
    
    VersionString: '0.0.1',

    VersionName: 'Senju',

    Resposites:{

        Repo: `https://github.com/IanCarterWork`,

        Raw: `https://raw.githubusercontent.com/IanCarterWork`,

        Default: {

            URL: `https://github.com/IanCarterWork/sensen-shadow-project.git`

        },

        CSSGraft: {

            Git: `/sensen-css-graft`

        },

        JSGraft: {

            Git: `/sensen-js-graft`

        },
        
    },


    Paths:{

        CacheDownloaded: '/.downloaded',

        /**
         * Check if String is URL
         * @param { string } input 
         * @returns 
         */
        isURL(input){
            var res = (input||'').match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return (res !== null)
            
        }
        
    },







    /**
     * 
     * @param {{
     *      url: string,
     *      encoding?: string,
     *      start: (request: ClientRequest, total: number) => void,
     *      progress: (level: {length: number, total: number, purcent: number}) => void,
     *      done: (body: Array<string>) => void,
     *      fail: (e: Error) => void,
     * }} props 
     * @returns 
     */
    Downloader({url, start, progress, done, fail, encoding}){

        const https = require('https');

        const request = https.get(url, function(response) {

            if(encoding){ response.setEncoding(encoding); }

            const level = { purcent: 0, length: 0, total: 0 };

            const len = parseInt(response.headers['content-length'], 10);

            
            let body = [];
            
            let cur = 0;
            
            level.total = len / 1048576;

            if(typeof start == 'function'){ start(request, level.total); }

            response.on("data", function(chunk) {
           
                body.push( chunk );
           
                cur += chunk.length;

                level.purcent = (100.0 * cur / len);

                level.length = (cur / 1048576);
           
                if(typeof progress == 'function'){ progress(level) }
           
            });


            response.on("end", ()=>{

                if(typeof done == 'function'){ done(body); }
           
            });


            request.on("error", (e)=>{
           
                console.log("Error: ", e);
           
                if(typeof fail == 'function'){ fail(body); }
           
            });


        }); 


        return request;

    }


}









/**
 * Sensen Command Exectutor
 * @param { string[] } Process arguments
 * @returns { SensenCli }
 */
const Command = function(args){




    /**
     * Create Project
     */
    const $Create = (new SensenRawCli.Child({
         
        iD: 'create', Title: 'Créer Projet', About: 'un nouveau projet sensen',

        Execute(args){

            SensenRawCli.$Console.Message(`Démarrage`, `${ this.About }`);

            const name = args[0] || null;
            
            if(name){

                const template = args[1] || 'Default';

                if(template){

                    CreateProject(name, template)

                        .then(()=>{

                            SensenRawCli.$Console.Success('Fait', 'Le project est prêt')
                            
                        })

                        .catch(err=>{

                            SensenRawCli.$Console.Error('Erreur', 'Echec lors de creation')
                            
                            console.error(err)

                        })
                    
                }

                else{

                    SensenRawCli.$Console.Error('Template Erreur', `Ce template < ${ template } > est introuvable`)
                
                }

                
            }

            else{

                SensenRawCli.$Console.Error('Project Manager', 'Veuillez indiquer le nom de votre projet')
                
            }

        },
    }))




    /**
     * Gestionnaire de thème
     */
    const $Theme = (new SensenRawCli.Child({
         
        iD: 'theme', Title: 'Thème', About: 'Gestionnaire de thème',

        Execute(args){

            SensenRawCli.$Console.Notice(`Module`, `Gestionnaire de thème`)

        },

        Children:[


            /**
             * Crée un thème
             */
            new SensenRawCli.Child({

                iD: '-create', Title:`Création d'un thème`, About:`Un nouveau thème dans votre projet`,

                Execute([ theme, ]){

                    if(theme){ ThemeManager('-create', theme); }

                    else{ SensenRawCli.$Console.Error(`Erreur`, `Aucun thème indiqué`) }

                }
                
            }),


            


            /**
             * Crée un artéfact de thème
             */
            new SensenRawCli.Child({

                iD: '-artifact', Title:`Création d'un artéfact de thème`, About:`Un nouvel artéfact de thème`,

                Execute(args){

                    if(args[0]){ 

                        ThemeManager('-artifact', args[0], SensenRawCli.Create.Args(args, 1)); 
                        
                    }

                    else{ SensenRawCli.$Console.Error(`Erreur`, `Aucun thème indiqué`) }

                    
                }
                
            }),


            


            /**
             * Crée un artéfact de thème
             */
            new SensenRawCli.Child({

                iD: '-bind', Title:`Lier un thème et/ou des artefacts`, About:`Créer une liaison pour la construction`,

                Execute(args){

                    if(args[0]){ 

                        const artifacts = SensenRawCli.Create.Args(args, 1)

                        ThemeManager('-bind', args[0], (artifacts.length ? artifacts : false) || args[1] || '*'); 
                        
                    }

                    else{ SensenRawCli.$Console.Error(`Erreur`, `Aucun thème indiqué`) }

                    
                }
                
            }),


            


            /**
             * Nettoyer les liaisons
             */
            new SensenRawCli.Child({

                iD: '-clean:bound', Title:`Nettoyer les liaisons`, About:``,

                Execute(args){

                    ThemeManager('-clean:bound', args[0], SensenRawCli.Create.Args(args, 1)); 
                       
                }
                
            }),


            


            /**
             * Construction du bundle
             */
            new SensenRawCli.Child({

                iD: '-build', Title:`Construction du bundle à partir des liaisons`, About:``,

                Execute(args){

                    ThemeManager('-build', args[0], SensenRawCli.Create.Args(args, 1)); 
                       
                }
                
            }),


            


            /**
             * Construction du bundle
             */
            new SensenRawCli.Child({

                iD: '-build', Title:`Construction du bundle à partir des liaisons`, About:``,

                Execute(args){

                    ThemeManager('-build', args[0], SensenRawCli.Create.Args(args, 1)); 
                       
                }
                
            }),

            
        ]
        
    }))








    /**
     * Gestionnaire de vues
     */
     const $View = (new SensenRawCli.Child({
         
        iD: 'view', Title: 'Vue', About: 'Gestionnaire de vues',

        Execute(args){

            SensenRawCli.$Console.Notice(`Module`,`Gestionnaire de vues`)

        },

        Children:[


            


            /**
             * Création d'une vue
             */
             new SensenRawCli.Child({

                iD: '-create', Title:`Creation de vues`, About:`Un nouvelle vue dans le project`,

                Execute([view, route]){

                    if(view){

                        ViewManager('-create', view, route); 

                    }

                    else{

                        SensenRawCli.$Console.Error(`Erreur`, `Aucune vue indiqué`)
                        
                    }
                       
                }
                
            }),




        ]

    }))







    

    /**
     * Gestionnaire de route
     */
     const $Router = (new SensenRawCli.Child({
         
        iD: 'route', Title: 'Vue', About: 'Gestionnaire de vues',

        Execute(args){

            SensenRawCli.$Console.Notice(`Module`,`Gestionnaire de vues`)

        },

        Children:[


            


            /**
             * Definition du point d'entré de l'application
             */
             new SensenRawCli.Child({

                iD: '-default:view', Title:`Definition du point d'entré`, About:`Vue par defaut`,

                Execute([view]){

                    if(view){

                        RouterManager('-default:view', view); 

                    }

                    else{

                        SensenRawCli.$Console.Error(`Erreur`)
                        
                    }
                       
                }
                
            }),


            


            /**
             * Liaison d'une vue au router
             */
             new SensenRawCli.Child({

                iD: '--bind:view', Title:`Liaison au router`, About:`ajouter une vue`,

                Execute(args){

                    if(args.length){

                        RouterManager('-bind:view', args); 

                    }

                    else{

                        SensenRawCli.$Console.Error(`Erreur`)
                        
                    }
                       
                }
                
            }),


            


            /**
             * Liaison d'une vue au router
             */
             new SensenRawCli.Child({

                iD: '-unbind:view', Title:`Liaison au router`, About:`supprimer une vue`,

                Execute(args){

                    if(args.length){

                        RouterManager('-unbind:view', args); 

                    }

                    else{

                        SensenRawCli.$Console.Error(`Erreur`)
                        
                    }
                       
                }
                
            }),


            


            /**
             * Liaison d'une vue au router
             */
             new SensenRawCli.Child({

                iD: '-bound', Title:`Liaison au router`, About:`Lister toutes les liaisons`,

                Execute(args){

                    if(args.length){

                        RouterManager('-bound', args); 

                    }

                    else{

                        SensenRawCli.$Console.Error(`Erreur`)
                        
                    }
                       
                }
                
            }),


            


            /**
             * Liaison d'une vue au router
             */
             new SensenRawCli.Child({

                iD: '-purge', Title:`Nettoyage le router`, About:`Supprime toutes les vues qui n'existe plus`,

                Execute(args){

                    RouterManager('-purge', args); 

                       
                }
                
            }),


            


            /**
             * Liaison d'une vue au router
             */
             new SensenRawCli.Child({

                iD: '-clean', Title:`Nettoyage le router`, About:`Supprime toutes les vues sans exception`,

                Execute(args){

                    RouterManager('-clean', args); 

                }
                
            }),


            


            /**
             * Construire une vue dans le router
             */
             new SensenRawCli.Child({

                iD: '-build:index', Title:`Construction du router`, About:`Construire une vue dans le router`,

                Execute(args){

                    RouterManager('-build:index', args); 

                }
                
            }),


            


            /**
             * Construire une vue dans le router
             */
             new SensenRawCli.Child({

                iD: '-build', Title:`Construction du router`, About:`Construire les routes`,

                Execute(args){

                    RouterManager('-build', args); 

                }
                
            }),






        ]

    }))









    /**
     * Gestionnaire de route
     */
        const $Graft = (new SensenRawCli.Child({
            
        iD: 'graft', Title: 'Grèffes', About: 'Gestionnaire de greffons',

        Execute(args){

            SensenRawCli.$Console.Notice(`Module`,`${ this.About }`)

        },

        Children:[


            


            /**
             * Faire un grèffes CSS
             */
             new SensenRawCli.Child({

                iD: 'css', Title:`Faire une grèffe CSS`, About:`Ajout de grèffes`,

                Execute(args){

                    SensenRawCli.$Console.Notice(`Sous-Module`,`${ this.About }`)

                },

                Children:[


                    new SensenRawCli.Child({

                        iD: '-add', Title:`Construction de grèffe`, About:`Ajout de grèffes`,

                        Execute(args){

                            GraftsManager('-add', args); 

                        },

                    }),


                    new SensenRawCli.Child({

                        iD: '-remove', Title:`Déstruction de grèffe`, About:`Supprèssion de grèffes`,

                        Execute(args){

                            GraftsManager('-remove', args); 

                        },

                    }),

                    
                ]
                
            }),



            


            /**
             * Faire un grèffes JS
             */
             new SensenRawCli.Child({

                iD: 'js', Title:`Faire une grèffe JS`, About:`Ajout de grèffes`,

                Execute(args){

                    SensenRawCli.$Console.Notice(`Sous-Module`,`${ this.About }`)

                },

                Children:[


                    new SensenRawCli.Child({

                        iD: '-add', Title:`Construction de grèffe`, About:`Ajout de grèffes`,

                        Execute(args){

                            GraftsManager('-add', args); 

                        },

                    }),


                    new SensenRawCli.Child({

                        iD: '-remove', Title:`Déstruction de grèffe`, About:`Supprèssion de grèffes`,

                        Execute(args){

                            GraftsManager('-remove', args); 

                        },

                    }),

                    
                ]
                
            }),


            



        ]

    }))










    /**
     * Mise à niveau
     */
        const $Upgrader = (new SensenRawCli.Child({
            
        iD: 'upgrade', Title: 'Mise à niveau', About: '',

        Execute(args){

            SensenRawCli.$Console.Notice(`Module`,`${ this.Title }`)

        },

        Children:[


            


            /**
             * Mise à niveau du noyau
             */
             new SensenRawCli.Child({

                iD: '--core', Title:`Mise à niveau`, About:`Noyau`,

                Execute(args){

                    return `yarn add sensen-hinata`

                },

                Emit:{

                    Begin(args){

                        SensenRawCli.$Console.Notice( `Mise à niveau` , 'Noyau Sensen' )

                    },
                    
                    Error(args){

                        SensenRawCli.$Console.Error( `Erreur`, `Impossible de terminer l'opération` )

                        console.log(err)

                    },
                    
                    End(args){
                        
                        SensenRawCli.$Console.Success( `Succès` , 'Mise à jour terminé' )

                    },
                    
                }

            }),


            


            /**
             * Mise à niveau du noyau
             */
             new SensenRawCli.Child({

                iD: '--cli', Title:`Mise à niveau`, About:`CLI`,

                Execute(args){

                    return `yarn add sensen`

                },

                Emit:{

                    Begin(args){

                        SensenRawCli.$Console.Notice( `Mise à niveau` , 'Ligne Commandes Sensen' )

                    },
                    
                    Error(args){

                        SensenRawCli.$Console.Error( `Erreur`, `Impossible de terminer l'opération` )

                        console.log(err)

                    },
                    
                    End(args){
                        
                        SensenRawCli.$Console.Success( `Succès` , 'Mise à jour terminé' )

                    },
                    
                }


            }),


            



        ]

    }))










    /**
     * Montage
     */
    const $Mount = (new SensenRawCli.Child({
            
        iD: '--mount', Title: 'Mise à niveau', About: '',

        Execute(args){

            return `yarn mount`

        },

        Emit:{

            Begin(args){

                SensenRawCli.$Console.Notice( `Montage` , 'Bundle' )

            },
            
            Error(args){

                SensenRawCli.$Console.Error( `Erreur`, `Impossible de terminer l'opération` )

                console.log(err)

            },
            
            End(args){
                
                SensenRawCli.$Console.Notice( `Succès` , 'Construction terminé' )

            },
            
        }


    }))












    /**
     * COmpilation automatique
     */
    const $Serve = (new SensenRawCli.Child({
            
        iD: '--serve', Title: 'Mise à niveau', About: '',

        Execute(args){

            return `yarn serve`

        },

        Emit:{

            Begin(args){

                SensenRawCli.$Console.Notice( `Compilation` , 'Automatique du Bundle' )

            },
            
            Error(args){

                SensenRawCli.$Console.Error( `Erreur`, `Impossible de terminer l'opération` )

                console.log(err)

            },
            
            End(args){
                
                SensenRawCli.$Console.Success( `Succès` , '' )

            },
            
        }


    }))












    /**
     * Construction de l'application
     */
    const $Build = (new SensenRawCli.Child({
            
        iD: '--serve', Title: 'Construction de l\'application', About: '',

        Execute(args){

            return `yarn build`

        },

        Emit:{

            Begin(args){

                SensenRawCli.$Console.Notice( `Compilation` , 'Automatique du Bundle' )

            },
            
            Error(args){

                SensenRawCli.$Console.Error( `Erreur`, `Impossible de terminer l'opération` )

                console.log(err)

            },
            
            End(args){
                
                SensenRawCli.$Console.Success( `Succès` , '' )

            },
            
        }


    }))








    /**
     * Déclarations
     */
    const state = (new SensenRawCli.Create({

        iD: 'sensen',

        Title: 'Sensen CLI',
        
        About: 'Sensen Project Manager',
        
        Execute(args){

            SensenRawCli.$Console.Message(`Sensen CLI`)

        },
        
    }))



    .Add( $Create )

    .Add( $Theme )

    .Add( $View )

    .Add( $Graft )

    .Add( $Upgrader )

    .Add( $Mount )

    .Add( $Serve )

    .Add( $Build )
    


    /**
     * Run Command manager
     */
    .Run(

        SensenRawCli.Create.Args( args, 2 )

    )

;
    

    return SensenCli
    
}








/**
 * Sensen Bootstrap
 * @returns { SensenCli }
 */
const Boot = function(args){

    // console.log('Sensen Running\n', args)

    return this.Command(args)
    
}





/**
 * Sensen Kernel Build Export
 */
const SensenCli = {

    Version : Kernel.Version,
    
    VersionString : Kernel.VersionString,

    VersionName : Kernel.VersionName,

    Resposites : Kernel.Resposites ,


    Paths : Kernel.Paths,

    Downloader : Kernel.Downloader,

    ScanDirectory : ScanDirectory,

    GetRawFile : GetRawFile,

    SetRawFile : SetRawFile,

    Log: {

        Message : LogMessage,

        Error : LogError,
        
        Success : LogSuccess,
    
    },

    ProgressBar,

    Deploy,

    Command,

    BuildProjectDependencies,

    Boot,

    ThemeManager,

    RouterManager,

    ViewManager,
    
}




/**
 * Export
 */

module.exports = SensenCli;