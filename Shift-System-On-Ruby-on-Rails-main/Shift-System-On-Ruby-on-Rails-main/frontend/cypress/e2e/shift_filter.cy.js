describe('Vardiya Filtreleme', () => {
  const vardiyalar = [
    { 
      id: 1, 
      employee_name: 'Ayşe Yılmaz', 
      start_time: '2025-12-01T09:00:00.000Z', 
      end_time: '2025-12-01T17:00:00.000Z' 
    },
    { 
      id: 2, 
      employee_name: 'Mehmet Kaya', 
      start_time: '2025-12-02T09:00:00.000Z', 
      end_time: '2025-12-02T17:00:00.000Z' 
    },
    { 
      id: 3, 
      employee_name: 'Ayşe Demir', 
      start_time: '2025-12-03T09:00:00.000Z', 
      end_time: '2025-12-03T17:00:00.000Z' 
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', '/shifts', { body: vardiyalar }).as('getShifts');
    cy.visit('http://localhost:5173');
    cy.wait('@getShifts');
    cy.wait(1000);
  });

  it('çalışan adına göre vardiyaları filtreleyebilmeli', () => {
    // Filtre alanını doldur
    cy.get('input[name="name_filter"]').type('Ayşe');
    cy.wait(500);

    // Sadece Ayşe isimli çalışanların vardiyalarını göster
    cy.get('li').should('have.length', 2);
    cy.contains('li', 'Ayşe Yılmaz').should('be.visible');
    cy.contains('li', 'Ayşe Demir').should('be.visible');
    cy.contains('li', 'Mehmet Kaya').should('not.exist');
  });

  it('tarih aralığına göre vardiyaları filtreleyebilmeli', () => {
    // Tarih filtrelerini doldur
    cy.get('input[name="date_from"]').type('2025-12-01');
    cy.get('input[name="date_to"]').type('2025-12-02');
    cy.wait(500);

    // Belirtilen tarih aralığındaki vardiyaları göster
    cy.get('li').should('have.length', 2);
    cy.contains('li', 'Ayşe Yılmaz').should('be.visible');
    cy.contains('li', 'Mehmet Kaya').should('be.visible');
    cy.contains('li', 'Ayşe Demir').should('not.exist');
  });

  it('filtreleri temizleyebilmeli', () => {
    // Önce filtreleri uygula
    cy.get('input[name="name_filter"]').type('Ayşe');
    cy.wait(500);
    
    // Filtrelerin uygulandığını doğrula
    cy.get('li').should('have.length', 2);
    
    // Filtreleri temizle
    cy.get('button[name="clear_filters"]').click();
    cy.wait(500);
    
    // Tüm vardiyaların görüntülendiğini doğrula
    cy.get('li').should('have.length', 3);
    cy.contains('li', 'Ayşe Yılmaz').should('be.visible');
    cy.contains('li', 'Mehmet Kaya').should('be.visible');
    cy.contains('li', 'Ayşe Demir').should('be.visible');
  });

  it('birden fazla filtreyi birlikte kullanabilmeli', () => {
    // İsim ve tarih filtrelerini birlikte uygula
    cy.get('input[name="name_filter"]').type('Ayşe');
    cy.get('input[name="date_from"]').type('2025-12-01');
    cy.get('input[name="date_to"]').type('2025-12-02');
    cy.wait(500);

    // Sadece kriterlere uyan vardiyaları göster
    cy.get('li').should('have.length', 1);
    cy.contains('li', 'Ayşe Yılmaz').should('be.visible');
    cy.contains('li', 'Mehmet Kaya').should('not.exist');
    cy.contains('li', 'Ayşe Demir').should('not.exist');
  });

  it('geçersiz filtre değerleriyle hata mesajı göstermeli', () => {
    // Geçersiz tarih aralığı gir
    cy.get('input[name="date_from"]').type('2025-12-03');
    cy.get('input[name="date_to"]').type('2025-12-01');
    cy.wait(500);

    // Hata mesajını kontrol et
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Başlangıç tarihi bitiş tarihinden sonra olamaz');
  });
});