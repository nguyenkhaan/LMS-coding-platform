# https://fastapi.tiangolo.com/advanced/templates/#using-jinja2templates

from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory='./src/templates')
# Di tim dua theo current working directory = vi tri chung ta dang dung trong terminal 