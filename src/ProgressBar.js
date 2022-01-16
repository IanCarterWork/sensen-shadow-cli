

require = require('esm')(module /*, options*/);

const cliProgress = require('cli-progress');



/**
 * ProgressBar
 * @param { number } total 
 * @param { number } start 
 * @param { ?string } label 
 * @returns { cliProgress.SingleBar }
 */
 const ProgressBar = function(total = 100, start = 0, label = ''){

    const cliProgress = require('cli-progress');

    const instance = new cliProgress.SingleBar({

        format: `${ label||'' } {bar} {percentage}%`,
        // format: `${ label||'' } {value}/{total} {bar} {percentage}%`,

        clearOnComplete: true,
        
    }, cliProgress.Presets.shades_grey);

    instance.start(total, start);

    return instance;
    
}


module.exports = ProgressBar;