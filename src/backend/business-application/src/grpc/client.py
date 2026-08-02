# Document: https://medium.com/@chinmaydeshpande34/building-blazing-fast-apis-with-grpc-d582429f6f4a
import grpc 
from src.grpc.generated import auth_pb2
from src.grpc.generated import auth_pb2_grpc

# Trinh bay duoi dang class - service 
class AuthGrpcClient: 
    def __init__(self , host : str = "localhost:50051"): 
        self.channel = grpc.aio.insecure_channel(host) 
        self.stub = auth_pb2_grpc.AuthGrpcServiceStub(
            self.channel 
        ) 
    async def public_key(self) -> str: 
        response = await self.stub.GetPublicKey(
            auth_pb2.GetPublicKeyRequest()
        )
        return response.public_key
    async def close(self): 
        await self.channel.close() 