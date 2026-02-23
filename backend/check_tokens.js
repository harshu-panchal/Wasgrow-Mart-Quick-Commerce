"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Delivery_1 = __importDefault(require("./src/models/Delivery"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
}
async function checkTokens() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        const deliveries = await Delivery_1.default.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });
        console.log(`Found ${deliveries.length} delivery partners with FCM tokens`);
        deliveries.forEach(d => {
            console.log(`Delivery: ${d.name} (${d.mobile}), Tokens: ${d.fcmTokens?.length}`);
            console.log(`Tokens: ${JSON.stringify(d.fcmTokens)}`);
        });
        const allDeliveries = await Delivery_1.default.find().limit(5);
        console.log('Last 5 deliveries:');
        allDeliveries.forEach(d => {
            console.log(`- ${d.name} (${d.mobile}), Status: ${d.status}`);
        });
    }
    catch (err) {
        console.error('Error:', err);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
checkTokens();
