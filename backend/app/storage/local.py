import os

class LocalStorage:
    def save_file(self, file, filename):
        os.makedirs("uploads", exist_ok=True)
        path = os.path.join("uploads", filename)
        with open(path, "wb") as f:
            f.write(file)
        return path