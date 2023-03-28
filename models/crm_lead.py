from odoo import models, fields, api


class CrmTeam(models.Model):
    _inherit = "crm.team"

    lead_state = fields.Many2one('crm.stage', string='Lead State')


class CrmLead(models.Model):
    _inherit = "crm.lead"


    @api.constrains('stage_id')
    def update_lead_state(self):
        self.search([], order='write_date desc')[0].team_id.lead_state = self.stage_id.id

