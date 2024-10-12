import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  note: { type: String },
  expiryDate: { type: Date, default: null },
  lastChecked: { type: Date },
  issuer: { type: String },
  certCheckError: { type: String }
});

// 删除旧的 url 索引（如果存在）
DomainSchema.index({ url: 1 }, { unique: true, sparse: true });

export default mongoose.models.Domain || mongoose.model('Domain', DomainSchema);
