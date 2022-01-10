

require = require('esm')(module /*, options*/);

const cliProgress = require('cli-progress');



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


module.exports = ProgressBar;