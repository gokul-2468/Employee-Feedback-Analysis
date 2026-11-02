import mongoose from "mongoose";
import path from "path";
import fs from "fs";

export interface IFeedback {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  text: string;
  rating: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  category: "Website" | "Product" | "Service" | "Customer Support" | "Delivery" | "Other";
  keyIssues: string[];
  sentimentScore: number;
  suggestedResponse: string;
  summary?: string;
  suggestion?: string;
  createdAt: string;
}

export const LOCAL_DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// Ensure local storage directory exists
export const ensureLocalDirectory = () => {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2));
  }
};

let FeedbackModel: mongoose.Model<any> | null = null;
let isMongoConnected = false;

export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("ℹ️ MONGODB_URI not set. Operating in Local JSON File database mode.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB database.");

    const feedbackSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: false },
      title: { type: String, required: false },
      text: { type: String, required: true },
      rating: { type: Number, required: true },
      sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"], required: true },
      category: { type: String, enum: ["Website", "Product", "Service", "Customer Support", "Delivery", "Other"], required: true },
      keyIssues: [{ type: String }],
      sentimentScore: { type: Number, required: true },
      suggestedResponse: { type: String },
      summary: { type: String, required: false },
      suggestion: { type: String, required: false },
      createdAt: { type: Date, default: Date.now }
    });

    // Handle existing model compile to prevent overwrite error
    FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB. Falling back to Local JSON Database.", error);
    isMongoConnected = false;
  }
};

// Initialize local DB check
ensureLocalDirectory();

export class FeedbackRepository {
  static async save(data: Omit<IFeedback, "id">): Promise<IFeedback> {
    if (isMongoConnected && FeedbackModel) {
      const doc = new FeedbackModel({
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
      });
      const saved = await doc.save();
      return {
        id: saved._id.toString(),
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        title: saved.title,
        text: saved.text,
        rating: saved.rating,
        sentiment: saved.sentiment as any,
        category: saved.category as any,
        keyIssues: saved.keyIssues,
        sentimentScore: saved.sentimentScore,
        suggestedResponse: saved.suggestedResponse,
        summary: saved.summary,
        suggestion: saved.suggestion,
        createdAt: saved.createdAt.toISOString()
      };
    } else {
      ensureLocalDirectory();
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: IFeedback[] = JSON.parse(raw);
      
      const newRecord: IFeedback = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: data.createdAt || new Date().toISOString()
      };
      
      list.push(newRecord);
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(list, null, 2));
      return newRecord;
    }
  }

  static async getAll(): Promise<IFeedback[]> {
    if (isMongoConnected && FeedbackModel) {
      const docs = await FeedbackModel.find().sort({ createdAt: -1 });
      return docs.map(doc => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        title: doc.title,
        text: doc.text,
        rating: doc.rating,
        sentiment: doc.sentiment,
        category: doc.category,
        keyIssues: doc.keyIssues,
        sentimentScore: doc.sentimentScore,
        suggestedResponse: doc.suggestedResponse,
        summary: doc.summary,
        suggestion: doc.suggestion,
        createdAt: doc.createdAt.toISOString()
      }));
    } else {
      ensureLocalDirectory();
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: IFeedback[] = JSON.parse(raw);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  static async getById(id: string): Promise<IFeedback | null> {
    if (isMongoConnected && FeedbackModel) {
      try {
        const doc = await FeedbackModel.findById(id);
        if (!doc) return null;
        return {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          title: doc.title,
          text: doc.text,
          rating: doc.rating,
          sentiment: doc.sentiment,
          category: doc.category,
          keyIssues: doc.keyIssues,
          sentimentScore: doc.sentimentScore,
          suggestedResponse: doc.suggestedResponse,
          summary: doc.summary,
          suggestion: doc.suggestion,
          createdAt: doc.createdAt.toISOString()
        };
      } catch {
        return null;
      }
    } else {
      ensureLocalDirectory();
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: IFeedback[] = JSON.parse(raw);
      return list.find(f => f.id === id) || null;
    }
  }

  static async update(id: string, data: Partial<Omit<IFeedback, "id">>): Promise<IFeedback | null> {
    if (isMongoConnected && FeedbackModel) {
      try {
        const updateDoc: any = { ...data };
        if (data.createdAt) {
          updateDoc.createdAt = new Date(data.createdAt);
        }
        const doc = await FeedbackModel.findByIdAndUpdate(id, updateDoc, { new: true });
        if (!doc) return null;
        return {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          title: doc.title,
          text: doc.text,
          rating: doc.rating,
          sentiment: doc.sentiment,
          category: doc.category,
          keyIssues: doc.keyIssues,
          sentimentScore: doc.sentimentScore,
          suggestedResponse: doc.suggestedResponse,
          summary: doc.summary,
          suggestion: doc.suggestion,
          createdAt: doc.createdAt.toISOString()
        };
      } catch {
        return null;
      }
    } else {
      ensureLocalDirectory();
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: IFeedback[] = JSON.parse(raw);
      const index = list.findIndex(f => f.id === id);
      if (index === -1) return null;
      
      list[index] = {
        ...list[index],
        ...data,
        id // Keep same id
      };
      
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(list, null, 2));
      return list[index];
    }
  }

  static async delete(id: string): Promise<boolean> {
    if (isMongoConnected && FeedbackModel) {
      try {
        const result = await FeedbackModel.findByIdAndDelete(id);
        return !!result;
      } catch {
        return false;
      }
    } else {
      ensureLocalDirectory();
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      const list: IFeedback[] = JSON.parse(raw);
      const initialLength = list.length;
      const filtered = list.filter(f => f.id !== id);
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(filtered, null, 2));
      return filtered.length < initialLength;
    }
  }

  static async clearAll(): Promise<void> {
    if (isMongoConnected && FeedbackModel) {
      await FeedbackModel.deleteMany({});
    } else {
      ensureLocalDirectory();
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([], null, 2));
    }
  }
}
