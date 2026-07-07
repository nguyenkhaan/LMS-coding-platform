import random 
import string 

def random_string(len : int = 5): 
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=len))