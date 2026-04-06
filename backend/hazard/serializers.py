from rest_framework import serializers
from .models import HazardRecord

class PredictionInputSerializer(serializers.Serializer):
    gas_level = serializers.FloatField(min_value=0, max_value=1000)
    temperature = serializers.FloatField(min_value=-50, max_value=150)
    smoke_level = serializers.FloatField(min_value=0, max_value=100)

    def validate_gas_level(self, value):
        if value < 0:
            raise serializers.ValidationError("Gas level must be non-negative")
        if value > 1000:
            raise serializers.ValidationError("Gas level cannot exceed 1000")
        return value

    def validate_temperature(self, value):
        if value < -50:
            raise serializers.ValidationError("Temperature cannot be below -50°C")
        if value > 150:
            raise serializers.ValidationError("Temperature cannot exceed 150°C")
        return value

    def validate_smoke_level(self, value):
        if value < 0:
            raise serializers.ValidationError("Smoke level must be non-negative")
        if value > 100:
            raise serializers.ValidationError("Smoke level cannot exceed 100%")
        return value

class HazardRecordSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = HazardRecord
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
