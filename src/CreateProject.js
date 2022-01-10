
/**
 * Requires
 */

 require = require('esm')(module /*, options*/);

 const { exec } = require('child_process');
 
 const fs = require('fs');
 
 const fse = require('fs-extra');
 
 const path = require('path');
 
 const rimraf = require("rimraf");
 
const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js')




/**
 * Sensen Dependencies
 */
 const SensenCli = require('./Sensen');




 

/**
 * Create New Projet
 * @param { string } name 
 * @param { string } template 
 * @returns { Promise }
 */
 const CreateProject = function(name, template = null){

    template = SensenCli.Resposites[template] ? template : 'Default';

    
    const $ProjectDir = `${ process.cwd() }/${ name }`;
    
    const tpl = SensenCli.Resposites[template] || SensenCli.Resposites.Default



    return new Promise((done, fail)=>{

        done = typeof done == 'function' ? done : (r=>r);

        fail = typeof fail == 'function' ? fail : (r=>r);
        

        try{

            if('URL' in tpl){

                LogMessage('Téléchargement', `Atouts pour "${ name }", patientez un moment...`)
        

                const step = 3

                const cmd = `git clone ${ tpl.URL } ${ $ProjectDir }/.sensen-cache${ SensenCli.Paths.CacheDownloaded }`;
                        
                const progressBar = ProgressBar(step, 0)
                
                
                
                exec(`${ cmd }`, ()=>{
        
                    progressBar.increment();
        


                    // LogMessage('Déploiement', `Patientez...`)
    
                    Deploy(name) .then(()=>{ 

                        progressBar.increment();


                        setTimeout(() => {
                            
                            rimraf(`${ $ProjectDir }/.sensen-cache${ SensenCli.Paths.CacheDownloaded }`, function () {
                                // LogMessage('Nettoyage', 'Cache'); 
                            });

                        }, 500);

                        

                        LogMessage('Dépendances', `Téléchargement & Installation...`)
    
                        BuildProjectDependencies(name) .then(()=>{
    
                            progressBar.increment();

                            setTimeout(()=>{

                                progressBar.stop();
        
                                setTimeout(()=>{

                                    LogSuccess('Success', `Project created`)
    
                                    done() 

                                }, 1000)
                                
                            }, 1000)

                        }) .catch((err)=>{ fail(err); })
                        


                    }) .catch((err)=>{ fail(err); })
        
                    
                })
        
            }
    
            else{ fail('template corrupted') }

        }

        catch(er){ fail(er) }
        
    })
    
}




module.exports = CreateProject