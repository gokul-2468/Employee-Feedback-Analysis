import mongoose from "mongoose";
import path from "path";
import fs from "fs";

export interface IEmployee {
  id?: string;
  empId: string;
  email: string;
  password?: string;
  createdAt: string;
}

export const LOCAL_EMPLOYEE_DB_PATH = path.join(process.cwd(), "src", "data", "employees.json");

// Ensure local storage directory and file exist
export const ensureEmployeeLocalDirectory = () => {
  const dir = path.dirname(LOCAL_EMPLOYEE_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_EMPLOYEE_DB_PATH)) {
    // Write an empty array for local storage
    const defaultEmployees: IEmployee[] = [];
    fs.writeFileSync(LOCAL_EMPLOYEE_DB_PATH, JSON.stringify(defaultEmployees, null, 2));
  }
};

let EmployeeModel: mongoose.Model<any> | null = null;
let isMongoConnected = false;

export const initEmployeeModel = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return;
  }
  try {
    isMongoConnected = true;
    const employeeSchema = new mongoose.Schema({
      empId: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });
    EmployeeModel = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
  } catch (error) {
    console.error("❌ Failed to initialize Employee Model in MongoDB:", error);
    isMongoConnected = false;
  }
};

ensureEmployeeLocalDirectory();

export class EmployeeRepository {
  static async save(data: Omit<IEmployee, "id">): Promise<IEmployee> {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      if (!EmployeeModel) await initEmployeeModel();
      if (EmployeeModel) {
        // Check if employee with same empId or email already exists
        const existing = await EmployeeModel.findOne({ $or: [{ empId: data.empId }, { email: data.email }] });
        if (existing) {
          existing.password = data.password;
          await existing.save();
          return {
            id: existing._id.toString(),
            empId: existing.empId,
            email: existing.email,
            password: existing.password,
            createdAt: existing.createdAt.toISOString()
          };
        }

        const doc = new EmployeeModel({
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
        });
        const saved = await doc.save();
        return {
          id: saved._id.toString(),
          empId: saved.empId,
          email: saved.email,
          password: saved.password,
          createdAt: saved.createdAt.toISOString()
        };
      }
    }

    ensureEmployeeLocalDirectory();
    const raw = fs.readFileSync(LOCAL_EMPLOYEE_DB_PATH, "utf-8");
    const list: IEmployee[] = JSON.parse(raw);
    
    // Check if duplicate empId or email
    const index = list.findIndex(e => e.empId.toLowerCase() === data.empId.toLowerCase() || e.email.toLowerCase() === data.email.toLowerCase());
    
    if (index !== -1) {
      // Update password
      list[index].password = data.password;
      fs.writeFileSync(LOCAL_EMPLOYEE_DB_PATH, JSON.stringify(list, null, 2));
      return list[index];
    }

    const newRecord: IEmployee = {
      ...data,
      id: "emp-" + Math.random().toString(36).substr(2, 9),
      createdAt: data.createdAt || new Date().toISOString()
    };
    
    list.push(newRecord);
    fs.writeFileSync(LOCAL_EMPLOYEE_DB_PATH, JSON.stringify(list, null, 2));
    return newRecord;
  }

  static async findByEmpId(empId: string): Promise<IEmployee | null> {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      if (!EmployeeModel) await initEmployeeModel();
      if (EmployeeModel) {
        const doc = await EmployeeModel.findOne({ empId: new RegExp(`^${empId}$`, "i") });
        if (!doc) return null;
        return {
          id: doc._id.toString(),
          empId: doc.empId,
          email: doc.email,
          password: doc.password,
          createdAt: doc.createdAt.toISOString()
        };
      }
    }

    ensureEmployeeLocalDirectory();
    const raw = fs.readFileSync(LOCAL_EMPLOYEE_DB_PATH, "utf-8");
    const list: IEmployee[] = JSON.parse(raw);
    return list.find(e => e.empId.toLowerCase() === empId.toLowerCase()) || null;
  }

  static async findByEmail(email: string): Promise<IEmployee | null> {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      if (!EmployeeModel) await initEmployeeModel();
      if (EmployeeModel) {
        const doc = await EmployeeModel.findOne({ email: new RegExp(`^${email}$`, "i") });
        if (!doc) return null;
        return {
          id: doc._id.toString(),
          empId: doc.empId,
          email: doc.email,
          password: doc.password,
          createdAt: doc.createdAt.toISOString()
        };
      }
    }

    ensureEmployeeLocalDirectory();
    const raw = fs.readFileSync(LOCAL_EMPLOYEE_DB_PATH, "utf-8");
    const list: IEmployee[] = JSON.parse(raw);
    return list.find(e => e.email.toLowerCase() === email.toLowerCase()) || null;
  }
}
