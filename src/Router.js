
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

const SensenCli = require('./Sensen');

const ScanDirectory = require('./ScanDirectory');

const GetRawFile = require('./GetRawFile');

const SetRawFile = require('./SetRawFile');

const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js');
const Module = require('module');
const { default: SensenRawCli } = require('sensen.raw.cli');







const RouterDistritutor = {

    /**
     * 
     * @param { string } defaultRoute 
     * @param { string } dependencies
     * @param { string } views
     * @returns { string }
     */
    Script(defaultRoute, dependencies, views){

        const SensenCli = require('./Sensen');

return `/**
* A Sensen Router
* @package sensen.app.router
* @license MIT
* @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/

import SensenHinata from "sensen-hinata";
import AppViewControllersDependencies from "./dependencies";

${ dependencies||'' }
const UsingRouter = new SensenHinata.Router({
    default: '${ defaultRoute || ''}',
    viewControllersDependencies: AppViewControllersDependencies
});
UsingRouter
${ views||'' }
;export default UsingRouter;
`;         
    },
    


}





/**
 * 
 * @param { string } view 
 * @returns {{
 *      route: string,
 *      view: string
 * }}
 */
function RouteParse(view){

    const ex = view.split('=')

    return {

        route : ex[0],

        view : ex[1] || ex[0],

    }
    
}


/**
 * 
 * @param { string[] } views 
 * @returns {{ [K: string]: string }}
 */
function toRoutes(views){

    if(typeof views == 'string'){

        views = [views]
        
    }

    if(Array.isArray(views)){

        const output = {}

        views.forEach(view=>{
            
            const ex = RouteParse(view)
            
            output[ ex.route ] = ex.view
            
        })
        
        return output;
        
    }

    return {};
    
}




const RouterOptionsScheme = {

    default: '',

}


const RouterScheme = {

    /**
     * @type { RouterOptionsScheme }
     */
    options: {},

    /**
     * @type { { [K:string] : string } }
     */
    items:{}
    
}




/**
 * 
 * @param { '-default:view' | '-bind:view' | '-unbind:view' | '-bound' | '-purge' | '-clean' | '-build' } fn 
 * @param { string[] } views 
 */
