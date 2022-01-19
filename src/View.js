
/**
 * Requires
 */

require = require('esm')(module /*, options*/);

const { exec } = require('child_process');

const fs = require('fs');

const fse = require('fs-extra');

const path = require('path');

const rimraf = require("rimraf");

const cliProgress = require('cli-progress');

  
  
  /**
   * Sensen Dependencies
   */
 
const ProjectManager = require('./project.js')

// const SensenCli = require('./Sensen');

const ScanDirectory = require('./ScanDirectory');

const GetRawFile = require('./GetRawFile');

const SetRawFile = require('./SetRawFile');

const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js');

const RouterManager = require('./Router');
const { default: SensenRawCli } = require('sensen.raw.cli');





const ViewDistritutor = {

    /**
     * 
     * @param { string } name 
     * @param { string } route
     * @returns { string }
     */
    HTML(name, route = 'undefined'){

return `<div class="sensen-view">
    <h1>Sensen View</h1>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore quod dolorum aspernatur laborum, minus earum autem eius officia doloribus voluptatum numquam natus molestiae sequi reiciendis, quam et ad, voluptas est!</p>
    <p>View : ${ name }</p>
    <p>Route : ${ route }</p>
</div>
`;         
    },
    


    /**
     * 
     * @param { string } name 
     * @param { string } route
     * @returns { string }
     */
    Script(name, route){

        const SensenCli = require('./Sensen');
    

return ` import SensenHinata from "sensen-hinata";
/**
* A Sensen View
* @package ${ name }
* @license
* @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/

const ${ name }View = new SensenHinata.View({

    slug: '${ route }',

    controller: ($: any)=>{

        console.warn('View Controller ${ route } -> ${ name }')
        
    },

    mounted: ()=>{},
    
    unmounted: ()=>{},
    
});

export default ${ name }View
`;         
    },
    


}








const ViewManager = function(fn, view = "", route = ""){
    
    const $ProjectDir = `${ process.cwd() }`;
    
    // LogMessage('Notice', 'View Manager Start')


    switch(fn){




        case '-create':

            route = route || view;

            if(view){


                const base = `app/views/${ route }`;
    
                const ph = `${ $ProjectDir }${ base }`

                
                if(!fs.existsSync(ph)){

                    ProjectManager.SetDirectory(`app/views/${ route }`)

                    SetRawFile(`${ base }/index.html`, ViewDistritutor.HTML(view, route))

                    SetRawFile(`${ base }/index.ts`, ViewDistritutor.Script(view, route))
    
    
                    /**
                     * liaison de la route
                     */
                    RouterManager('-bind:view', [route])
            
                }

                else{

                    SensenRawCli.$Console.Warning('Attention', `${ route } existe dans le dossier des vue`)
                
                }
                

            }

            else{

                SensenRawCli.$Console.Error('Erreur', 'Veuillez indiquer le nom de la vue et sa route')
                
            }
            
            
        break;
        
        


        



        default:

            LogError('Erreur', 'Fonction non valide')

        break;
        
        
    }
    
    

}



module.exports = ViewManager;