# Discord Bot — Ticket / Ban / Mesaj Silme

## Özellikler
- `/ban kullanici sebep` — kullanıcıyı yasaklar
- `/unban kullanici_id` — yasağı kaldırır
- `/kick kullanici sebep` — kullanıcıyı atar
- `/clear adet [kullanici]` — kanaldan toplu mesaj siler
- `/ticket-panel` — "Ticket Aç" butonlu bir panel gönderir. Butona basınca kullanıcıya özel bir destek kanalı açılır, kanalın içinde "Ticket'ı Kapat" butonu vardır.

## 1. Discord Developer Portal Ayarları
1. https://discord.com/developers/applications adresine git, **New Application** ile bot oluştur.
2. Sol menüden **Bot** sekmesine gir, **Reset Token** ile token al (bunu kimseyle paylaşma).
3. Aynı sayfada **Privileged Gateway Intents** kısmından **Server Members Intent** ve **Message Content Intent**'i aktif et.
4. **OAuth2 > URL Generator**'a git, scope olarak `bot` ve `applications.commands` seç. Permissions kısmından en azından şunları seç: `Ban Members`, `Kick Members`, `Manage Channels`, `Manage Messages`, `Send Messages`, `View Channels`.
5. Oluşan linki tarayıcıda açıp botu kendi sunucuna ekle.

## 2. Gerekli ID'leri toplama
Discord'da **Ayarlar > Gelişmiş > Geliştirici Modu**'nu aç. Sonra sağ tıklayarak ID kopyala:
- Sunucuna sağ tıkla → **GUILD_ID**
- Ticket kanallarının açılacağı kategoriye sağ tıkla → **TICKET_CATEGORY_ID**
- Destek/yetkili rolüne sağ tıkla → **SUPPORT_ROLE_ID**
- (Opsiyonel) log kanalına sağ tıkla → **LOG_CHANNEL_ID**
- Developer Portal'daki **General Information** sayfasından **CLIENT_ID** (Application ID)'yi al.

## 3. Kurulum (yerelde test için)
```bash
npm install
cp .env.example .env
```
`.env` dosyasını açıp topladığın TOKEN, CLIENT_ID, GUILD_ID vb. bilgileri gir.

Komutları Discord'a kaydet:
```bash
npm run deploy
```

Botu çalıştır:
```bash
npm start
```

## 4. Railway'e Deploy Etme
1. Bu klasörü bir GitHub reposuna yükle (`.env` dosyasını **yükleme**, sadece `.env.example` kalsın — `.gitignore` zaten bunu engelliyor).
2. https://railway.app adresine git, **New Project > Deploy from GitHub repo** seç, reponu bağla.
3. Railway projendeki **Variables** sekmesine gidip `.env` dosyasındaki tüm değişkenleri (TOKEN, CLIENT_ID, GUILD_ID, TICKET_CATEGORY_ID, SUPPORT_ROLE_ID, LOG_CHANNEL_ID) tek tek ekle.
4. **Settings > Deploy** kısmında Start Command'ın `npm start` olduğundan emin ol.
5. İlk deploy'dan sonra, komutları kaydetmek için Railway'in konsolundan bir kereliğine `npm run deploy` çalıştır (ya da yerelinden `.env`'i doldurup bir kere `npm run deploy` çalıştırıp sonra Railway'e sadece botu koy — komutlar Discord tarafında kalıcı kayıtlıdır, tekrar deploy'da kaybolmaz).

## 5. Kullanım
- Bir kanala `/ticket-panel` yaz, panel gönderilsin.
- Kullanıcılar butona basarak kendilerine özel ticket kanalı açabilir.
- Yetkililer `/ban`, `/kick`, `/unban`, `/clear` komutlarını kullanabilir (ilgili Discord izinlerine sahip olmaları gerekir).

## Notlar
- `/ban`, `/kick`, `/clear` komutları varsayılan olarak sadece ilgili Discord izinlerine (Ban Members, Kick Members, Manage Messages) sahip kişiler tarafından görülür/kullanılabilir. İstersen sunucu ayarlarından **Integrations > Bot İsmi** kısmından hangi rollerin hangi komutu kullanabileceğini daha ince ayarlayabilirsin.
- Token'ını asla paylaşma veya GitHub'a public olarak yükleme. Sızarsa Developer Portal'dan hemen **Reset Token** yap.
