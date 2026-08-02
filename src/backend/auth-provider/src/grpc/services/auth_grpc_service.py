from _collections_abc import Awaitable

from grpc import aio 
from src.grpc.generated import auth_pb2 
from src.grpc.generated import auth_pb2_grpc
from src.cores.settings import JWT_ACCESS_PUBLIC
class AuthGrpcService(auth_pb2_grpc.AuthGrpcServiceServicer): 
    async def GetPublicKey(self, request: auth_pb2.GetPublicKeyRequest, context: auth_pb2_grpc._ServicerContext) -> auth_pb2.GetPublicKeyResponse | Awaitable[auth_pb2.GetPublicKeyResponse]:
        public_key = JWT_ACCESS_PUBLIC 
        return auth_pb2.GetPublicKeyResponse(
            public_key=public_key 
        )