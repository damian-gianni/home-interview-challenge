class ConfigurationController {
  constructor(configurationService) {
    this.configurationService = configurationService;
  }
  /*
  returns:
    200 if configuration exists
    404 if configuration doesn't exists
  */
  get(req, res) {
    if (req.params.path in this.configurationService.model) {
      res.status(200).setHeader('Content-Type', 'application/json').send(this.configurationService.model[req.params.path]);
    } else {
      res.sendStatus(404);
    }
  }
}

module.exports = ConfigurationController;
