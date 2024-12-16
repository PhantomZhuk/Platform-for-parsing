const { Services, Availability, Search, HTML } = require('../models/services');

module.exports = {
    createServices: async (req, res) => {
        try {
            let { serviceName, domain, normalText, additionalText, ul, name, price, image, pageLink, exists, className } = req.body;
            const availability = new Availability({ exists, className });
            const html = new HTML({ ul, name, price, image, pageLink, availability });
            const search = new Search({ normalText, additionalText });
            const services = new Services({ serviceName, domain, search, html });
            await services.save();
            res.sendStatus(201).send({ message: "Services created" });
        } catch (err) {
            console.log(err);
        }
    },
    getServices: async (req, res) => {
        try {
            const service = (await Services.find().lean()).map(service => {
                delete service._id;
                delete service.__v;
                delete service.html._id;
                delete service.search._id;
                delete service.html.availability._id;
                return service;
            });
            res.json(service)
        } catch (err) {
            console.log(err);
        }
    },
    deleteServices: async (req, res) => {
        try {
            const _id = req.params._id;
            await Services.findByIdAndDelete(_id);
            res.sendStatus(200).send({ message: "Services deleted" });
        } catch (err) {
            console.log(err);
        }
    },
    updateServices: async (req, res) => {
        try {
            const _id = req.params._id;
            const { serviceName, domain, normalText, additionalText, ul, name, price, image, pageLink, exists, className } = req.body;
            const availability = new Availability({ exists, className });
            const html = new HTML({ ul, name, price, image, pageLink, availability });
            const search = new Search({ normalText, additionalText });
            const services = new Services({ serviceName, domain, search, html });
            await Services.findByIdAndUpdate(_id, services);
            res.sendStatus(200).send({ message: "Services updated" });
        } catch (err) {
            console.log(err);
        }
    }
};