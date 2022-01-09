/**
 * Requires
 */

const { exec } = require('child_process');

const fs = require('fs');

const fse = require('fs-extra');

const path = require('path');

const rimraf = require("rimraf");



/**
 * Sensen CLI
 */
const CLI = {
    
    Version: 1,
    
    VersionString: '0.0.1',

    VersionName: 'Shadow',

    Resposites:{

        Default: {

            URL: `https://github.com/IanCarterWork/sensen-shadow-project.git`

        }
        
    },


    Paths:{

        CacheDownloaded: '/.downloaded'
        
    },


    /**
     * 
     * @param { string } dirname 
     * @returns { Promise<string[], NodeJS.ErrnoException>}
     */
    ScanDirectory(dirname){

        var dirPath = path.join(process.cwd(), dirname);

        return new Promise((done, fail)=>{

            fs.readdir(dirPath, function (err, files) {

                if (err) { fail(err); }

                else{ done(files); }
                
            });

        })

    },



    /**
     * Chargement de fichier brute
     * @param { string } source 
     * @returns { Promise<string|null, NodeJS.ErrnoException> }
     */
    GetRawFile(source){

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

    },


    /**
     * Création de fichier brute
     * @param { string } source 
     * @param { string } content 
     * @returns 
     */
    SetRawFile(source, content){

        const filepath = `${ process.cwd() }/${ source }`;

        const stream = fs.createWriteStream(filepath,{ });

        stream.write(content);
        
        return stream;
        
    }
    
    

}






/**
 * Sensen CLI::Log::Message
 */
const LogMessage = (title = '', message = '')=>{

    console.log(

        '\n', 

        "\x1b[40m", 
        "\x1b[37m", 
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',

        '\n', 
        
    )
                
    return SensenCli.Log;
    
}




/**
 * Sensen CLI::Log::Success
 */
const LogSuccess = (title = '', message = '')=>{

    console.log(

        '\n', 
        
        "\x1b[42m", 
        
        "\x1b[37m", 
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',

        '\n', 
        
        
    )
           
    return SensenCli.Log;

}




/**
 * Sensen CLI::Log::Error
 */
const LogError = (title = '', message = '')=>{

    console.error(

        '\n', 
        
        '\x1b[31m',
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',

        '\n', 
        
        
    )

    return SensenCli.Log;
                
}






/**
 * ProgressBar
 * @param { number } total 
 * @param { number } start 
 * @returns { cliProgress.SingleBar }
 */
const ProgressBar = function(total = 100, start = 0){

    const cliProgress = require('cli-progress');

    const instance = new cliProgress.SingleBar({

        format:'{value}/{total} {bar} {percentage}%',

        clearOnComplete: true,
        
    }, cliProgress.Presets.shades_grey);


    instance.start(total, start);

    return instance;
    
}








const BuildProjectDependencies = function(name){

    const $ProjectDir = `${ process.cwd() }/${ name }`;


    return new Promise((done, fail)=>{

        done = typeof done == 'function' ? done : (r=>r);

        fail = typeof fail == 'function' ? fail : (r=>r);

        const cmd = `cd ${$ProjectDir} && npm install && node sensen/mount && tsc`;

        exec(`${ cmd }`, (err)=>{

            if(err){ fail(err); return; }

            done()

        });
        
    })
    
    
}





/**
 * Deploy Project
 * @returns { Promise }
 */
