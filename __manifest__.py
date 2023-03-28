{
    'name': 'CRM Dashboard',
    'version': "16.0.1.0.0",
    'sequence': -1,
    'installable': True,
    'application': True,
    'depends': ['project', 'base', 'crm', 'sale_management'],
    'data': [
        'views/crm_lead.xml',
        'views/crm_dashboard.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'crm_dashboard/static/src/css/crm_style.scss',
            'crm_dashboard/static/src/xml/dashboard.xml',
            'crm_dashboard/static/src/js/crm_dashboard.js',
            'https://cdn.jsdelivr.net/npm/chart.js',

        ],
    }
}
