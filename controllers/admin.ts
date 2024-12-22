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
      req.body.name ? delete req.body.name : null;
      const service = new Services({
        serviceName: req.body.serviceName,
        domain: req.body.domain,
        search: new Search(req.body.search),
        html: new HTML({
          ...req.body.html,
          availability: new Availability(req.body.html.availability),
        }),
      });
      await service.save();
      res.send({ message: "Services created" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  },
  getServices: async (req, res) => {
    try {
      const service = await Services.find().lean<IServiceDocument[]>();
      res.json(service);
    } catch (err) {
      console.log(err);
    }
  },
  deleteServices: async (req, res) => {
    try {
      const _id = req.params.id;
      await Services.findByIdAndDelete(_id);
      console.log(_id);
      res.status(200).json({ message: "Services deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  },
  updateServices: async (req, res) => {
    try {
      const { previousName, ...updates } = req.body;
      console.log(previousName, updates);
      if (!previousName) {
        return res.status(400).json({ message: "Service name is required" });
      }

      const updatedService = await Services.findOneAndUpdate(
        { serviceName: previousName },
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
