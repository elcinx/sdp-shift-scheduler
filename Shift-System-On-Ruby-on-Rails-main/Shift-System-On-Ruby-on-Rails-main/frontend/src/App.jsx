import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000'; // Rails backend 3000 portunda çalışıyor

function App() {
  const [vardiyalar, setVardiyalar] = useState([]);
  const [filtrelenmisVardiyalar, setFiltrelenmisVardiyalar] = useState([]);
  const [yeniVardiya, setYeniVardiya] = useState({
    start_time: '',
    end_time: '',
    employee_name: '',
  });
  const [filtreler, setFiltreler] = useState({
    name_filter: '',
    date_from: '',
    date_to: ''
  });
  const [duzenlenenVardiya, setDuzenlenenVardiya] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    vardiyalariGetir();
  }, []);

  useEffect(() => {
    vardiyalariFiltrele();
  }, [vardiyalar, filtreler]);

  useEffect(() => {
    // Tarih doğrulaması
    if (filtreler.date_from && filtreler.date_to) {
      const baslangicTarihi = new Date(filtreler.date_from);
      const bitisTarihi = new Date(filtreler.date_to);
      
      if (baslangicTarihi > bitisTarihi) {
        setHata('Başlangıç tarihi bitiş tarihinden sonra olamaz');
      } else {
        setHata(null);
      }
    }
  }, [filtreler.date_from, filtreler.date_to]);

  const vardiyalariFiltrele = () => {
    let filtrelenmisListe = [...vardiyalar];

    // İsim filtresi
    if (filtreler.name_filter) {
      filtrelenmisListe = filtrelenmisListe.filter(vardiya =>
        vardiya.employee_name.toLowerCase().includes(filtreler.name_filter.toLowerCase())
      );
    }

    // Tarih filtreleri
    if (filtreler.date_from) {
      const baslangicTarihi = new Date(filtreler.date_from);
      filtrelenmisListe = filtrelenmisListe.filter(vardiya =>
        new Date(vardiya.start_time) >= baslangicTarihi
      );
    }

    if (filtreler.date_to) {
      const bitisTarihi = new Date(filtreler.date_to + 'T23:59:59');
      filtrelenmisListe = filtrelenmisListe.filter(vardiya =>
        new Date(vardiya.start_time) <= bitisTarihi
      );
    }

    setFiltrelenmisVardiyalar(filtrelenmisListe);
  };

  const filtreGirdisiniIsle = (e) => {
    const { name, value } = e.target;
    setFiltreler(prev => ({
      ...prev,
      [name]: value
    }));

    // Tarih doğrulaması
    if ((name === 'date_from' || name === 'date_to') && filtreler.date_from && filtreler.date_to) {
      const baslangicTarihi = new Date(filtreler.date_from);
      const bitisTarihi = new Date(filtreler.date_to);
      
      if (baslangicTarihi > bitisTarihi) {
        setHata('Başlangıç tarihi bitiş tarihinden sonra olamaz');
      } else {
        setHata(null);
      }
    }
  };

  const filtreleriTemizle = () => {
    setFiltreler({
      name_filter: '',
      date_from: '',
      date_to: ''
    });
    setHata(null);
  };

  const vardiyalariGetir = async () => {
    try {
      const response = await fetch(`${API_URL}/shifts`);
      if (!response.ok) {
        throw new Error(`HTTP hatası! durum: ${response.status}`);
      }
      const data = await response.json();
      setVardiyalar(data);
    } catch (error) {
      console.error("Vardiyalar getirilirken hata:", error);
      setHata("Vardiyalar getirilemedi.");
    }
  };

  const girdiyiIsle = (e) => {
    const { name, value } = e.target;
    setYeniVardiya({ ...yeniVardiya, [name]: value });
  };

  const duzenlemeGirdisiniIsle = (e) => {
    const { name, value } = e.target;
    setDuzenlenenVardiya({ ...duzenlenenVardiya, [name]: value });
  };

  const gonderimIsle = async (e) => {
    e.preventDefault();
    setHata(null);
    try {
      const response = await fetch(`${API_URL}/shifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shift: yeniVardiya }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : `HTTP hatası! durum: ${response.status}`);
      }
      setYeniVardiya({
        start_time: '',
        end_time: '',
        employee_name: '',
      });
      vardiyalariGetir();
    } catch (error) {
      console.error("Vardiya oluşturulurken hata:", error);
      setHata(`Vardiya oluşturulamadı: ${error.message}`);
    }
  };

  const guncellemeIsle = async (e) => {
    e.preventDefault();
    setHata(null);
    try {
      const response = await fetch(`${API_URL}/shifts/${duzenlenenVardiya.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shift: duzenlenenVardiya }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : `HTTP hatası! durum: ${response.status}`);
      }
      setDuzenlenenVardiya(null);
      vardiyalariGetir();
    } catch (error) {
      console.error("Vardiya güncellenirken hata:", error);
      setHata(`Vardiya güncellenemedi: ${error.message}`);
    }
  };

  const silmeIsle = async (id) => {
    setHata(null);
    try {
      const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP hatası! durum: ${response.status}`);
      }
      vardiyalariGetir();
    } catch (error) {
      console.error("Vardiya silinirken hata:", error);
      setHata("Vardiya silinemedi.");
    }
  };

  const duzenlemeIsle = (vardiya) => {
    setDuzenlenenVardiya({
      ...vardiya,
      start_time: new Date(vardiya.start_time).toISOString().slice(0, 16),
      end_time: new Date(vardiya.end_time).toISOString().slice(0, 16),
    });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Vardiya Yönetim Sistemi</h1>
      </header>

      {duzenlenenVardiya ? (
        <div className="form-container">
          <form onSubmit={guncellemeIsle}>
            <h2>Vardiyayı Düzenle</h2>
            {hata && <div className="error-message">{hata}</div>}
            <div className="form-group">
              <label>Başlangıç Zamanı</label>
              <input
                type="datetime-local"
                name="start_time"
                value={duzenlenenVardiya.start_time}
                onChange={duzenlemeGirdisiniIsle}
                required
              />
            </div>
            <div className="form-group">
              <label>Bitiş Zamanı</label>
              <input
                type="datetime-local"
                name="end_time"
                value={duzenlenenVardiya.end_time}
                onChange={duzenlemeGirdisiniIsle}
                required
              />
            </div>
            <div className="form-group">
              <label>Çalışan Adı</label>
              <input
                type="text"
                name="employee_name"
                value={duzenlenenVardiya.employee_name}
                onChange={duzenlemeGirdisiniIsle}
                required
              />
            </div>
            <div className="shift-actions">
              <button type="submit" className="btn-primary">Vardiyayı Güncelle</button>
              <button type="button" className="btn-secondary" onClick={() => setDuzenlenenVardiya(null)}>
                İptal
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <form onSubmit={gonderimIsle}>
            <h2>Yeni Vardiya Oluştur</h2>
            {hata && <div className="error-message">{hata}</div>}
            <div className="form-group">
              <label>Başlangıç Zamanı</label>
              <input
                type="datetime-local"
                name="start_time"
                value={yeniVardiya.start_time}
                onChange={girdiyiIsle}
                required
              />
            </div>
            <div className="form-group">
              <label>Bitiş Zamanı</label>
              <input
                type="datetime-local"
                name="end_time"
                value={yeniVardiya.end_time}
                onChange={girdiyiIsle}
                required
              />
            </div>
            <div className="form-group">
              <label>Çalışan Adı</label>
              <input
                type="text"
                name="employee_name"
                value={yeniVardiya.employee_name}
                onChange={girdiyiIsle}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Vardiya Ekle</button>
          </form>
        </div>
      )}

      <div className="filters">
        {hata && <div className="error-message">{hata}</div>}
        <div className="filter-group">
          <label>Çalışan Adı</label>
          <input
            type="text"
            name="name_filter"
            placeholder="Filtrele..."
            value={filtreler.name_filter}
            onChange={filtreGirdisiniIsle}
          />
        </div>
        <div className="filter-group">
          <label>Başlangıç Tarihi</label>
          <input
            type="date"
            name="date_from"
            value={filtreler.date_from}
            onChange={filtreGirdisiniIsle}
          />
        </div>
        <div className="filter-group">
          <label>Bitiş Tarihi</label>
          <input
            type="date"
            name="date_to"
            value={filtreler.date_to}
            onChange={filtreGirdisiniIsle}
          />
        </div>
        <button
          className="btn-secondary"
          name="clear_filters"
          onClick={filtreleriTemizle}
        >
          Filtreleri Temizle
        </button>
      </div>

      <h2>Mevcut Vardiyalar</h2>
      {filtrelenmisVardiyalar.length === 0 ? (
        <p>Vardiya bulunamadı.</p>
      ) : (
        <ul className="shift-list">
          {filtrelenmisVardiyalar.map((vardiya) => (
            <li key={vardiya.id} className="shift-item">
              <div className="shift-info">
                <span className="employee-name">{vardiya.employee_name}</span>
                <span className="shift-time">
                  {new Date(vardiya.start_time).toLocaleString()} - {new Date(vardiya.end_time).toLocaleString()}
                </span>
              </div>
              <div className="shift-actions">
                <button className="btn-primary" onClick={() => duzenlemeIsle(vardiya)}>Düzenle</button>
                <button className="btn-danger" onClick={() => silmeIsle(vardiya.id)}>Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;