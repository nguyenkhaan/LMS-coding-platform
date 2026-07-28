from enum import Enum 

class LoginMethod(str, Enum): 
    GOOGLE = 'google' 
    LOCAL = 'local' 

class Role(str , Enum): 
    ADMIN = 'admin' 
    TEACHER = 'teacher' 
    STUDENT = 'student' 