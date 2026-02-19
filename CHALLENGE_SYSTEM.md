# Oyun Dəvəti Sistemi - İstifadə Təlimatı

## Xüsusiyyətlər

Komandalar artıq bir-birinə oyun dəvəti göndərə bilərlər!

## Necə İşləyir

### 1. Kapitan olaraq daxil olun
- Login səhifəsinə gedin
- "👨‍✈️ Kapitan kimi daxil ol" düyməsini basın
- Və ya öz captain hesabınızla daxil olun

### 2. Komanda yaradın (əgər yoxdursa)
- Captain Dashboard-a gedin
- "Komanda Yarat" düyməsini basın
- Komanda məlumatlarını doldurun

### 3. Digər komandaya dəvət göndərin
**Metod 1: Team Detail səhifəsindən**
- Teams səhifəsinə gedin
- İstənilən komandanı seçin
- "⚽ Oyuna Dəvət Et" düyməsini basın
- Oyun məlumatlarını doldurun:
  - Tarix
  - Vaxt
  - Meydança
  - Əlavə qeyd (ixtiyari)
- "Dəvət Göndər" basın

**Metod 2: Demo test üçün**
- Sistem avtomatik olaraq 3 demo komanda yaradır
- İstənilən komandaya dəvət göndərə bilərsiniz

### 4. Dəvətləri idarə edin (Captain Dashboard)
- Captain Dashboard-a gedin
- "⚽ Oyun Dəvətləri" bölməsində:
  - **Gələn Dəvətlər**: Sizə göndərilən dəvətlər
    - ✅ Qəbul et
    - ❌ Rədd et
  - **Göndərilmiş Dəvətlər**: Sizin göndərdiyiniz dəvətlər
    - 🗑️ Ləğv et

## Əlavə Edilən Fayllar

1. `assets/js/team-challenge.js` - Dəvət göndərmə sistemi
2. `assets/js/dashboard-challenges.js` - Dashboard-da dəvətləri göstərmək
3. `assets/js/demo-data.js` - Test məlumatları

## Statuslar

- **Pending** (Gözləyir) - Dəvət göndərilib, cavab gözlənir
- **Accepted** (Qəbul edildi) - Dəvət qəbul edilib, oyun təsdiqlənib
- **Rejected** (Rədd edildi) - Dəvət rədd edilib
- **Cancelled** (Ləğv edildi) - Dəvət göndərən tərəfindən ləğv edilib

## LocalStorage Strukturu

```javascript
// teamChallenges
[
  {
    id: timestamp,
    challengerTeamId: 1,
    challengerTeamName: "Qarabag Legends",
    challengedTeamId: 2,
    challengedTeamName: "Gəncə FC",
    matchDate: "2026-02-15",
    matchTime: "18:00",
    location: "Bakıxanov Stadionu",
    note: "Dostluq matçı",
    status: "pending",
    createdAt: ISO timestamp
  }
]
```

## Test Etmək

1. Login ol (Captain)
2. Team Detail səhifəsinə get
3. "Oyuna Dəvət Et" bas
4. Form doldur və göndər
5. Captain Dashboard-a get
6. Dəvətləri gör və idarə et

## Gələcək Təkmilləşdirmələr

- [ ] Bildirişlər sistemi
- [ ] Email bildirişləri
- [ ] Oyun tarixçəsi
- [ ] Statistika
- [ ] Təqvim inteqrasiyası
