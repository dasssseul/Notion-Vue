exports.handler = async function(){
    return {
        statusCode : 200,
        body : JSON.stringify({
            name : 'daseul',
            age : 26,
            email : 'daseul@abc.com'
        })
    }
}