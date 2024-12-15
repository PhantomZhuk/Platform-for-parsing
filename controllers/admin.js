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
            const { domain, normalText, additionalText, ul, name, link, price, image, pageLink, exists, className } = req.body;
            const availability = new Availability({ exists, className });
            const html = new HTML({ ul, name, link, price, image, pageLink, availability });
            const search = new Search({ normalText, additionalText });
            const services = new Services({ domain, search, html });
            await Services.findByIdAndUpdate(_id, services);
            res.sendStatus(200).send({ message: "Services updated" });
        }catch (err) {
            console.log(err);
        }
    }
};