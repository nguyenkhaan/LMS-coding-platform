import random 
import string 
import secrets
def random_string(len : int = 5): 
    chars = string.ascii_letters + string.digits
    return "".join(secrets.choice(chars) for _ in range(len))
import string
