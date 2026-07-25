from enum import Enum 

class LoginMethod(str, Enum): 
    GOOGLE = 'google' 
    LOCAL = 'local' 
    