
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

const ScanDirectory = require('./ScanDirectory');

const GetRawFile = require('./GetRawFile');

const SetRawFile = require('./SetRawFile');

const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js')

const ProgressBar = require('./ProgressBar');
const { default: SensenRawCli } = require('sensen.raw.cli');






/**
 * 
 * @param { '-bind' | '-build' | '-clean:bound' | '-create' | '-artifact' } fn 
 * @param { ?string } theme 
 * @param { ?Array | ?string } arguments 
 */
 const ThemeManager = function(fn, theme, arguments = null){

    const SensenCli = require('./Sensen');

    const slugPath = 'theme';

    const $ProjectDir = `${ process.cwd() }`;
    
    
    // LogMessage(`Sensen ${ SensenCli.VersionName } ${ SensenCli.Version }/${ SensenCli.VersionString }`, 'Gestionnaire de Thème')

    switch(fn){





        /**
         * Création d'un thème
         */
        case '-create':

            if(theme){

                const themeDir = `themes/${ theme }`
                
                
                if(!fs.existsSync(themeDir) || !fs.statSync(themeDir).isDirectory()){

                    ProjectManager.SetDirectory(themeDir)
                    
                    SetRawFile(`${ themeDir }/index.css`, `/**
 * A Sensen Theme Appearence
 * @package ${ theme }
 * @license
 * @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/
                    `)
        
        
                    SetRawFile(`${ themeDir }/index.js`, `/**
 * A Sensen Theme Controller
 * @package ${ theme }
 * @license
 * @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/
                    `)


                    SensenRawCli.$Console.Success(`Succès`, `${ theme } ajouté au projet`)
                        
                }

                else{

                    SensenRawCli.$Console.Error(`Erreur`, `Ce thème < ${ theme } > existe déjà dans ce projet`)
                        
                }
                
            }

            else{

                SensenRawCli.$Console.Error('Erreur', `Veuillez donner un nom à votre thème`)
                
            }

        
        break;





        /**
         * Création d'un artefact de thème
         */
        case '-artifact':


            if(theme){

                const themeDir = `themes/${ theme }`
                    
                if(fs.existsSync(themeDir) && fs.statSync(themeDir).isDirectory()){


                    if(arguments.length && Array.isArray(arguments)){

                        const progressBar = ProgressBar(arguments.length, 0)

                        arguments.forEach(artifact=>{

                            const ph = `${ themeDir }/${ artifact }`

                            
                            if(!fs.existsSync(ph) || !fs.statSync(ph).isDirectory()){

                                ProjectManager.SetDirectory(ph)


                        SetRawFile(`${ ph }/index.css`, `/**
 * A Sensen Theme Appearence
 * @package ${ theme }
 * @license
 * @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/
                        `)
            

                        SetRawFile(`${ ph }/index.js`, `/**
 * A Sensen Theme Controller
 * @package ${ theme }
 * @license
 * @sensen ${ SensenCli.VersionName } : ${ SensenCli.Version } (${ SensenCli.VersionString })
*/
                        `)

                        SetRawFile(`${ ph }/index.htm`, `<div class="any">
    <h1>Sample</h1>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore quod dolorum aspernatur laborum, minus earum autem eius officia doloribus voluptatum numquam natus molestiae sequi reiciendis, quam et ad, voluptas est!</p>
</div>
                        `)


                                // LogMessage(`${ theme }/${ artifact }`, 'Créée avec succès')

                            }

                            else{
            
                                // LogError(`${ theme }/${ artifact }`, 'Existe déjà')
            
                            }

                            progressBar.increment()
            
                        })


                        progressBar.stop()
            
                        LogSuccess(`Terminé`, 'Opération terminé')

                        
                    }

                }

                else{

                    LogError(`${ theme }`, `Ce thème n'existe pas`)
                
                }


            }

            else{

                LogError('Erreur', `Veuillez préciser le nom du thème`)
                
            }

        
            

        
        break;




        


        /**
         * Lier un thème et/ou des artefacts
         */
        case '-bind':

            if(typeof theme == 'string'){

                const artifacts = arguments || [];

                const store = ProjectManager.LoadConfig(slugPath);


                /**
                 * Initialisation du thème
                 */
                store[ theme ] = store[ theme ] || {}


                /**
                 * Mise à jour des artefacts précis
                 */
                if(artifacts.length && Array.isArray(artifacts)){

                    artifacts.forEach(entry=>{

                        const arti = entry.split('=')

                        store[ theme ][ arti[0] ] = arti[1] || arti[0];
                        
                        LogMessage('lié', `${ arti[0] } = ${ arti[1] || arti[0] }`)
                
                    })



                    /**
                     * Sauvegarde dans le project
                     */
                    ProjectManager.SaveConfig(slugPath, store)

                    LogSuccess('Succès', 'La mise à jour effectuée')
                    
                }



                /**
                 * Mise à jour de tous artefacts
                 */
                else if(arguments == '*'){

                    LogMessage('Scan', `Chargement de tous les artefacts du thème`)


                    ScanDirectory(`themes/${ theme }`)

                    .then(files=>{

                        if(Array.isArray(files) && files.length){

                            files.forEach(file=>{

                                if(fs.statSync(`themes/${ theme }/${ file }`).isDirectory()){

                                    const key = file;

                                    store[ theme ][ key ] = key;
                                    
                                    LogMessage('lié', `${ key }`)
                    
                                }

                            })
                            
                            /**
                             * Sauvegarde dans le project
                             */
                            ProjectManager.SaveConfig(slugPath, store)

                            LogSuccess('Liaison', 'Ajouté avec succès')
                            
                            setTimeout(()=>{

                                ThemeManager('-build')

                            }, 1000)
                            
                        }

                        else{

                            LogError('Vide', `Aucun artefact trouvé`)
                            
                        }

                    })

                    .catch(err=>{

                        LogError('Echec', 'Impossible de charger les artefacts du theme')

                        console.error(err)
                        
                    })

                    
                }
                


            }

            else{

                LogError('Echec', `Aucun thème indiqué`)

            }


        break;





        


        /**
         * Nettoyer le build
         */
        case '-clean:bound':

            /**
             * Resinitialisation
             */
            const cleaner = {}

            /**
             * Sauvegarde dans le project
             */
            ProjectManager.SaveConfig(slugPath, cleaner)

            

        
        break;
    








        case '-build':

        

            const themePath = `${ $ProjectDir }/${ slugPath }`;

            const jsbundlePath = `${ $ProjectDir }/jsbundle`;

            const themeBundle = `${ jsbundlePath }/sensen.bundle.theme.js`;

            const content = [];

            const themeConfig = ProjectManager.LoadConfig(slugPath);

            const promises = []

            const $assets = {css:[], js:[]}

            
            ProjectManager.SetDirectory(jsbundlePath)



            /**
             * Analyse des thèmes
             */
            Object.entries(themeConfig).forEach(entry=>{

                promises.push(

                    new Promise((resolve, reject)=>{
                        

                        if(typeof entry[1] == 'object'){

                            const _promises = []
                            

                            /**
                             * Analyse des artéfacts
                             */
                            Object.entries(entry[1]).forEach(artifact=>{

                                const themeSrc = `themes/${ entry[0] }`


                                ScanDirectory(themeSrc)

                                .then(async (themeFiles)=>{

                                    const cssrex = new RegExp('(.*).css')

                                    const jsrex = new RegExp('(.*).js')


                                    themeFiles.forEach(fl=>{

                                        if(!fs.statSync(`${ themeSrc }/${ fl }`).isDirectory()){

                                                const from = `${ themeSrc }/${ fl }`;

                                                const basename = `${ entry[0] }/${ fl }`
                                                

                                                if($assets.css.indexOf(basename) > -1 || $assets.js.indexOf(basename) > -1){ return; }
                                                

                                                if(fl.match(cssrex)){
                                                    
                                                    const to = `public/assets/css/${ basename }`
                                                    
                                                    ProjectManager.SetDirectory(`./public/assets/css/${ entry[0] }`)

                                                    fs.createReadStream(from) .pipe(fs.createWriteStream( to ))

                                                    $assets.css.push(basename)

                                                    LogMessage(`${ basename }`, `Controlleur Global d'apparence d'artefact ajouté`)
                                                    
                                                }

                                                if(fl.match(jsrex)){

                                                    const to = `public/assets/js/${ basename }`
                                                    
                                                    ProjectManager.SetDirectory(`./public/assets/js/${ entry[0] }`)

                                                    fs.createReadStream(from) .pipe(fs.createWriteStream( to ))

                                                    $assets.js.push(basename)

                                                    LogMessage(`${ basename }`, `Controlleur Global d'artefact ajouté`)
                                                    
                                                }

                                            console.log('themeFiles', fl, )
    
                                        }
    
                                    })

                                })



                                _promises.push(

                                    new Promise((complete, uncomplete)=>{

                                        const src = `themes/${ entry[0] }/${ artifact[1] }`

                                        ScanDirectory(src)

                                        .then(async (files)=>{


                                            const assets = {css:[], js:[]}

                                            const cssrex = new RegExp('(.*).css')

                                            const jsrex = new RegExp('(.*).js')


                                            
                                            /**
                                             * Traitement des fichiers CSS & JS 
                                             */
                                            files.forEach(f=>{

                                                const from = `${ src }/${ f }`;

                                                const basename = `${ entry[0] }/${ artifact[1] }/${ f }`

                                                if(f.match(cssrex)){
                                                    
                                                    const to = `public/assets/css/${ basename }`
                                                    
                                                    ProjectManager.SetDirectory(`./public/assets/css/${ entry[0] }/${ artifact[1] }`)

                                                    fs.createReadStream(from) .pipe(fs.createWriteStream( to ))

                                                    assets.css.push(basename)

                                                    LogMessage(`${ basename }`, `Controlleur d'apparence d'artefact ajouté`)
                                                    
                                                }

                                                if(f.match(jsrex)){

                                                    const to = `public/assets/js/${ basename }`
                                                    
                                                    ProjectManager.SetDirectory(`./public/assets/js/${ entry[0] }/${ artifact[1] }`)

                                                    fs.createReadStream(from) .pipe(fs.createWriteStream( to ))

                                                    assets.js.push(basename)

                                                    LogMessage(`${ basename }`, `Controlleur d'artefact ajouté`)
                                                    
                                                }

                                            })


                                            /**
                                             * Traitement du fichier HTM
                                             */
                                            if(files.indexOf('index.htm') > -1){

                                                await GetRawFile(`${src}/index.htm`).then(async content=>{

                                                    if(content){ 
                                                            
                                                        /**
                                                         * Recherche de l'enfant
                                                         */

                                                        if(files.indexOf('child.htm') > -1){

                                                            await GetRawFile(`${src}/child.htm`).then(child=>{

                                                                if(child){

                                                                    complete({ name: src, child, content, assets }) 

                                                                }

                                                                else{ complete({ name: src, content, assets }); }
                                                                
                                                            })

                                                            .then(er=>{

                                                                complete({ name: src, content, assets });
                                                    
                                                            })

                                                        }

                                                        else{ complete({ name: src, content, assets }); }
                                                    
                                                    }

                                                    else{ LogMessage('Information', 'HTM vide'); }

                                                }).catch(err=>{ 
                                                    uncomplete(err)
                                                    LogMessage(`${ entry[0] }/${ artifact[1] }`, 'Impossible de charger le .HTM'); 
                                                    console.error(err); 
                                                });
                                                
                                            }

                                            // console.log('Artifact content', files)

                                        })

                                        .catch(err=>{ 
                                            uncomplete(err);
                                            LogError(`${ themePath }/${ entry[0] }/${ artifact[1] }`, 'Impossible de charger les artefacts'); 
                                            console.error(err); 
                                        })

                                    })
                                    
                                )

                            })
                            

                            /**
                             * Traitement des artefacts chargés
                             */
                            Promise.allSettled(_promises)
                            .then(items=>{

                                const recolts = []

                                items.map(item=>{

                                    if('value' in item){

                                        recolts[item.value.name] = {
                                            html: item.value.content,
                                            child: item.value.child||'',
                                            assets: item.value.assets
                                        }
                                        
                                    }

                                })
                                
                                resolve(recolts)
    
                            })

                            .catch(err=>{
                                reject(err)
                                LogError('Erreur', 'Echec Analyse')
                            })
                            
                        }
                        
                    })

                )
                
            })



            /**
             * Traitement des Promesses
             */
            Promise.allSettled(promises)

            .then(res=>{

                const loaded = {}



                Object.values(res).forEach(rr=>{

                    if('value' in rr){

                        Object.entries(rr.value||{}).forEach((e)=>{

                            loaded[e[0]] = e[1];
                            
                        })
        
                    }

                })

                
                /**
                 * Construction du bundle
                 */
                content.push(`import SensenHinata from "sensen-hinata";`)

                content.push(`const themeBundle = {}`)

                /**
                 * D
                 */
                
                Object.entries(themeConfig).forEach(entry=>{

                    content.push(`;themeBundle['${ entry[0] }'] = (new SensenHinata.Theme('${ entry[0] }'))`)

                });
    

                /**
                 * Ajout des atouts globaux
                 */
                try{

                    const defaultKey = Object.entries(themeConfig)[0][0]

                    if(defaultKey){
    
                        if($assets.css.length){
    
                            $assets.css.forEach($css=> content.push(`;themeBundle['${ defaultKey }'].Asset('-css','assets/css/${ $css }')`) )
                            
                        }
    
                        if($assets.js.length){
    
                            $assets.js.forEach($js=> content.push(`;themeBundle['${ defaultKey }'].Asset('-js','assets/js/${ $js }')`) )
                            
                        }
    
                    }

                }

                catch(erc){

                    LogMessage('Attention', `Sensen a détecté un problème avec l'implémentation du constructeur de thème.`)
                    LogMessage('Attention', `Pensez à lier votre/vos thème au projet courant`)
                    LogMessage('$', `sensen theme -bind "theme-name" [...artifactSlug=artifact-name]`)

                }
                

            

                Object.entries(themeConfig).forEach(entry=>{

                    content.push(`;themeBundle['${ entry[0] }']`)
    
                    Object.entries(entry[1]).forEach(artifact=>{

                        const key = `themes/${ entry[0] }/${ artifact[1] }`

                        // console.log('Artifact', key, key in loaded )

                        if((key in loaded)){


                            LogMessage(`${ entry[0] }/${ artifact[1] }`, `Construit`)
                            
                            content.push(`.Define('${ artifact[1] }',\`${ loaded[key].html||'' }\`)`)


                            if('child' in loaded[key]){

                                if( loaded[key].child ){

                                    content.push(`.Define('${ artifact[1] }:child',\`${ loaded[key].child }\`)`)

                                }
                                
                            }
                            

                            /**
                             * Ajout des atouts des artefacts
                             */
                            if('assets' in loaded[key]){

                                if(typeof loaded[key].assets.css == 'object'){

                                    loaded[key].assets.css.forEach(css=> content.push(`.Asset('-css','assets/css/${ css }')`))
                                    
                                }

                                if(typeof loaded[key].assets.js == 'object'){

                                    loaded[key].assets.js.forEach(js=> content.push(`.Asset('-js','assets/js/${ js }')`))
                                    
                                }
                                
                            }

                        }


                    })

                    content.push(`;themeBundle['${ entry[0] }'].Use();`)

                });


                content.push(`export default themeBundle;`)


                /**
                 * Création du fichier bundle
                 */

                SetRawFile(`jsbundle/sensen.theme.bundle.js`, content.join("\n") )


                /**
                 * Reponse finale
                 */
                LogSuccess('sensen.bundle.theme.js', `Mit à jour avec succès`)
                
            })

            .catch(err=>{

                // console.log('Promise Error', err)

                LogError('Erreur Compilation', err)

            })

            // .finally(d=>{
            //     console.log('Promise Finally', d)
            // })

            // console.log('Build Theme', themeConfig, )

        break;
        



        default:

            LogError('Erreur', 'Fonction non valide')

        break;
        
    }


    return ThemeManager;
    
}




module.exports = ThemeManager