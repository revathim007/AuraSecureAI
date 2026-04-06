from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import PredictionInputSerializer, HazardRecordSerializer
from .models import HazardRecord
from utils.ml_utils import MLPredictor
from django.db.models import Count, Avg, Max, Min
from django.utils import timezone
from datetime import timedelta

class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = PredictionInputSerializer(data=request.data)
            if serializer.is_valid():
                input_data = serializer.validated_data
                
                # Use MLPredictor
                predictor = MLPredictor()
                prediction, confidence, result_info = predictor.predict(input_data)
                
                # Check for ML-specific errors (e.g. validation or model missing)
                if prediction is None:
                    return Response({'error': result_info.get('error', 'Prediction failed')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Save to database (matching SQL Server schema)
                hazard_record = HazardRecord.objects.create(
                    user=request.user,
                    gas_level=input_data['gas_level'],
                    temperature=input_data['temperature'],
                    smoke_level=input_data['smoke_level'],
                    prediction=prediction,
                    confidence_score=round(confidence * 100, 2) # Scale to 0-100 for user schema
                )
                
                return Response({
                    'message': 'Prediction successful',
                    'prediction': 'Alarm' if prediction == 1 else 'Safe',
                    'confidence_score': round(confidence * 100, 2),
                    'reason': result_info.get('reason', ''),
                    'record_id': hazard_record.id
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_records = HazardRecord.objects.filter(user=request.user)
            total_scans = user_records.count()
            alarms_count = user_records.filter(prediction=1).count()
            safe_count = user_records.filter(prediction=0).count()
            
            avg_gas = user_records.aggregate(Avg('gas_level'))['gas_level__avg'] or 0
            avg_temp = user_records.aggregate(Avg('temperature'))['temperature__avg'] or 0
            avg_smoke = user_records.aggregate(Avg('smoke_level'))['smoke_level__avg'] or 0
            
            # Recent trends (last 24h)
            last_24h = timezone.now() - timedelta(hours=24)
            recent_alarms = user_records.filter(created_at__gte=last_24h, prediction=1).count()
            
            # Last 10 records for the graph
            recent_history = user_records.order_by('-created_at')[:10]
            history_data = [
                {
                    'time': rec.created_at.strftime('%H:%M'),
                    'gas': float(rec.gas_level),
                    'temp': float(rec.temperature),
                    'smoke': float(rec.smoke_level)
                } for rec in reversed(recent_history)
            ]
            
            return Response({
                'summary': {
                    'total_scans': total_scans,
                    'alarms': alarms_count,
                    'safe': safe_count,
                    'recent_alarms_24h': recent_alarms
                },
                'averages': {
                    'avg_gas': round(avg_gas, 2),
                    'avg_temp': round(avg_temp, 2),
                    'avg_smoke': round(avg_smoke, 2)
                },
                'history': history_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
