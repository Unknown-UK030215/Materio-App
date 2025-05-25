from django.views.generic import TemplateView
from web_project import TemplateLayout
from .models import College, Organization, OrgMember, Program, Student
import json
from datetime import datetime
from django.db.models.functions import TruncDate
from django.db.models import Count

class DashboardsView(TemplateView):
    def get_context_data(self, **kwargs):
        context = TemplateLayout.init(self, super().get_context_data(**kwargs))
        # Counts
        context['colleges_count'] = College.objects.count()
        context['organizations_count'] = Organization.objects.count()
        context['programs_count'] = Program.objects.count()
        context['students_count'] = Student.objects.count()
        context['orgmembers_count'] = OrgMember.objects.count()

        # Students (first 63)
        students = Student.objects.select_related('program').all()[:63]
        for idx, student in enumerate(students[:10]):
            context[f'student{idx}'] = {
                'firstname': student.firstname,
                'lastname': student.lastname,
                'middlename': student.middlename,
                'student_id': student.student_id,
                'program': student.program.prog_name if student.program else ''
            }

        # Student chart data by date
        students_counts = (
            Student.objects
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )
        # Ensure at least one data point for chart stability
        if not students_counts:
            context['student_chart_labels'] = json.dumps(["No Data"])
            context['student_chart_data'] = json.dumps([0])
        else:
            context['student_chart_labels'] = json.dumps([str(item['date']) for item in students_counts])
            context['student_chart_data'] = json.dumps([item['count'] for item in students_counts])

        # Top 3 programming languages (dummy split)
        students_count = Student.objects.all()
        context['aviato_users_count'] = students_count[:20]
        context['django_users_count'] = students_count[20:36]
        context['javascript_users_count'] = students_count[36:52]

        # Organizations
        orgs = Organization.objects.annotate(member_count=Count('orgmember'))
        context['organizations_labels'] = json.dumps([org.name for org in orgs])
        context['organizations_counts'] = json.dumps([org.member_count for org in orgs])

        # Programs
        programs = Program.objects.all()
        context['programs_labels'] = json.dumps([prog.prog_name for prog in programs])
        context['programs_counts'] = json.dumps([prog.student_set.count() for prog in programs])

        # Colleges
        college_acronyms = {
            'College of Sciences': 'CS',
            'College of Arts and Humanities': 'CAH',
            'College of Business Administration': 'CBA',
            'College of Criminal Justice Education': 'CCJE',
            'College of Engineering and Agro-Industrial Technology': 'CEAT',
            'College of Hospitality and Tourism Management': 'CHTM',
            'College of Teacher Education': 'CTE',
        }
        colleges = College.objects.all()
        context['colleges_labels'] = json.dumps([college.college_name for college in colleges])
        context['colleges_counts'] = json.dumps([
            college.program_set.count() if college.program_set.count() > 0 else 1
            for college in colleges
        ])
        context['colleges_list'] = [
            {
                'college_name': college.college_name,
                'college_acronym': college_acronyms.get(college.college_name, college.college_name[:2].upper()),
                'program_count': college.program_set.count()
            }
            for college in colleges
        ]
        return context
