# https://medium.com/@punnyarthabanerjee/build-a-gateway-for-microservices-in-fastapi-73e44fe3573b

from urllib.parse import urlsplit, urlunsplit

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
client = httpx.AsyncClient(
    timeout = 30, 
    follow_redirects=False 
)
# Bo qua nhung truong header nay (Vi cac truong header nay chi phuc vu viec cung cap thong tin) 
# Co mot truong header chung phuc vu viec redirect, chính la truong location. Chung ta can phai bat duoc truong thong nay
HOP_BY_HOP_HEADERS = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
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

    upstream = await client.get(f"{services[service]}/openapi.json")
    upstream.raise_for_status()
    schema = upstream.json()
    upstream_prefix = _upstream_prefix(service)

    # Nhung dong nay de lam qq gi vay? Ai ma biet dm bo m copy tu AI ma 
    schema["paths"] = {
        _public_path(path, upstream_prefix): definition
        for path, definition in schema.get("paths", {}).items()
    }
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
    prefix = _upstream_prefix(service)

    response = await client.request(
        request.method, \
        # Tu dong them prefx vao ben trong duong link truy cap. Ho tro cho nguoi dung thuc hien viec truy cap 
        f"{service_url}/{prefix}/{path}",
        content=body,
        timeout=30, 
        params=params, 
        headers={
            # Su dung duoc cu phap vong lap mang cho ca map va key 
            key: value for key, value in request.headers.items()
            if key.lower() not in {"host", "content-length"}
        },
    )

    proxied_response = Response(
        content=response.content,
        status_code=response.status_code,
        media_type=response.headers.get("content-type"),
    )
    for header, value in response.headers.multi_items():
        header_lower = header.lower()
        if header_lower in HOP_BY_HOP_HEADERS or header_lower in {
            "content-length",
            "content-type",
        }:
            continue

        if header_lower == "location":
            value = _gateway_location(
                value,
                service_url=service_url,
                service=service,
                upstream_prefix=prefix,
                request=request,
            )
        proxied_response.headers.append(header, value)

    return proxied_response


def _upstream_prefix(service: str) -> str:
    # Can use match case for further service function 
    return 'api'

# Tien hanh xoa di prefix neu nhu path dang duoc bat dau voi prefix. 
def _public_path(path: str, upstream_prefix: str) -> str:
    prefix = f"/{upstream_prefix}"
    if path == prefix:
        return "/"
    if path.startswith(f"{prefix}/"):
        return path.removeprefix(prefix)
    return path


def _gateway_location(
    location: str,
    *,
    service_url: str,
    service: str,
    upstream_prefix: str,
    request: Request,
) -> str:
    """Keep redirects to an upstream service on the public gateway URL."""
    target = urlsplit(location)
    upstream = urlsplit(service_url)

    if target.scheme != upstream.scheme or target.netloc != upstream.netloc:
        return location

    upstream_path_prefix = f"/{upstream_prefix}/"
    if not target.path.startswith(upstream_path_prefix):
        return location

    gateway_path = f"/{service}/{target.path.removeprefix(upstream_path_prefix)}"
    gateway_base = urlsplit(str(request.base_url))
    return urlunsplit(
        (
            gateway_base.scheme,
            gateway_base.netloc,
            gateway_path,
            target.query,
            target.fragment,
        )
    )
