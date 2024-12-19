import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
    normalText: {
        type: String,
        required: true
    },
    additionalText: {
        type: String,
        required: true
    },
})

const availabilitySchema = new mongoose.Schema({
    exists: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: null
    }
})

const HTMLSchema = new mongoose.Schema({
    ul: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    pageLink: {
        type: String,
        required: true
    },
    availability: {
        type: availabilitySchema,
        required: true
    }
})

const servicesSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    search: {
        type: searchSchema,
        required: true
    },
    html: {
        type: HTMLSchema,
        required: true
    },
    // visits: {
    //     type: [Number],
    //     default: [0, 0, 0, 0, 0, 0]
    // }
});

// servicesSchema.virtual(`addVisit`).set((visit: number) => {
    
// });

export const Services = mongoose.model("Services", servicesSchema);
export const Availability = mongoose.model("Availability", availabilitySchema);
export const Search = mongoose.model("Search", searchSchema);
export const HTML = mongoose.model("HTML", HTMLSchema);