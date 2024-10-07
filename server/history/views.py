from math import ceil
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from .models import History
from .serializers import HistorySerializer

class HistoryPagination(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'
    page_size_query_param = 'page_size'

class HistoryList(APIView):

    def get(self, request):
        pagination = HistoryPagination()
        queryset = History.objects.all().order_by('-created_at')
        # payload = {
        #     "pagination": {
        #         "current": pagination.number,
        #         "has_next": pagination.has_next(),
        #         "has_previous": pagination.has_previous(),
        #     },
        #     "data": queryset
        # }
        context = pagination.paginate_queryset(queryset, request)
        serializer = HistorySerializer(context, many=True)
        return pagination.get_paginated_response(serializer.data)

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