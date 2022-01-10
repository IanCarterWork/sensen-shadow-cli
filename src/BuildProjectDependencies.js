

/**
 * Requires
 */

require = require('esm')(module /*, options*/);

const { exec } = require('child_process');
  






const BuildProjectDependencies = function(name){

    const $ProjectDir = `${ process.cwd() }/${ name }`;


    return new Promise((done, fail)=>{

        done = typeof done == 'function' ? done : (r=>r);

        fail = typeof fail == 'function' ? fail : (r=>r);

        const cmd = `cd ${$ProjectDir} && npm install && tsc`;

        exec(`${ cmd }`, (err)=>{

            if(err){ fail(err); return; }

            done()

        });
        
    })
    
    
}



module.exports = BuildProjectDependencies