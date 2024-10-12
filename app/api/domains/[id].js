import dbConnect from '../../../lib/mongodb';
import Domain from '../../../models/Domain';
import { updateDomainCertInfo } from '../../../lib/certCheck';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const domain = await Domain.findById(id);
        if (!domain) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json(domain);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const domain = await Domain.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!domain) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json(domain);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedDomain = await Domain.deleteOne({ _id: id });
        if (!deletedDomain) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      if (req.body.action === 'check') {
        try {
          const updatedDomain = await updateDomainCertInfo(id);
          res.status(200).json(updatedDomain);
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
