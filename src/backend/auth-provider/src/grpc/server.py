import grpc
from src.grpc.generated import auth_pb2_grpc
from src.grpc.services.auth_grpc_service import AuthGrpcService as AuthService 
async def create_grpc_server() -> grpc.aio.Server: 
    server = grpc.aio.server() 

    auth_pb2_grpc.add_AuthGrpcServiceServicer_to_server(
        servicer=AuthService(), 
        server = server  
    ) 
    server.add_insecure_port("[::]:50051") 
    return server 