const Deploy = function(name){

    const $ProjectDir = `${ process.cwd() }/${ name }`;
    
    const from = `${ $ProjectDir }/.sensen-cache${CLI.Paths.CacheDownloaded}`

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





/**
 * Create New Projet
 * @param { string } name 
 * @param { string } template 
 * @returns { Promise }
 */
const CreateProject = function(name, template = null){

    template = CLI.Resposites[template] ? template : 'Default';

    
    const $ProjectDir = `${ process.cwd() }/${ name }`;
    
    const tpl = CLI.Resposites[template] || CLI.Resposites.Default



    return new Promise((done, fail)=>{

        done = typeof done == 'function' ? done : (r=>r);

        fail = typeof fail == 'function' ? fail : (r=>r);
        

        try{

            if('URL' in tpl){

                LogMessage('Téléchargement', `Atouts pour "${ name }", patientez pendant un moment...`)
        

                const step = 3

                const cmd = `git clone ${ tpl.URL } ${ $ProjectDir }/.sensen-cache${ CLI.Paths.CacheDownloaded }`;
                        
                // const progressBar = ProgressBar(step, 0)
                
                
                
                exec(`${ cmd }`, ()=>{
        
                    // progressBar.increment();
        


                    LogMessage('Déploiement', `Patientez...`)
    
                    Deploy(name) .then(()=>{ 

                        // progressBar.increment();


                        setTimeout(() => {
                            
                            rimraf(`${ $ProjectDir }/.sensen-cache${ CLI.Paths.CacheDownloaded }`, function () { LogMessage('Nettoyage', 'Cache'); });

                        }, 500);

                        

                        LogMessage('Dépendances', `Téléchargement & Installation...`)
    
                        BuildProjectDependencies(name) .then(()=>{
    
                            // progressBar.increment();

                            setTimeout(()=>{

                                // progressBar.stop();
        
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







/**
 * 
 * @param { '-bind' | '-build' } fn 
 * @param { ?string } theme 
 * @param { ?Array | ?string } arguments 
 */
const ThemeManager = function(fn, theme, arguments = null){

    const slugPath = 'theme';

    const $ProjectDir = `${ process.cwd() }`;
    
    
    LogMessage('Gestionnaire de Thème', ``)

    switch(fn){


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
                        
                        LogMessage(`${ arti[0] } = ${ arti[1] }`, 'lié')
                
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


                    CLI.ScanDirectory(`themes/${ theme }`)

                    .then(files=>{

                        if(Array.isArray(files) && files.length){

                            files.forEach(file=>{

                                const key = file.substr(0, file.length - 4);

                                store[ theme ][ key ] = key;
                                
                                LogMessage(`${ key }`, 'lié')
                
                            })
                            
                            /**
                             * Sauvegarde dans le project
                             */
                            ProjectManager.SaveConfig(slugPath, store)

                            LogSuccess('Succès', 'La mise à jour effectuée')
                            
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





        case '-build':

        

            const themePath = `${ $ProjectDir }/${ slugPath }`;

            const jsbundlePath = `${ $ProjectDir }/jsbundle`;

            const themeBundle = `${ jsbundlePath }/sensen.bundle.theme.js`;

            const content = [];

            const themeConfig = ProjectManager.LoadConfig(slugPath);

            const promises = []
            
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

                                _promises.push(

                                    new Promise((complete, uncomplete)=>{

                                        const src = `themes/${ entry[0] }/${ artifact[1] }`

                                        CLI.ScanDirectory(src)

                                        .then(async (files)=>{

                                            const assets = {css:[], js:[]}

                                            const cssrex = new RegExp('(.*).css')

                                            const jsrex = new RegExp('(.*).js')


                                            
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
                                             if(files.indexOf('index.css') > -1){
                                                

                                                // const store = ProjectManager.LoadConfig(`theme.assets`);

                                                // store.css = store.css||[]

                                                // store.css.push(`${ entry[0] }/${ artifact[1] }`);

                                                // ProjectManager.SaveConfig('theme.assets', store)

                                                
                                                // await CLI.GetRawFile(`${src}/index.css`).then(css=>{

                                                //     if(css){

                                                //         LogMessage(`${ entry[0] }/${ artifact[1] }`, `Controlleur d'apparence ajouté`); 
                                                    
                                                //         console.log('Fichier CSS détecté', css)

                                                //     }

                                                // });
                                                
                                            }

                                            /**
                                             * Traitement du fichier HTM
                                             */
                                            if(files.indexOf('index.htm') > -1){

                                                await CLI.GetRawFile(`${src}/index.htm`).then(content=>{

                                                    if(content){ complete({ name: src, content, assets }) }

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

                                    recolts[item.value.name] = {
                                        html: item.value.content,
                                        assets: item.value.assets
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


                if(typeof res[0] == 'object'){

                    if('value' in res[0]){

                        Object.entries(res[0].value||{}).forEach((e)=>{

                            loaded[e[0]] = e[1];
                            
                        })
        
                    }

                }



                
                /**
                 * Construction du bundle
                 */
                content.push(`import SensenTheme from "./sensen-hinata/Theme";`)

                Object.entries(themeConfig).forEach(entry=>{

                    content.push(`const themeBundle = (new SensenTheme('sensen-kit'))`)

                    Object.entries(entry[1]).forEach(artifact=>{

                        const key = `themes/${ entry[0] }/${ artifact[1] }`

                        if(key in loaded){

                            LogMessage(`${ entry[0] }/${ artifact[1] }`, `Construit`)
                            
                            content.push(`.Define('${ key }',\`${ loaded[key].html||'' }\`)`)

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

                });

                content.push(`;themeBundle.Use();`)

                content.push(`export default themeBundle;`)


                /**
                 * Création du fichier bundle
                 */

                CLI.SetRawFile(`jsbundle/sensen.bundle.theme.js`, content.join("\n") )


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

            LogMessage('Erreur', 'Fonction non valide')

        break;
        
    }


    return ThemeManager;
    
}






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
     * @returns { Object }
     */
    LoadConfig(filename){

        this.Init();

        const filepath = `${ this.Directory() }/${ filename }.json`;

        return fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath,{})) : {};

    }
    

}






/**
 * Sensen Command Exectutor
 * @param { string[] } Process arguments
 * @returns { SensenCli }
 */
const Command = function(args){



    switch(args[2] || null){


        /**
         * Create New Project
         */
        case 'create':

            const name = args[3] || null;
            
            if(name){

                const template = args[4] || 'Default';

                // const template = this.Resposites[ tplKey ] || this.Resposites.Default;


                if(template){

                    CreateProject(name, template)

                        .then(()=>{

                            LogMessage('Fait', 'Project prêt')
                            
                        })

                        .catch(err=>{

                            LogError('Erreur', 'Echec lors de creation')
                            
                            console.error(err)

                        })
                    
                }

                else{

                    LogError('Template Erreur', `Ce template < ${ template } > est introuvable`)
                
                }

                
            }

            else{

                LogError('Project Manager', 'Veuillez indiquer le nom de votre projet')
                
            }

        break;






        /**
         * Manage Theme
         */
        case 'theme':

            const artifacts = [];

            if(args[5]){

                for (let x = 0; x < args.length; x++) {
                    
                    if(x >= 5){ artifacts.push(args[x]) }
                    
                }

            }
            
            ThemeManager(args[3]||null, args[4]||null, (artifacts.length ? artifacts : false) || args[5] || '*')

        break;
        
        
        
        


        /**
         * No Command
         */
        default:

            LogMessage( 'Sensen', `${ this.VersionName }, ${ this.Version } (${ this.VersionString })` );

            LogMessage('sensen create "name"', 'Create new project ')
        

        break;

        
        
    }
    

    return SensenCli
    
}








/**
 * Sensen Bootstrap
 * @returns { SensenCli }
 */
const Boot = function(args){

    // console.log('Sensen Running\n', args)

    return this.Command(args)
    
}





/**
 * Sensen CLI Build Export
 */
const SensenCli = {

    ...CLI,

    /**
     * Sensen CLI::Log
     */
    Log: {

        Message : LogMessage,

        Error : LogError,
        
        Success : LogSuccess,
    
    },

    ProgressBar,

    Deploy,

    Command,

    BuildProjectDependencies,

    Boot,

    ThemeManager,
    
}




/**
 * Export
 */

module.exports = SensenCli;