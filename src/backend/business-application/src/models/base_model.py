# https://stackoverflow.com/questions/58608361/string-based-enum-in-python
from enum import Enum 

class SystemRole(str, Enum): 
    ADMIN = 'admin' 
    USER = 'user' 
    MANAGER = 'manager' 

class SystemPosition(str, Enum): 
    TEACHER = 'teacher' 
    STUDENT = 'student' 
