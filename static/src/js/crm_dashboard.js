odoo.define("dashboard_dashboard.DashboardDashboard", function (require) {
   "use strict";
   var AbstractAction = require('web.AbstractAction');
   var core = require('web.core');
   var QWeb = core.qweb;
   var web_client = require('web.web_client');
   var session = require('web.session');
   var ajax = require('web.ajax');
   var _t = core._t;
   var rpc = require('web.rpc');
   var self = this;
   var DashBoard = AbstractAction.extend({
       contentTemplate: 'crmDashboard',
        init: function(parent, context) {
           this._super(parent, context);
           this.dashboard_templates = ['MainSection'];
       },
       start: function() {
           var self = this;
           this.set("title", 'Dashboard');
           return this._super().then(function() {
               self.render_dashboards();
               self.render_graph();
           });
       },
       willStart: function(){
           var self = this;
           return this._super()
       },
       render_dashboards: function() {
           var self = this;
           this.fetch_data()
           var templates = []
           var templates = ['MainSection'];
           _.each(templates, function(template) {
               self.$('.o_hr_dashboard').append(QWeb.render(template, {widget: self}))
           });
       },
       fetch_data: function() {
           var self = this
           var def1 = this._rpc({
               model: 'crm.lead',
               method: "get_data",
           })
           .then(function (result) {
               $('#my_lead').append('<span>' + result.my_lead + '</span>');
               $('#my_opportunity').append('<span>' + result.my_opportunity + '</span>');
               $('#expected_revenue').append('<span>' + result.expected_revenue + '</span>');
               $('#revenue').append('<span>' + result.revenue + '</span>');
               $('#win_ratio').append('<span>' + result.win_ratio + '</span>');
           });
       },
       events:{
       'click .lead_count': 'onclick_lead',
       'click #my_opportunity':'onclick_opportunity',
       'change #dashboard_filter': function(e){
                e.stopPropagation();
                var $target = $(e.target);
                var value = $target.val();
                if (value=="this_year"){
                   this.onclick_this_year()
                   this.onclick_year()
                }
                else if(value=="this_month"){
                         this.onclick_this_month()
                         this.onclick_month()
                }
               else if(value=="this_week"){
                        this.onclick_this_week()
                        this.onclick_week()
               }
                   }
       },
       onclick_this_week:function(ev){
             rpc.query({
               model: 'crm.lead',
               method: 'crm_week',
           }).then(function(result){
               $('#my_lead').empty();
               $('#my_opportunity').empty();
               $('#expected_revenue').empty();
               $('#revenue').empty();
               $('#win_ratio').empty();
               $('#my_lead').append('<span>' + result.lead_year + '</span>');
               $('#my_opportunity').append('<span>' + result.opportunity_year + '</span>');
               $('#expected_revenue').append('<span>' + result.expected_revenue + '</span>');
               $('#revenue').append('<span>' + result.revenue + '</span>');
               $('#win_ratio').append('<span>' + result.win_ratio + '</span>');
                  })
           },
       onclick_this_month:function(ev){
             rpc.query({
               model: 'crm.lead',
               method: 'crm_month',
           }).then(function(result){
               $('#my_lead').empty();
               $('#my_opportunity').empty();
               $('#expected_revenue').empty();
               $('#revenue').empty();
               $('#win_ratio').empty();
               $('#my_lead').append('<span>' + result.lead_year + '</span>');
               $('#my_opportunity').append('<span>' + result.opportunity_year + '</span>');
               $('#expected_revenue').append('<span>' + result.expected_revenue + '</span>');
               $('#revenue').append('<span>' + result.revenue + '</span>');
               $('#win_ratio').append('<span>' + result.win_ratio + '</span>');
                  })
           },
       onclick_this_year:function(ev){
             rpc.query({
               model: 'crm.lead',
               method: 'crm_year',
           }).then(function(result){
               $('#my_lead').empty();
               $('#my_opportunity').empty();
               $('#expected_revenue').empty();
               $('#revenue').empty();
               $('#win_ratio').empty();
               $('#my_lead').append('<span>' + result.lead_year + '</span>');
               $('#my_opportunity').append('<span>' + result.opportunity_year + '</span>');
               $('#expected_revenue').append('<span>' + result.expected_revenue + '</span>');
               $('#revenue').append('<span>' + result.revenue + '</span>');
               $('#win_ratio').append('<span>' + result.win_ratio + '</span>');
               })
               },
       onclick_year:function(e){
           var self=this;
             rpc.query({
                    model: 'crm.lead',
                    method: 'get_year_graph',
             }).then(function(result){
                  $('.stage_graph').hide();
                  $('#year_graph').show();
                  $('#month_graph').hide();
                  $('#week_graph').hide();
                  const ctx = self.$("#year_graph");
                  new Chart(ctx, {
                        type: 'bar',
                        data: {
                        labels: result[0],
                         datasets: [{
                            label: '# Total Lead',
                            data: result[1],
                            borderWidth: 1
                         }]
                         },
                  options: {
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }
                  })
                  })
        },
        onclick_month:function(e){
           var self=this;
             rpc.query({
                    model: 'crm.lead',
                    method: 'get_month_graph',
             }).then(function(result){
                  $('.stage_graph').hide();
                  $('#year_graph').hide();
                  $('#month_graph').show();
                  $('#week_graph').hide();
                   const ctx = self.$("#month_graph");
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                          labels: result[0],
                          datasets: [{
                            label: '# Total Lead',
                            data: result[1],
                            borderWidth: 1
                          }]
                        },
                    options: {
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }
                     })
                    })
                    },
        onclick_week:function(e){
           var self=this;
             rpc.query({
                    model: 'crm.lead',
                    method: 'graph_week',
             }).then(function(result){
                  $('.stage_graph').hide();
                  $('#year_graph').hide();
                  $('#month_graph').hide();
                  $('#week_graph').show();
                   const ctx = self.$("#week_graph");
                     new Chart(ctx, {
                        type: 'bar',
                        data: {
                          labels: result[0],
                          datasets: [{
                            label: '# Total Lead',
                            data: result[1],
                            borderWidth: 1,
                          }]
                        },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })
          })
        },
       onclick_lead:function(event){
            event.preventDefault();
            this.do_action({
                name: _t("lead"),
                type: "ir.actions.act_window",
                res_model: "crm.lead",
                views: [[false, "list"],[false, "form"]],
                target: 'current',
                view_type : 'list',
                view_mode : 'list'
            });
},
        onclick_opportunity:function(event){
            event.preventDefault();
            this.do_action({
                name: _t("opportunity"),
                type: "ir.actions.act_window",
                res_model: "crm.lead",
                views: [[false, "list"],[false, "form"]],
                domain:[['type','=','opportunity']],
                target: 'current',
                view_type : 'list',
                view_mode : 'list'
            });
        },
       render_graph:function(){
         var self=this;
         rpc.query({
           model: 'crm.lead',
           method: 'get_stage_graph',
       }).then(function(result){
              console.log(result)
               const ctx = self.$(".stage_graph");
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                      labels: result[0],
                      datasets: [{
                        label: '# Total Lead',
                        data: result[1],
                        borderWidth: 1
                      }]
                    },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              })
              })
            },
      });
core.action_registry.add('crm_dashboard_tags', DashBoard);
return DashBoard;
});