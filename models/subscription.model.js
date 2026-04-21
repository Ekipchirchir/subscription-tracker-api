import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [ true, "Subscription price is required"],
        min: [0, "Price must be a positive number"],
    }, 
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
        default: "USD"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["entertainment", "utilities", "software", "education", "health", "other"],
        required: [true, "Subscription category is required"],
    },
    paymentMethod: {
        type: String,
        //enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "crypto"],
        required: [true, "Payment method is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "paused", "canceled", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date must be in the past or present",
        }
    },
    renewalDate: {
        type: Date,
        required: [true, "Renewal date is required"],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after the start date",
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    }
}, { timestamps: true });

//Auto calculate renewal date based on frequency if missing
subscriptionSchema.pre("Save", function(next){
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        const daysToAdd = renewalPeriods[this.frequency] || 30;
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
    }
    //Auto update status to expired if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;