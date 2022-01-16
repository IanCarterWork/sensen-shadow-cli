
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
                // level.purcent = (100.0 * cur / len).toFixed(2);

                level.length = (cur / 1048576);

                // level.total = total.toFixed(2);
           
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



    switch(args[2] || null){


        /**
         * Création d'un nouveau projet
         */
        case 'create':

            const name = args[3] || null;
            
            if(name){

                const template = args[4] || 'Default';

                // const template = this.Resposites[ tplKey ] || this.Resposites.Default;


                if(template){

                    CreateProject(name, template)

                        .then(()=>{

                            LogMessage('Fait', 'Project prêt')
                            
                        })

                        .catch(err=>{

                            LogError('Erreur', 'Echec lors de creation')
                            
                            console.error(err)

                        })
                    
                }

                else{

                    LogError('Template Erreur', `Ce template < ${ template } > est introuvable`)
                
                }

                
            }

            else{

                LogError('Project Manager', 'Veuillez indiquer le nom de votre projet')
                
            }

        break;






        /**
         * Gestion des Themes
         */
        case 'theme':

            const artifacts = [];

            if(args[5]){

                for (let x = 0; x < args.length; x++) {
                    
                    if(x >= 5){ artifacts.push(args[x]) }
                    
                }

            }
            
            ThemeManager(args[3]||null, args[4]||null, (artifacts.length ? artifacts : false) || args[5] || '*')

        break;
        
        
        


        /**
         * Gestion des Routers
         */
        case 'router':

            const argus = [];

            if(args[4]){

                for (let x = 0; x < args.length; x++) {
                    
                    if(x >= 4){ argus.push(args[x]) }
                    
                }

            }
            
            RouterManager(args[3]||null, (argus.length ? argus : false) || null )

        break;
        
        
        
        


        /**
         * Gestion des Vues
         */
        case 'view':

            ViewManager(args[3]||null, args[4]||null, args[5]||null )

        break;
        
        
        
        
        


        /**
         * Mise à jour : SensenHinata
         */
         case '-update:core':

            const cmdcore = `yarn add sensen-hinata`

            LogMessage(
                `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`
                , 'Démarrage de la mise à jour du noyau'
            )

            LogMessage( `$ ${ cmdcore }`,'')
                

            exec(cmdcore, (err)=>{

                if(err){

                    LogError(
                        `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`,
                        'Erreur'
                    )

                    console.log(err)

                    return;
                    
                }

                LogSuccess(
                    `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`
                    , 'Mise à jour terminé'
                )

            })

        break;
        
        
        
        


        /**
         * Mise à jour : SensenCLI
         */
        case '-update:cli':

            const cmdcli = `yarn add sensen`

            LogMessage(
                `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`
                , 'Démarrage de la mise à jour du CLI'
            )

            LogMessage( `$ ${ cmdcli }`,'')
                

            exec(cmdcli, (err)=>{

                if(err){

                    LogError(
                        `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`,
                        'Erreur'
                    )

                    console.log(err)

                    return;
                    
                }

                LogSuccess(
                    `Sensen ${ Kernel.VersionName } ${ Kernel.Version }/${ Kernel.VersionString }`
                    , 'Mise à jour terminé'
                )

            })

        break;







        /**
         * Grèffes
         */
        case 'graft':

            const grafts = [];

            if(args[5]){

                for (let x = 0; x < args.length; x++) {
                    
                    if(x >= 5){ grafts.push(args[x]) }
                    
                }

            }

            Grafts(args[3]||null, args[4]||null, (grafts.length ? grafts : []) || [] )
        
        break;
        
        
        
        


        /**
         * No Command
         */
        default:

            LogMessage( 'Sensen', `${ this.VersionName }, ${ this.Version } (${ this.VersionString })` );

            LogMessage('sensen create "project-name"', 'Créer un nouveau projet ')

            LogMessage('sensen theme -create "theme-name"', 'Créer un nouveau theme ')

            LogMessage('sensen theme -bind "theme-name" *', 'Lier tous les artéfact d\'un thème  ')
            
            LogMessage('sensen theme -bind "theme-name" [..."artifact-var-name = artifact-name"] ', 'Lier un ou plusieurs artéfacts à d\'un thème')

            LogMessage('sensen theme -build', 'Construire le bundle des thèmes et artéfacts de thème liés')
        

        break;

        
        
    }
    

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