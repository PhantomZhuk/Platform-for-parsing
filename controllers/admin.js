const { Services, Availability, Search, HTML } = require('../models/services');

module.exports = {
    createServices: async (req, res) => {
        try {
            let { domain, normalText, additionalText, ul, name, link, price, image, pageLink, exists, className } = req.body;
            const availability = new Availability({ exists, className });
            const html = new HTML({ ul, name, link, price, image, pageLink, availability });
            const search = new Search({ normalText, additionalText });
            const services = new Services({ domain, search, html });
            await services.save();
            res.sendStatus(201).send({ message: "Services created" });
        } catch (err) {
            console.log(err);
        }
    },
    getServices: async (req, res) => {
        try {
            const service = await Services.find();
            res.json(service)
        }catch (err){
            console.log(err);
        }
    }
};