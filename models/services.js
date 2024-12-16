const mongoose = require("mongoose");

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
    servicesName:{
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
});

module.exports = {
    Services: mongoose.model("Services", servicesSchema),
    Availability: mongoose.model("Availability", availabilitySchema),
    Search: mongoose.model("Search", searchSchema),
    HTML: mongoose.model("HTML", HTMLSchema),
};