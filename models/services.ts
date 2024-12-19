import mongoose from "mongoose";
const schemaSettings = { _id: false, autoIndex: false };
const searchSchema = new mongoose.Schema(
    {
        normalText: {
            type: String,
            required: true,
        },
        additionalText: {
            type: String,
            required: true,
        },
    },
    schemaSettings
);

const availabilitySchema = new mongoose.Schema(
    {
        exists: {
            type: Boolean,
            default: false,
        },
        className: {
            type: String,
            default: null,
        },
    },
    schemaSettings
);

const HTMLSchema = new mongoose.Schema(
    {
        ul: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        pageLink: {
            type: String,
            required: true,
        },
        availability: {
            type: availabilitySchema,
            required: true,
        },
    },
    schemaSettings
);
const visitSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) => {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                    return dateRegex.test(value);
                },
                message: "Invalid date format. Use YYYY-MM-DD.",
            },
        },
        count: {
            type: Number,
            default: 0,
            validate: {
                validator: (value: number) => {
                    return value >= 0;
                },
                message: "Count must be a non-negative number.",
            },
        },
    },
    schemaSettings
);
let weekVisits = (param: string) => {
    return { date: new Date(param).toISOString().split("T")[0], count: 0 };
};
const servicesSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        search: {
            type: searchSchema,
            required: true,
        },
        html: {
            type: HTMLSchema,
            required: true,
        },
        visits: {
            type: [visitSchema],
            default: [
                weekVisits("16 December 2024 UTC "),
                weekVisits("23 December 2024 UTC"),
                weekVisits("30 December 2024 UTC"),
                weekVisits("6 January 2025 UTC"),
                weekVisits("13 January 2025 UTC"),
                weekVisits("20 January 2025 UTC"),
            ],
        },
    },
    {
        methods: {
            async addVisit(visit: number) {
                const today = new Date();
                const thisDay = today.getUTCDay(); 
                const thisDate = today.getUTCDate();
                const neededDate = thisDate - thisDay + 1;
                const monday = new Date(today.setUTCDate(neededDate)).toISOString().split("T")[0];
                if (this.visits[this.visits.length - 1].date !== monday) {
                    this.visits.push({ date: monday, count: visit });
                    if (this.visits.length > 6) this.visits.shift();
                    else this.visits[this.visits.length - 1].count += visit;
                    await this.save();
                }
            },
            getAllVisits() {
                return this.visits.reduce(
                    (prev: number, curr: { count: number }) => prev + curr.count,
                    0
                );
            },
        },
    }
);
export const Services = mongoose.model("Services", servicesSchema);
export const Availability = mongoose.model("Availability", availabilitySchema);
export const Search = mongoose.model("Search", searchSchema);
export const HTML = mongoose.model("HTML", HTMLSchema);