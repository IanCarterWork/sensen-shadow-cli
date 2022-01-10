
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




/**
 * Sensen Kernel
 */
const Kernel = {
    
    Version: 1,
    
    VersionString: '0.0.1',

    VersionName: 'Shadow',

    Resposites:{

        Default: {

            URL: `https://github.com/IanCarterWork/sensen-shadow-project.git`

        }
        
    },


    Paths:{

        CacheDownloaded: '/.downloaded'
        
    },


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