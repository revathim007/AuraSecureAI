from django.db import models
from .accounts import User

class HazardRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hazard_records', db_column='user_id')
    gas_level = models.DecimalField(max_digits=10, decimal_places=2)
    temperature = models.DecimalField(max_digits=10, decimal_places=2)
    smoke_level = models.DecimalField(max_digits=10, decimal_places=2)
    prediction = models.IntegerField()  # 1 = Alarm, 0 = Safe
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'hazard'
        db_table = 'HazardRecords'
        ordering = ['-created_at']

    def __str__(self):
        return f"HazardRecord {self.id} for {self.user.username} at {self.created_at}"
