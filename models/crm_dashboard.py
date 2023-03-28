from odoo import models, api, fields


class CrmLead(models.Model):
    _inherit = 'crm.lead'

    @api.model
    def get_data(self):
        lead = self.env['crm.lead'].search([])
        opportunity = self.env['crm.lead'].search([('type', '=', 'opportunity')])
        expected_revenue = sum(self.env['crm.lead'].search([]).mapped('expected_revenue'))
        revenue = sum(self.env['account.move'].search([('move_type', '=', 'out_invoice')]).mapped('amount_total'))
        win = self.env['crm.lead'].search_count([('active', '=', 'true')])
        loss = self.env['crm.lead'].search_count([('active', '=', 'false')])
        win_ratio = win / loss
        return {
            'my_lead': len(lead),
            'my_opportunity': len(opportunity),
            'expected_revenue': expected_revenue,
            'revenue': revenue,
            'win_ratio': win_ratio,
        }

    @api.model
    def get_stage_graph(self):
        stage_name = self.env['crm.stage'].search([]).mapped('name')
        total_count = []
        for i in stage_name:
            count = self.search_count([('stage_id', '=', i)])
            total_count.append(int(count))
        stages = [stage_name, total_count]
        return stages

    @api.model
    def get_year_graph(self):
        stage_name = self.env['crm.stage'].search([]).filtered(
            lambda x: x.create_date.year == fields.Date.today().year).mapped('name')
        total_count = []
        for i in stage_name:
            count = self.search_count([('stage_id', '=', i)])
            total_count.append(int(count))
        stages = [stage_name, total_count]
        return stages

    @api.model
    def get_month_graph(self):
        stage_name = self.env['crm.stage'].search([]).filtered(
            lambda x: x.create_date.month == fields.Date.today().month).mapped('name')
        total_count = []
        for i in stage_name:
            count = self.search_count([('stage_id', '=', i)])
            total_count.append(int(count))
        stages = [stage_name, total_count]
        return stages

    @api.model
    def get_week_graph(self):
        stage_name = self.env['crm.stage'].search([]).filtered(
            lambda x: x.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1]).mapped('name')
        total_count = []
        for i in stage_name:
            count = self.search_count([('stage_id', '=', i)])
            total_count.append(int(count))
        stages = [stage_name, total_count]
        return stages

    @api.model
    def crm_year(self):
        lead = len(self.env['crm.lead'].search([]).filtered(lambda x: x.create_date.year == fields.Date.today().year))
        opportunity = len(self.env['crm.lead'].search([('type', '=', 'opportunity')]).filtered(
            lambda x: x.create_date.year == fields.Date.today().year))
        expected_revenue = sum(
            self.env['crm.lead'].search([]).filtered(lambda x: x.create_date.year == fields.Date.today().year).mapped(
                'expected_revenue'))
        revenue = sum(self.env['account.move'].search([('move_type', '=', 'out_invoice')]).filtered(
            lambda x: x.create_date.year == fields.Date.today().year).mapped('amount_total'))
        win = len(self.env['crm.lead'].search([('active', '=', 'true')]).filtered(
            lambda x: x.create_date.year == fields.Date.today().year))
        loss = len(self.env['crm.lead'].search([('active', '=', 'false')]).filtered(
            lambda x: x.create_date.year == fields.Date.today().year))
        win_ratio = win / loss
        return {
            'lead_year': lead,
            'opportunity_year': opportunity,
            'expected_revenue': expected_revenue,
            'revenue': revenue,
            'win_ratio': win_ratio,
        }

    @api.model
    def crm_month(self):
        lead = len(self.env['crm.lead'].search([]).filtered(lambda x: x.create_date.month == fields.Date.today().month))
        opportunity = len(self.env['crm.lead'].search([('type', '=', 'opportunity')]).filtered(
            lambda x: x.create_date.month == fields.Date.today().month))
        expected_revenue = sum(
            self.env['crm.lead'].search([]).filtered(lambda x: x.create_date.month == fields.Date.today().month).mapped(
                'expected_revenue'))
        revenue = sum(self.env['account.move'].search([('move_type', '=', 'out_invoice')]).filtered(
            lambda x: x.create_date.month == fields.Date.today().month).mapped('amount_total'))
        win = len(self.env['crm.lead'].search([('active', '=', 'true')]).filtered(
            lambda x: x.create_date.month == fields.Date.today().month))
        loss = len(self.env['crm.lead'].search([('active', '=', 'false')]).filtered(
            lambda x: x.create_date.month == fields.Date.today().month))
        win_ratio = win / loss
        return {
            'lead_year': lead,
            'opportunity_year': opportunity,
            'expected_revenue': expected_revenue,
            'revenue': revenue,
            'win_ratio': win_ratio,
        }

    @api.model
    def crm_week(self):
        week_lead = len(self.search([('type', '=', 'lead')]).filtered(
            lambda lead: lead.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1]))
        opportunity = len(self.search([('type', '=', 'opportunity')]).filtered(
            lambda x: x.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1]))
        expected_revenue = sum(
            self.env['crm.lead'].search([]).filtered(
                lambda x: x.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1]).mapped(
                'expected_revenue'))
        revenue = sum(self.env['account.move'].search([('move_type', '=', 'out_invoice')]).filtered(
            (lambda x: x.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1])).mapped('amount_total'))
        win = len(self.env['crm.lead'].search([('active', '=', 'true')]).filtered(
            lambda x: x.create_date.isocalendar()[1] == fields.Date.today().isocalendar()[1]))
        j = 1
        win_ratio = win / j
        return {
            'lead_year': week_lead,
            'opportunity_year': opportunity,
            'expected_revenue': expected_revenue,
            'revenue': revenue,
            'win_ratio': win_ratio,
        }

    @api.model
    def graph_week(self):
        stage_name = self.env['crm.stage'].search([])
        name = self.env['crm.stage'].search([]).mapped('name')
        total_count = []
        week = fields.Date.today().isocalendar()[1]
        for i in stage_name:
            count = len(
                self.search([('stage_id', '=', i.id)]).filtered(lambda l: l.create_date.isocalendar()[1] == week).ids)
            total_count.append(count)
        stages = [name, total_count]
        return stages
