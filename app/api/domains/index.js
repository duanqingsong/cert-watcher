import dbConnect from '../../../lib/mongodb';
import Domain from '../../../models/Domain';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const domains = await Domain.find({});
        res.status(200).json(domains);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const domain = await Domain.create(req.body);
        res.status(201).json(domain);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
