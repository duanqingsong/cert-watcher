import dbConnect from '../../lib/mongodb';
import Domain from '../../models/Domain';
import { updateDomainCertInfo } from '../../lib/certCheck';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    try {
      const domains = await Domain.find({});
      for (const domain of domains) {
        await updateDomainCertInfo(domain._id);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('定时检查失败', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: '方法不允许' });
  }
}
