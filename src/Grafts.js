
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
 

 


/**
 * 
 * @param { '-add' | '-remove' } fn 
 * @param { string[] } files 
 */
function GratCSS(fn, files){

    const SensenCli = require('./Sensen.js');

    


    switch(fn){



        /**
         * Ajout de grèffes
         */
        case '-add':

            const base = `${ SensenCli.Resposites.Raw }${ SensenCli.Resposites.CSSGraft.Git }/master/`;


            if(files.length){

                const next = (k)=>{

                    let t = setTimeout(()=>{

                        clearTimeout(t)

                        installer(k + 1)
                        
                    }, 60)

                }

                const installer = (k) =>{

                    const file = files[k]||false;

                    if(file){

                        const isURL = SensenCli.Paths.isURL(file);
                        
                        const filename = path.basename(file);


                        /**
                         * @type { ProgressBar }
                         */
                        let loader;

                        const url = (isURL) ? file : `${ base }${ file }.css`;

                        // console.log('url', url )
                    
                        SensenCli.Downloader({

                            url,

                            encoding:'utf-8',

                            start(r,t){ loader = ProgressBar(t, 0, `Installation de < ${ filename } > `) },

                            progress(p){ loader.update(p.length); },

                            fail(f){ loader.stop(); next(k); },

                            done(body){ 

                                ProjectManager.SetDirectory(`assets/css/grafts/`)

                                // console.log('Done', url, body)

                                SetRawFile(`assets/css/grafts/${ filename }.css`, body.join(''))

                                setTimeout(()=>{

                                    loader.stop(); 

                                    next(k);
        
                                }, 500)
                                
                            },

                        })
        
                    }

                    else{

                        LogSuccess(`Terminé`, `${ files.map(f=>`< ${ f } >`).join(' ') }`)
                        
                        LogMessage(`Grèffe CSS`, 'Terminé!')

                    }
                    
                }


                LogMessage(`Grèffe CSS`, 'Début')

                installer(0)
                
            }

            else{ LogError(`Erreur`, `Aucune grèffe indiqué`) }
            
        
        break;
        
        




        /**
         * Ajout de grèffes
         */

        case '-remove':


            if(files.length){

                files.forEach(file=>{

                    const ph = `${ process.cwd() }/assets/css/grafts/${ file }.css`;

                    if(fs.existsSync(ph)){

                        fs.unlinkSync(ph);

                        LogSuccess(`Rétiré`, `${ file }`)

                    }

                    else{

                        LogError(`Echec`, `< ${ file } > n'a pas été gréffé`)
                        
                    }
                    
                    
                })

            }


        break;

    }
    
    
    
}
 
 
 
 
 




/**
 * 
 * @param { '-add' | '-remove' } fn 
 * @param { string[] } files 
 */
function GratJS(fn, files){

    const SensenCli = require('./Sensen.js');

    


    switch(fn){



        /**
         * Ajout de grèffes
         */
        case '-add':

            const base = `${ SensenCli.Resposites.Raw }${ SensenCli.Resposites.JSGraft.Git }/master/`;


            if(files.length){

                const next = (k)=>{

                    let t = setTimeout(()=>{

                        clearTimeout(t)

                        installer(k + 1)
                        
                    }, 60)

                }

                const installer = (k) =>{

                    const file = files[k]||false;

                    if(file){

                        const isURL = SensenCli.Paths.isURL(file);
                        
                        const filename = path.basename(file);


                        /**
                         * @type { ProgressBar }
                         */
                        let loader;

                        const url = (isURL) ? file : `${ base }${ file }.js`;

                        // console.log('url', url )
                    
                        SensenCli.Downloader({

                            url,

                            encoding:'utf-8',

                            start(r,t){ loader = ProgressBar(t, 0, `Installation de < ${ filename } > `) },

                            progress(p){ loader.update(p.length); },

                            fail(f){ loader.stop(); next(k); },

                            done(body){ 

                                ProjectManager.SetDirectory(`assets/js/grafts/`)

                                // console.log('Done', url, body)

                                SetRawFile(`assets/js/grafts/${ filename }.js`, body.join(''))

                                setTimeout(()=>{

                                    loader.stop(); 

                                    next(k);
        
                                }, 500)
                                
                            },

                        })
        
                    }

                    else{

                        LogSuccess(`Terminé`, `${ files.map(f=>`< ${ f } >`).join(' ') }`)
                        
                        LogMessage(`Grèffe JS`, 'Terminé!')

                    }
                    
                }


                LogMessage(`Grèffe JS`, 'Début')

                installer(0)
                
            }

            else{ LogError(`Erreur`, `Aucune grèffe indiqué`) }
            
        
        break;
        
        




        /**
         * Ajout de grèffes
         */

        case '-remove':


            if(files.length){

                files.forEach(file=>{

                    const ph = `${ process.cwd() }/assets/js/grafts/${ file }.js`;

                    if(fs.existsSync(ph)){

                        fs.unlinkSync(ph);

                        LogSuccess(`Rétiré`, `${ file }`)

                    }

                    else{

                        LogError(`Echec`, `< ${ file } > n'a pas été gréffé`)
                        
                    }
                    
                    
                })

            }


        break;

    }
    
    
    
}
 
 
 
 

/**
 * Gestionnaire des grèffes
 * @param { 'css' | 'js' } type 
 * @param { '-add' | '-remove' } fn 
 * @param { string[] } args 
 */

function GraftsManager(type, fn = "", args = []){


    switch(type){

        
        case 'css':

            GratCSS(fn, args)

        break;
        
        

        case 'js':

            GratJS(fn, args)

        break;
        
        
    }


    
}






module.exports.Grafts = GraftsManager;

module.exports.GratCSS = GratCSS;

module.exports.GratJS = GratJS;

