# Cyber Alsamos — To'liq Professional Platforma Roadmap

## Maqsad
`cyber.alsamos.com` — O'zbek tilidagi birinchi to'liq professional ethical hacking ta'lim platformasi. Glassmorphism + reallik ranglar (hacker yashil/qora + Alsamos orange aksent). Foydalanuvchi platformada o'qiydi → komandlarni copy qiladi → o'z Kali Linux'ida sinaydi.

## Arxitektura prinsipi
- **Mehmon (guest)**: barcha darslarni to'liq o'qiy oladi, terminal simulyatorda sinay oladi, copy qila oladi
- **Ro'yxatdan o'tgan**: progress saqlanadi, streak, profile, sertifikat, qayerda to'xtaganini eslab qoladi, bookmark, izohlar

## Kurs strukturasi (8 modul, 50+ dars)

### Module 1 — Kirish va Asoslar
- Kiberxavfsizlik nima? Xavf vs Tahdid vs Zaiflik
- CIA triadasi (Confidentiality, Integrity, Availability)
- Xakerlar turlari: White / Black / Grey hat
- Etik xakerlik: prinsiplar va chegaralar
- O'zbekiston qonunchiligi: AKT to'g'risidagi qonun, KRITIS, shaxsiy ma'lumotlar

### Module 2 — Lab muhitini qurish
- VirtualBox / VMware o'rnatish
- Kali Linux ISO, virtual mashina sozlash
- Snapshot, network rejimlar (NAT, Host-only, Bridged)
- Metasploitable, DVWA, Windows lab

### Module 3 — Linux Mastery
- Linux arxitekturasi: kernel, shell, process
- Fayl tizimi, navigatsiya (`ls`, `cd`, `pwd`, `find`)
- Foydalanuvchi boshqaruvi: `useradd`, `passwd`, `sudo`, `/etc/shadow`
- Permissions: `chmod`, `chown`, SUID/SGID
- Bash scripting asoslari, cron
- SSH, UFW (firewall), Fail2Ban
- Tarmoq tahlili: Wireshark, tcpdump

### Module 4 — Windows Security
- NTFS permissions, Registry tuzilishi
- Active Directory asoslari (DC, OU, GPO)
- Audit policy, Windows Defender, Event Viewer
- Hujum texnikalari: Mimikatz, Pass-the-Hash, Token impersonation
- Privilege escalation (Windows)

### Module 5 — Tarmoqshunoslik
- OSI modeli (7 qatlam) + TCP/IP
- IP, MAC, ARP, DNS, DHCP, NAT
- Nmap (host discovery, port scan, version, scripts)
- Wireshark filterlar, Scapy bilan paket yaratish
- traceroute, netstat, ss
- Hujumlar: MITM, ARP poisoning, DNS spoofing, DDoS (lab)

### Module 6 — Penetration Testing Toolkit
- Kali sozlamalari, repository, root
- Nmap chuqur
- Netcat (bind/reverse shell)
- Metasploit Framework: msfconsole, exploit, payload, meterpreter
- Burp Suite: proxy, repeater, intruder
- Lab: DVWA, Metasploitable, TryHackMe yo'naltirish

### Module 7 — Web Application Security
- HTTP/HTTPS, headers, cookies, session
- OWASP Top 10
- XSS (reflected, stored, DOM), SQLi (union, blind, time-based)
- IDOR, CSRF, SSRF, File upload, LFI/RFI
- Cookie hijacking, header manipulation
- Tools: ZAP, Burp Suite, WFuzz, Dirbuster, sqlmap

### Module 8 — Exploitation va Post-Exploitation
- Buffer overflow asoslari (x86)
- Reverse shell, bind shell, encoded payloads
- Privilege escalation (Linux + Windows)
- Credential harvesting, password cracking (John, Hashcat)
- Custom tooling: Veil, Empire, oddiy keylogger (educational)
- Real infratuzilmaga simulyatsiya: AD, DNS, Web

### Module 9 — Pentest Reporting
- Hisobot strukturasi (Executive summary, Findings, CVSS)
- Xavf baholash metodologiyasi
- Tavsiyalar va remediation
- Yakuniy capstone loyiha + taqdimot

## Sahifalar
- `/` — Landing (hero, modul preview, CTA)
- `/roadmap` — **YANGI** to'liq vizual roadmap (8 modul timeline)
- `/learn` — Modullar grid
- `/learn/$trackId` — Modul ichidagi darslar ro'yxati
- `/learn/$trackId/$lessonId` — Dars + terminal + copy commands
- `/profile` — Streak, progress, davom ettirish
- `/auth` — Kirish/ro'yxatdan o'tish
- `/about` — Alsamos Corporation
- `/legal` — O'zbekiston qonunchiligi reference

## UI/Dizayn tizimi
- **Glassmorphism**: `backdrop-blur-xl`, yarim shaffof, nozik border, ichki glow
- **Ranglar (oklch)**:
  - bg: chuqur qora `oklch(0.10 0.015 150)`
  - foreground: terminal yashil `oklch(0.92 0.18 145)`
  - primary (neon green): `oklch(0.82 0.25 145)` + glow
  - accent (Alsamos orange): `oklch(0.72 0.2 50)` — CTA, brending
  - danger (red hex): `oklch(0.65 0.25 25)` — exploit/critical
  - warning: `oklch(0.85 0.18 90)`
- **Shrift**: Space Grotesk (display), JetBrains Mono (terminal/code)
- **Fon**: animatsiyali matrix grid + radial glow (CSS only)
- **Komponentlar**: `GlassCard`, `CommandBlock` (copy ikonkasi), `Terminal`, `RoadmapTimeline`, `ModuleCard`, `LessonStepper`, `ProgressBar`

## Texnik
- TanStack Start + React 19 + Tailwind v4
- Lovable Cloud (Supabase): auth, profiles, user_progress (mavjud)
- Schema kengaytirish: `bookmarks`, `lesson_notes` (keyin)
- xterm.js (mavjud) — simulyator rejimda
- i18n UZ/EN (mavjud)

## Yetkazib berish bosqichlari (bu loop)
1. Lessons content kengaytirish: 8 modul, har modulda 4-7 dars (skeleton + asosiy darslar to'liq matn)
2. `/roadmap` sahifasi — vizual timeline (8 modul, progress bilan)
3. `/learn` sahifasini yangi 8 modul strukturasiga moslash
4. `/learn/$trackId` — modul ichidagi darslar ro'yxati sahifasi (yangi route)
5. Lesson sahifasini boyitish: oldingi/keyingi navigatsiya, modul progress bar, "Kali'da sinash" warning, qadamlar checklist
6. Landing sahifani yangilash: 8 modul preview, roadmap CTA, statistikalar
7. Header'ga "Roadmap" link qo'shish
8. Design tokenlar: danger/warning ranglar qo'shish, glow effektlarni kuchaytirish
9. SEO: har route uchun unique meta

## Keyingi loop'larda
- Har dars uchun to'liq professional matn (hozir skeleton + 15 ta to'liq dars)
- Capstone CTF rejim
- Sertifikat generatsiya (PDF)
- Bookmark va izohlar
- Real sandbox (E2B yoki o'z VPS'i tayyor bo'lganda)

Tasdiqlasangiz, 1-bosqichdan boshlayman.
