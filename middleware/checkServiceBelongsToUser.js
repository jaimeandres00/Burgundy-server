const User =  require('../models/user.model');
const Service =  require('../models/service.model');

module.exports = async function (req, res, next) {
    const { serviceId } = req.params;

    try {
        const service = await Service.findById(serviceId).select('user');
        const user = await User.findOne({ _id: req.user.id }).select('role');

        if(user.role == 2){
            next();
        } else if(req.user.id == service.user) {
            next();
        } else {
            return res.status(401).json({
                error: 'Autorización denegada'
            });              
        } 

    } catch (error) {
        console.log(error);
        res.send('Error del servidor');
    }
};