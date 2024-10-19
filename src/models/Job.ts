import mongoose, { Schema, Document } from 'mongoose';

interface IJob extends Document {
    title: string;
    description: string;
    experienceLevel: string;
    endDate: Date;
    companyId: string;
}

const JobSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    endDate: { type: Date, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
});

export default mongoose.model<IJob>('Job', JobSchema);
