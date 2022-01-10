
/**
 * Requires
 */

 require = require('esm')(module /*, options*/);

 const fs = require('fs');

 const fse = require('fs-extra');

 const path = require('path');
 


/**
 * 
 * @param { string } dirname 
 * @returns { Promise<string[], NodeJS.ErrnoException>}
 */
async function ScanDirectory(dirname){

    var dirPath = path.join(process.cwd(), dirname);

    return new Promise((done, fail)=>{

        fs.readdir(dirPath, function (err, files) {

            if (err) { fail(err); }

            else{ done(files); }
            
        });

    })

}


module.exports =ScanDirectory