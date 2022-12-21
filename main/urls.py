from django.urls import path, re_path
from . import views
from .views import *

urlpatterns = [
    path('get/tasks/current_task/', CurrentTask.as_view(), name='get-current-task'),
    path('get/tasks/', GetTasks.as_view(), name='get-tasks'),
    path('tasks/start/', StartTask.as_view(), name='start-task'),
    path('tasks/end/', EndTask.as_view(), name="end-task")
    
    
]
