import mongoose, { Schema, Document } from "mongoose";

interface ICompany extends Document {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  employeeSize: string;
  password: string;
  verified: boolean;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  employeeSize: { type: Number, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<ICompany>("Company", CompanySchema);
