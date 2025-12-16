
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save_file(self, file, filename: str) -> str:
        pass