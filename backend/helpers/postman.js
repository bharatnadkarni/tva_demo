const post_error = (res, status, message) =>{
    res.status(status).json({data: null, message: message})
}

const post_message = (res, data, message) =>{
    res.status(200).json({data: data, message: message})
}

module.exports = {
    post_message, post_error
}