function RouterManager(fn, views = []){

    const projectSlug = 'router'
    
    const $ProjectDir = `${ process.cwd() }`;
    


    switch(fn){




        /**
         * Definir une vue par defaut
         */
        case '-default:view':

            if(views){

                /**
                 * @type { RouterScheme }
                 */
                const store = ProjectManager.LoadConfig(projectSlug, RouterScheme);

                const view = (Array.isArray(views)) ? views[0] : (typeof views == 'string' ? view : null)

                if(view){

                    store.options = (typeof store.options == 'object') ? store.options : RouterOptionsScheme;
    
                    store.options.default = (typeof view == 'string' && view) ? view : store.options.default;
                    
                    SensenRawCli.$Console.Success('Vue par defaut', view)
     
                    
                    ProjectManager.SaveConfig(projectSlug, store)
                        
                }

                else{

                    SensenRawCli.$Console.Error('Router', `Route non valide`)
                
                }
                
                SensenRawCli.$Console.Notice('Terminé', '')
 
            }

            else{

                SensenRawCli.$Console.Error('Router', `Veuillez indiquer de la vue à definir par defaut`)
                
            }

        break;
        




        /**
         * Ajouter une vue au router
         */
        case '-bind:view':

            if(views){

                views = (Array.isArray(views)) ? views : []

                
                /**
                 * @type { RouterScheme }
                 */
                const store = ProjectManager.LoadConfig(projectSlug, RouterScheme);

                store.items = (typeof store.items == 'object' && store.items) ? store.items : {};

                store.items = (!Array.isArray(store.items)) ? store.items : {};
                


                views.forEach(view=>{

                    const ex = RouteParse(view);

                    /**
                     * Petit système de purge
                     */
                    if(!(ex.route in store.items)){

                        ex.route = ex.route;
                        
                        store.items[ ex.route ] = ex.view
                            
                        SensenRawCli.$Console.Success('Liaison', `${ ex.route } (${ ex.view })`)
                    
                    }

                    else{

                        SensenRawCli.$Console.Notice('Existe déjà', view)
 
                    }
                        

                })


                ProjectManager.SaveConfig(projectSlug, store)

                SensenRawCli.$Console.Notice('Terminé', '')
 
                
            }

            else{

                SensenRawCli.$Console.Error('Router', `Veuillez indiquer de la vue à definir par defaut`)
                
            }

        break;
        



        /**
         * Supprimer une vue du router
         */
        case '-unbind:view':

            if(views){

                views = (Array.isArray(views)) ? views : []

                
                /**
                 * @type { RouterScheme }
                 */
                const store = ProjectManager.LoadConfig(projectSlug, RouterScheme);

                store.items = (typeof store.items == 'object' && store.items) ? store.items : {};

                store.items = (!Array.isArray(store.items)) ? store.items : {};
                
                const nitems = {}

                const $views = toRoutes(views);



                Object.entries(store.items).forEach(e=>{

                    if((e[0] in $views)){

                        SensenRawCli.$Console.Error(`Supprimé`, e[0])
                    
                    }

                    else{
                    
                        nitems[ e[0] ] = e[1];
                           
                    }

                })


                // console.log('Output', nitems, $views )

                store.items = nitems;

                ProjectManager.SaveConfig(projectSlug, store)

                SensenRawCli.$Console.Notice('Terminé', '')
 
                
            }

            else{

                SensenRawCli.$Console.Error('Router', `Veuillez indiquer de la vue à definir par defaut`)
                
            }

        break;
        
        

        



        /**
         * Liste des routes et vues associés
         */
        case '-bound':

                /**
                 * @type { RouterScheme }
                 */
                const bound = ProjectManager.LoadConfig(projectSlug, RouterScheme);

                bound.items = (typeof bound.items == 'object' && bound.items) ? bound.items : {};

                bound.items = (!Array.isArray(bound.items)) ? bound.items : {};


                Object.entries(bound.items).forEach(e=>{

                    SensenRawCli.$Console.Success(`lié`, `${e[0]} (${e[1]})`)
                    
                })


                SensenRawCli.$Console.Notice('Terminé', '')
 
               

        break;
        
        


        /**
         * Nettoyer le router ( Supprime toutes les vues qui n'existe plus )
         */
        case '-purge':

            /**
             * @type { RouterScheme }
             */
            const store = ProjectManager.LoadConfig(projectSlug, RouterScheme);

            store.items = (typeof store.items == 'object' && store.items) ? store.items : {};

            store.items = (!Array.isArray(store.items)) ? store.items : {};
 
            const base = `app/views/`;



            ScanDirectory(base)

            .then(routes=>{

                if(routes){

                    const found = {}

                    Object.entries(store.items).forEach(e=>{

                        if(routes.indexOf(e[0]) === -1){
                            
                            SensenRawCli.$Console.Error('Purgé', `${ e[0] }`)

                        }

                        else{

                            found[ e[0] ] = e[1]

                            SensenRawCli.$Console.Success('Valide', `${ e[0] }`)

                        }

                    })


                    // SensenRawCli.$Console.Notice('Output', found)
                    // SensenRawCli.$Console.Notice('Output', store.items)
                    // SensenRawCli.$Console.Notice('Output', routes)


                    store.items = found;

                    ProjectManager.SaveConfig(projectSlug, store)
    
                    SensenRawCli.$Console.Notice('Terminé', '')
     
                }

                else{

                    SensenRawCli.$Console.Notice('Terminé', 'Le dossier de vues est vide')

                }
                
            })
            


            

        break;
        
        


        /**
         * Nettoyer le router ( Supprime toutes les vues sans exception )
         */
        case '-clean':

            /**
             * @type { RouterScheme }
             */
            const data = ProjectManager.LoadConfig(projectSlug, RouterScheme);

            data.items = {};

            ProjectManager.SaveConfig(projectSlug, data)

            SensenRawCli.$Console.Notice('Terminé', '')

        break;
        





        case '-build:index':

            /**
             * Formattage
             */
            views = (views) ? ((Array.isArray(views)) ? views : []) : [];

            
             /**
              * @type { RouterScheme }
              */
            const buildingi = ProjectManager.LoadConfig(projectSlug, RouterScheme);

            buildingi.options = (typeof buildingi.options == 'object') ? buildingi.options : RouterOptionsScheme;
    
            buildingi.items = (typeof buildingi.items == 'object' && buildingi.items) ? buildingi.items : {};

            buildingi.items = (!Array.isArray(buildingi.items)) ? buildingi.items : {};

            const $viewsi = toRoutes( views );

            const viewsArrayi = Object.entries( $viewsi );
                    
            

            (viewsArrayi.length ? viewsArrayi : Object.entries(buildingi.items)).forEach(entry=>{
                
                const html = `${ $ProjectDir }/app/views/${ entry[0] }/index.html`

                if(fs.existsSync(html)){

                    const stats = fs.statSync(html);
                    
                    if(!stats.isDirectory()){

                        /**
                         * Construction des index en fonctions des types
                         */

                        ScanDirectory(`app/views/${ entry[0] }`)

                        .then(files=>{

                            files.forEach(file=>{

                                if(file.match(new RegExp('(.*).css'))){

                                    const tocssDir = `${ $ProjectDir }/jsbundle/views/${ entry[0] }/`

                                    fs.createReadStream(`${ $ProjectDir }/app/views/${ entry[0] }/${ file }`)

                                    .pipe(fs.createWriteStream(`${ tocssDir }${ file}`))

                                }
                                
                            })

                        })

                        .catch(er=>{

                            SensenRawCli.$Console.Notice('Notice', `Erreur lors de la récupération des index de < ${ entry[0] } >`)

                            console.log(er)
                            
                        })
                        
                        
                    }

                    else{

                        SensenRawCli.$Console.Warning('Notice', `${ entry[0] } n'est pas un dossier de vue`)
                    
                        SensenRawCli.$Console.Notice('Notice', `Si ${ entry[0] } est un dossier vérifié qu'il possède le fichier index.html`)

                    }

                }

                else{

                    SensenRawCli.$Console.Error('Pas de liaison', `${ entry[0] }`)
                    
                }
                


                 
            })


        break;
        
        
        
        


        /**
         * Construction de la route dans l'espace de développement
         */
        case '-build':

            /**
             * Formattage
             */
            views = (views) ? ((Array.isArray(views)) ? views : []) : [];

            
            /**
             * @type { RouterScheme }
             */
            const building = ProjectManager.LoadConfig(projectSlug, RouterScheme);

            building.options = (typeof building.options == 'object') ? building.options : RouterOptionsScheme;
    
            building.items = (typeof building.items == 'object' && building.items) ? building.items : {};

            building.items = (!Array.isArray(building.items)) ? building.items : {};

            const build = {};

            const $views = toRoutes( views );

            const viewsArray = Object.entries( $views );
                    
            

            (viewsArray.length ? viewsArray : Object.entries(building.items)).forEach(entry=>{
                
                const html = `${ $ProjectDir }/app/views/${ entry[0] }/index.html`


                
                if(fs.existsSync(html)){

                    const stats = fs.statSync(html);
                    
                    if(!stats.isDirectory()){

                        const to = `${ $ProjectDir }/public/sensen/views/${ entry[0] }.html`

                        fs.createReadStream(html).pipe(fs.createWriteStream( to ))

                        SensenRawCli.$Console.Success('Construiction', `${ entry[0] } sur ${ entry[1] }View`)
                    
                        build[ entry[0] ] = entry[1] || entry[0];

                    }

                    else{

                        SensenRawCli.$Console.Error('Notice', `${ entry[0] } n'est pas un dossier de vue`)
                    
                        SensenRawCli.$Console.Notice('Notice', `Si ${ entry[0] } est un dossier vérifié qu'il possède le fichier index.html`)

                    }

                }

                else{

                    SensenRawCli.$Console.Error('Pas de liaison', `${ entry[0] }`)
                    
                }
                
                // SensenRawCli.$Console.Success(`lié`, view)
                
            })

            

            /**
             * Construction du control des routes
             */

            const generate = []

            const dependencies = []

            Object.entries( build ).forEach(e=>{

                dependencies.push( `import ${ e[1] }View from "./views/${ e[0] }";` )

                generate.push( `.add(${ e[1] }View)` )
                
            })

            

            // SensenRawCli.$Console.Notice('Dependencies', dependencies)

            // SensenRawCli.$Console.Notice('generate', generate)

            // SensenRawCli.$Console.Notice('Script', gen)
            
            SetRawFile(

                `app/router.ts`,

                RouterDistritutor.Script(

                    building.options.default||'',
    
                    dependencies.join('\n'),
    
                    generate.join('\n')
                    
                )

            )


            SensenRawCli.$Console.Notice('Terminé', '')


        break;
        
        
        
        

        default:

            SensenRawCli.$Console.Error('Erreur', 'Fonction non valide')

        break;
        
        
    }


    // console.log('Router Manager : ', fn, arguments );


}




module.exports = RouterManager;


