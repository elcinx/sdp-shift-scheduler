# 🕒 SHIFT_SYSTEM – Modern Vardiya Yönetim Sistemi

Ruby on Rails ve React ile geliştirilmiş, vardiya oluşturma, düzenleme ve takip özellikleri sunan **modern bir vardiya yönetim sistemi**.  
RESTful API, uçtan uca (E2E) testler ve Docker desteğiyle hızlı, güvenilir ve ölçeklenebilir bir yapı sağlar.

---

## 🚀 Özellikler

- 🧩 **Modern vardiya yönetimi:** vardiya oluşturma, düzenleme, listeleme ve silme  
- ⚙️ **Rails 7 backend + React (Vite) frontend** mimarisi  
- 🔗 **RESTful API** uç noktalarıyla kolay entegrasyon  
- ✅ **Test altyapısı:** RSpec, Cucumber ve Cypress (E2E)  
- 🐳 **Docker** ile hızlı kurulum ve izole çalışma ortamı  

---

## 🛠️ Teknolojiler

| Katman | Teknolojiler |
|:------:|:--------------|
| **Backend** | Ruby on Rails 7, SQLite (dev), RSpec, Cucumber |
| **Frontend** | React, Vite, Cypress |
| **DevOps** | Docker, Puma |

---

## ⚡ Hızlı Başlangıç

### 🧱 Backend

```
bundle install
rails db:create
rails db:migrate
rails server

💻 Frontend

cd frontend
npm install
npm run dev

🧪 Testler

bundle exec rspec
bundle exec cucumber
npm run test

🐳 Docker

docker build -t shift-system .
docker run -p 3000:3000 shift-system

🌐 API Örnekleri
HTTP	   Endpoint	              Açıklama
GET	    /api/shifts	        Tüm vardiyaları listele
POST	  /api/shifts	        Yeni vardiya oluştur
GET	    /api/shifts/:id	    Tek vardiyayı görüntüle
PUT	    /api/shifts/:id	    Vardiya güncelle
DELETE	/api/shifts/:id	    Vardiya sil
