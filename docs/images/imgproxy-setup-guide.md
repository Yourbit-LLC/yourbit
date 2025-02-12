# 🚀 imgproxy Setup for Yourbit

## 📌 Installation

### 1️⃣ Install imgproxy on Linux
```sh
# Install dependencies
sudo apt update && sudo apt install -y libvips-dev

# Download imgproxy binary
curl -L https://github.com/imgproxy/imgproxy/releases/latest/download/imgproxy-linux-amd64 -o imgproxy

# Make it executable
chmod +x imgproxy

# Move to system-wide location
sudo mv imgproxy /usr/local/bin/

# Generate secure keys for URL signing
export IMGPROXY_KEY=$(openssl rand -hex 32)
export IMGPROXY_SALT=$(openssl rand -hex 32)

# Run imgproxy
imgproxy
```

---

### 2️⃣ Docker Setup (Recommended)
Create a `docker-compose.yml` file:
```yaml
version: '3.7'

services:
  imgproxy:
    image: darthsim/imgproxy
    container_name: imgproxy
    ports:
      - "8080:8080"
    environment:
      IMGPROXY_KEY: ${IMGPROXY_KEY}
      IMGPROXY_SALT: ${IMGPROXY_SALT}
      IMGPROXY_ENABLE_WEBP: "true"
      IMGPROXY_ENABLE_AVIF: "true"
      IMGPROXY_MAX_SRC_RESOLUTION: "5"
    restart: always
```

Start imgproxy using:
```sh
# Generate secure keys
export IMGPROXY_KEY=$(openssl rand -hex 32)
export IMGPROXY_SALT=$(openssl rand -hex 32)

# Start imgproxy
docker-compose up -d
```

---

## 📡 API Integration with Yourbit

### 1️⃣ Update Yourbit’s Media Model
Modify `models.py`:
```python
from django.conf import settings

class BitMedia(models.Model):
    file = models.ImageField(upload_to="bits/")

    def get_imgproxy_url(self, width, height):
        base_url = f"{settings.IMGPROXY_URL}/insecure/{width}/{height}/plain/{self.file.url}"
        return base_url
```

---

### 2️⃣ Update API Response
Modify `serializers.py`:
```python
class BitMediaSerializer(serializers.ModelSerializer):
    imgproxy_url = serializers.SerializerMethodField()

    def get_imgproxy_url(self, obj):
        return obj.get_imgproxy_url(500, 500)  # Example size

    class Meta:
        model = BitMedia
        fields = ["file", "imgproxy_url"]
```

---

### 3️⃣ Set Up the Environment
Add `imgproxy` settings in **`.env`**:
```ini
IMGPROXY_URL=http://localhost:8080
IMGPROXY_KEY=your_generated_key
IMGPROXY_SALT=your_generated_salt
```
Load them in `settings.py`:
```python
import os

IMGPROXY_URL = os.getenv("IMGPROXY_URL", "http://localhost:8080")
IMGPROXY_KEY = os.getenv("IMGPROXY_KEY")
IMGPROXY_SALT = os.getenv("IMGPROXY_SALT")
```

---

### 4️⃣ Serve Optimized Images in Yourbit Frontend
Modify the frontend to use the `imgproxy_url` field:
```javascript
const ImageComponent = ({ imgproxyUrl }) => {
  return <img src={imgproxyUrl} alt="Optimized media" loading="lazy" />;
};
```

---

## ✅ Testing imgproxy
After setting it up, test image transformation by visiting:

```sh
http://localhost:8080/unsafe/500/500/plain/https://yourbit.me/media/example.jpg
