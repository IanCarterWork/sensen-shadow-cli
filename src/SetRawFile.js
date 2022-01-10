

/**
 * Requires
 */

 require = require('esm')(module /*, options*/);

 const fs = require('fs');

 const fse = require('fs-extra');

 const path = require('path');
 

 


/**
 * Création de fichier brute
 * @param { string } source 
 * @param { string } content 
 * @returns 
 */
function SetRawFile(source, content){

    const filepath = `${ process.cwd() }/${ source }`;

    const stream = fs.createWriteStream(filepath,{ });

    stream.write(content);
    
    return stream;
    
}

module.exports = SetRawFile