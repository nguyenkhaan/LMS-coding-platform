# https://medium.com/@punnyarthabanerjee/build-a-gateway-for-microservices-in-fastapi-73e44fe3573b

from fastapi import FastAPI, HTTPException, Request, Response 
from fastapi.responses import JSONResponse 
from fastapi.openapi.docs import get_swagger_ui_html
import httpx 
env = "DEV" 
services = {
    "auth-provider": "http://localhost:4001",
    "business-application": "http://localhost:4000",
    "judge": "http://localhost:4002",
}

# Finally, we create the gateway to chaos 

app = FastAPI() 
#Vi du: http://localhost:400/auth/register => Tien hanh mapping qua http://localhost:4001/api/auth/register
# Tu dong mapping prefix 

@app.get('/{service}/docs' , include_in_schema=False) 
async def service_docs(service : str): 
    if service not in services: 
        raise HTTPException(status_code=404, detail="Service not found")
    return get_swagger_ui_html(
        openapi_url=f"/{service}/openapi.json",
        title=f"{service} - API Docs",
    )

@app.get("/{service}/openapi.json" , include_in_schema=False) 
async def service_openapi(service : str): 
    if service not in services: 
        raise HTTPException(status_code=404, detail="Service not found")
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{services[service]}/openapi.json")
        upstream.raise_for_status()
    schema = upstream.json() 
    schema["servers"] = [{"url": f"/{service}"}]
    return JSONResponse(schema) #Cai nay AI code cho no le 

@app.api_route(
    "/{service}/{path:path}",
    methods=["GET", "POST", "PATCH", "DELETE", "PUT"]
)
async def gateway_to_chaos(
    service: str,
    path: str,
    request: Request
):
    if service not in services:
        raise HTTPException(status_code=404, detail="Service not found")

    body = await request.body() 
    params =request.query_params 

    service_url = services[service]
    async with httpx.AsyncClient() as client: 
        response = await client.request(
            request.method,
            f"{service_url}/{path}",
            content=body,
            params=params, 
            headers={
                key: value for key, value in request.headers.items()
                if key.lower() not in {"host", "content-length"}
            },
        )

    return Response(
        content=response.content,
        status_code=response.status_code,
        media_type=response.headers.get("content-type"),
    )