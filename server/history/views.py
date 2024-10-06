from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import History
from .serializers import HistorySerializer

class HistoryList(APIView):
    def get(self, request):
        histories = History.objects.all()
        serializer = HistorySerializer(histories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            history = History.objects.filter(pk=pk).first()
            if history:
                history.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

        except History.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)