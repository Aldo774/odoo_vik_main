{
    'name': 'Web Chart',
    'category': 'Hidden',
    'description': """
OpenERP Web Gantt chart view.
=============================

""",
    'version': '2.0',
    'depends': ['web'],
    'data' : [
        'views/web_gantt_src.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'auto_install': False,

}
