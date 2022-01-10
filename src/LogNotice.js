
/**
 * Requires
 */

require = require('esm')(module /*, options*/);






/**
 * Sensen SensenCli::Log::Message
 */
const LogMessage = (title = '', message = '')=>{

    console.log(

        '\n', 

        "\x1b[40m", 
        "\x1b[37m", 
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',
        
    )

    
}




/**
 * Sensen SensenCli::Log::Success
 */
const LogSuccess = (title = '', message = '')=>{

    console.log(

        '\n', 
        
        "\x1b[42m", 
        
        "\x1b[37m", 
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',
        
    )


}




/**
 * Sensen SensenCli::Log::Error
 */
const LogError = (title = '', message = '')=>{

    console.error(

        '\n', 
        
        '\x1b[31m',
        
        title || '', 
        
        '\x1b[0m', 
        
        message||'',
        
    )
                
}




module.exports = {
    LogMessage,
    LogError,
    LogSuccess,
}


