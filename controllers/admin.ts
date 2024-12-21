import { Services, Availability, Search, HTML } from "../models/services";

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

interface IServiceDocument {
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
      let {
        serviceName,
        domain,
        normalText,
        additionalText,
        ul,
        name,
        price,
        image,
        pageLink,
        exists,
        className,
      }: IService = req.body;
      const availability: object = new Availability({ exists, className });
      const html: object = new HTML({
        ul,
        name,
        price,
        image,
        pageLink,
        availability,
      });
      const search: object = new Search({ normalText, additionalText });
      const services = new Services({ serviceName, domain, search, html });
      await services.save();
      res.send({ message: "Services created" });
    } catch (err) {
      console.log(err);
    }
  },
  getServices: async (req, res) => {
    try {
      const service = (await Services.find().lean<IServiceDocument[]>()).map(
        (service) => {
          delete service._id;
          delete service.__v;
          delete service.html._id;
          delete service.search._id;
          delete service.html.availability._id;
          return service;
        }
      );
      res.json(service);
    } catch (err) {
      console.log(err);
    }
  },
  deleteServices: async (req, res) => {
    try {
      const serviceName = req.params.serviceName;
      await Services.findOneAndDelete(serviceName);
      res.sendStatus(200).send({ message: "Services deleted" });
    } catch (err) {
      console.log(err);
    }
  },
  updateServices: async (req, res) => {
    try {
      const { serviceName, ...updates } = req.body;
      console.log(req.body);
      if (!serviceName) {
        return res.status(400).json({ message: "Service name is required" });
      }

      const updatedService = await Services.findOneAndUpdate(
        { serviceName },
        { $set: updates },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.status(200).json({ message: "Service updated", updatedService });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
