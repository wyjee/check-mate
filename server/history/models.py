from django.db import models

class History(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    text = models.TextField()
    diff = models.JSONField()  # diff-match-patch 결과를 JSON 형태로 저장
    created_at = models.DateTimeField(auto_now_add=True)