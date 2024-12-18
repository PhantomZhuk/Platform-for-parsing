import { Services, Availability, Search, HTML } from '../models/services'

interface IService {
    serviceName: string;
    domain: string;
    normalText: string;
    additionalText: string;
    ul: string;
    name: string;
    price: string;
    image: string;
    pageLink: string;
    exists: boolean;
    className: string;
}

interface IServiceDocument extends Document {
    serviceName: string;
    domain: string;
    search: {
        normalText: string;
        additionalText: string;
        _id?: string;
    };
    html: {
        ul: string;
        name: string;
        price: string;
        image: string;
        pageLink: string;
        availability: {
            exists: boolean;
            className: string;
            _id?: string;
        };
        _id?: string;
    };
    _id?: string;
    __v?: number;
}

export default {
    createServices: async (req, res) => {
        try {
            let { serviceName, domain, normalText, additionalText, ul, name, price, image, pageLink, exists, className }: IService = req.body;
            const availability: object = new Availability({ exists, className });
            const html: object = new HTML({ ul, name, price, image, pageLink, availability });
            const search: object = new Search({ normalText, additionalText });
            const services = new Services({ serviceName, domain, search, html });
            await services.save();
            res.sendStatus(201).send({ message: "Services created" });
        } catch (err) {
            console.log(err);
        }
    },
    getServices: async (req, res) => {
        try {
            const service = (await Services.find().lean<IServiceDocument[]>()).map(service => {
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