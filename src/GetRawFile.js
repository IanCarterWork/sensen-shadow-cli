

/**
 * Requires
 */

 require = require('esm')(module /*, options*/);

 const fs = require('fs');

 const fse = require('fs-extra');

 const path = require('path');
 



/**
 * Chargement de fichier brute
 * @param { string } source 
 * @returns { Promise<string|null, NodeJS.ErrnoException> }
 */
function GetRawFile(source){

    const filepath = `${ process.cwd() }/${ source }`;

    return new Promise((done, fail)=>{

        if(fs.existsSync(filepath)){

            fs.readFile(filepath, 'utf8', function(err, data) {

                if (err){ fail(err); }
                
                else{ done(data) }
                
            })
            
        }

        else{ fail(null) }

    })

}



module.exports = GetRawFile