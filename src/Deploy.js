
/**
 * Requires
 */

 require = require('esm')(module /*, options*/);

 const { exec } = require('child_process');
 
 const fs = require('fs');
 
 const fse = require('fs-extra');
 
 const path = require('path');
 
 const rimraf = require("rimraf");
 
// const { LogError, LogMessage, LogSuccess } = require('./LogNotice.js')




/**
 * Sensen Dependencies
 */
const SensenCli = require('./Sensen');



/**
 * Deploy Project
 * @returns { Promise }
 */
 const Deploy = function(name){

    const $ProjectDir = `${ process.cwd() }/${ name }`;
    
    const from = `${ $ProjectDir }/.sensen-cache${SensenCli.Paths.CacheDownloaded}`

    const to = `${ $ProjectDir }`;


    return new Promise((done, fail)=>{

        done = typeof done == 'function' ? done : (r=>r);

        fail = typeof fail == 'function' ? fail : (r=>r);


        const fn = ()=>{

            fse.copy(from, to,{ overwrite: true })

            .then(()=>{ done() })
        
            .catch((er)=>{ fail(er) })
        
        }
        

        if(!fs.existsSync(to)){ 
            
            fs.mkdirSync(to);

            fs.chmod(to, 0777, ()=>{})

            setTimeout(()=>{ fn(); }, 500)

        }

        else{

            // rimraf(to, function () { 

                setTimeout(()=>{ fn(); }, 500)

            // });
            
        }
        
        
    })

}


module.exports = Deploy