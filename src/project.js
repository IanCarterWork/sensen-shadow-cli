
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








const ProjectManager = {


    Directory(){

        return `${ process.cwd() }/.sensen-project`

    },
    

    /**
     * Initialisation
     */
     Init(){

        const snph = path.resolve(__dirname, `${ this.Directory() }`);

        if(!fs.existsSync(snph)){

            fs.mkdirSync(snph);

            fs.chmod(snph, 0777, ()=>{})

        }

        return this;
        
    },


    /**
     * Créer un repertoire s'il n'existe pas
     */
     SetDirectory(filepath){

        const snph = path.resolve(process.cwd(), `${ filepath }`);

        if(!fs.existsSync(snph)){

            fs.mkdirSync(snph, {
                recursive: true
            });

            fs.chmod(snph, 0777, ()=>{})

        }

        return this;
        
    },


    /**
     * Sauvegarde de fichier de configuration
     * @param { string } filename 
     * @param { object } objectContent 
     * @returns { fs.WriteStream }
     */
    SaveConfig(filename, objectContent){

        this.Init();

        const filepath = `${ this.Directory() }/${ filename }.json`;

        const stream = fs.createWriteStream(filepath,{ });

        stream.write(JSON.stringify(objectContent))
        
        return stream;
        
    },
    

    /**
     * Chargement de fichier de configuration
     * @param { string } filename 
     * @param { {} } defaultValue 
     * @returns { {} }
     */
    LoadConfig(filename, defaultValue = {}){

        this.Init();

        const filepath = `${ this.Directory() }/${ filename }.json`;

        return fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath,{})) : (defaultValue||{});

    }
    

}





module.exports = ProjectManager