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
    status: {
        type: String,
        default: "Готовий до відправлення",
    }
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
    chatId: {
        type: Number,
        required: true,
        default: 0,
    },
    observedProducts: {
        type: [observedProducts],
        default: [],
    },
});

export const User = mongoose.model(`User`, UsersSchema);