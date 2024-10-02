import { AdminService } from '../services/admin.service.js';

class AdminController {
  #adminService;

  constructor() {
    this.#adminService = new AdminService();
  }

  async getProfileById(req, res) {
    const { id: profileId } = req.params;

    const user = await this.#adminService.getProfileById(profileId);

    return res.json({ data: user }).end();
  }

  async getBestProfession(req, res) {
    const { start, end } = req.query;

    const data = await this.#adminService.getBestProfession(start, end);

    return res.json({ data }).end();
  }

  async getBestClients(req, res) {
    const { start, end, limit } = req.query;

    const data = await this.#adminService.getBestClients(start, end, limit);

    return res.json({ data }).end();
  }
}

const adminController = new AdminController();

export { adminController };