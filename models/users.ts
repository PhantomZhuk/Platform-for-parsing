import mongoose from "mongoose";

const observedProducts = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    pageLink: {
        type: String,
        required: true,
    },
    exists: {
        type: Boolean,
        default: false,
    },
    textReadySend: {
        type: String,
        default: "",
    },
});

const UsersSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // photo: {
    //     type: String,
    //     required: true,
    //     default: "../public/images/user.png",
    // },
    observedProducts: {
        type: [observedProducts],
        default: [],
    },
});

export const User = mongoose.model(`User`, UsersSchema);