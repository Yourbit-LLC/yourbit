from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import InteractionHistory

@api_view(['GET'])
def checkUnfed(request):
    from user_profile.api.serializers import BitSerializer
    these_interactions = InteractionHistory.objects.get(user = request.user)
    unfed_bits = these_interactions.unfed_bits.all()
    #Serialize Data
    serializer_class = BitSerializer(unfed_bits, many=True)
    
    #If there are unfed bits
    if unfed_bits:
        return Response({'unfed_bits':True, 'these_bits':serializer_class.data})
    
    else:
        return Response({'unfed_bits': False})

@api_view(['POST'])
def createComment(request):
    #Import comment models from feed
    from feed.models import Comment
    from feed.api.serializers import CommentSerializer

    #Create comment instance
    this_comment = Comment()
    
    #Set sender to request.user
    this_comment.sender = request.user

    #Apply body to new_comment
    this_comment.body = request.POST.get("body")
    
    #Assign new comment to bit
    this_comment.bit = request.POST.get("this_id")
    this_comment.save()

    #Serialize comment
    serialized_comment = CommentSerializer(this_comment, many=False)

    #Return response
    return Response(serialized_comment.data)



    



  
    

