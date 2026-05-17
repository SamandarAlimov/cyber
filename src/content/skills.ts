export type SkillLevel = "foundation" | "lab" | "professional";

export type SkillDomain = {
  id: string;
  level: SkillLevel;
  title: { uz: string; en: string };
  summary: { uz: string; en: string };
  mustKnow: { uz: string[]; en: string[] };
  practice: { uz: string[]; en: string[] };
  tools: string[];
  evidence: { uz: string; en: string };
};

export type ReferenceStandard = {
  title: string;
  url: string;
  description: { uz: string; en: string };
};

const k = (uz: string, en: string) => ({ uz, en });

export const SKILL_LEVEL_LABELS: Record<SkillLevel, { uz: string; en: string }> = {
  foundation: k("Poydevor", "Foundation"),
  lab: k("Amaliy lab", "Hands-on lab"),
  professional: k("Professional ish", "Professional work"),
};

export const ETHICAL_HACKER_SKILLS: SkillDomain[] = [
  {
    id: "ethics-scope-law",
    level: "foundation",
    title: k("Etika, qonun va scope", "Ethics, law, and scope"),
    summary: k(
      "Etik xakerning birinchi mahorati texnika emas, ruxsat, chegara va javobgarlikni tushunishdir.",
      "An ethical hacker's first skill is not a tool, but understanding authorization, boundaries, and responsibility.",
    ),
    mustKnow: {
      uz: [
        "Yozma ruxsat, scope, Rules of Engagement va test vaqti",
        "O'zbekiston kompyuter jinoyatlari, shaxsiy ma'lumotlar va kiberxavfsizlik talablari",
        "Responsible disclosure, bug bounty qoidalari va dalillarni xavfsiz saqlash",
      ],
      en: [
        "Written authorization, scope, Rules of Engagement, and test windows",
        "Uzbek computer crime, personal data, and cybersecurity requirements",
        "Responsible disclosure, bug bounty rules, and secure evidence handling",
      ],
    },
    practice: {
      uz: [
        "Scope hujjatini o'qib, nimaga tegish mumkin va mumkin emasligini ajrating",
        "Pentest boshlashdan oldin risk va impactni mijoz tili bilan yozing",
      ],
      en: [
        "Read a scope document and separate allowed and forbidden activities",
        "Before testing, write risk and impact in stakeholder language",
      ],
    },
    tools: ["Scope document", "RoE", "NDA", "Risk register", "Evidence log"],
    evidence: k(
      "Testga kirishdan oldin tayyorlangan scope checklist va evidence handling rejasi.",
      "A pre-test scope checklist and evidence handling plan.",
    ),
  },
  {
    id: "systems-os",
    level: "foundation",
    title: k("Linux, Windows va operatsion tizimlar", "Linux, Windows, and operating systems"),
    summary: k(
      "Buyruq qatori, fayl tizimi, servislar, loglar va ruxsatlar pentestdagi har bir qadamga ta'sir qiladi.",
      "Shells, file systems, services, logs, and permissions shape nearly every pentest step.",
    ),
    mustKnow: {
      uz: [
        "Linux users/groups, permissions, processes, systemd, journald va cron",
        "Windows NTFS, registry, services, PowerShell, Event Viewer va Active Directory asoslari",
        "Hash, encoding, environment variables, package managers va safe scripting",
      ],
      en: [
        "Linux users/groups, permissions, processes, systemd, journald, and cron",
        "Windows NTFS, registry, services, PowerShell, Event Viewer, and Active Directory basics",
        "Hashes, encoding, environment variables, package managers, and safe scripting",
      ],
    },
    practice: {
      uz: [
        "Linux VM ichida foydalanuvchi yaratib, permissions bilan tajriba qiling",
        "Windows labda local users, services va event loglarni tahlil qiling",
      ],
      en: [
        "Create users in a Linux VM and experiment with permissions",
        "Analyze local users, services, and event logs in a Windows lab",
      ],
    },
    tools: ["bash", "PowerShell", "systemctl", "journalctl", "Event Viewer", "Sysinternals"],
    evidence: k(
      "Linux va Windows lab bo'yicha commands transcript, screenshots va qisqa tahlil.",
      "Command transcripts, screenshots, and short analysis for Linux and Windows labs.",
    ),
  },
  {
    id: "networking",
    level: "foundation",
    title: k("Tarmoq asoslari", "Networking fundamentals"),
    summary: k(
      "TCP/IP, DNS, routing va HTTP'ni tushunmagan pentester natijani ham, xavfni ham noto'g'ri talqin qiladi.",
      "Without TCP/IP, DNS, routing, and HTTP knowledge, a tester misreads both results and risk.",
    ),
    mustKnow: {
      uz: [
        "OSI/TCP-IP model, subnetting, routing, NAT, VLAN va firewall tushunchalari",
        "DNS, HTTP/S, TLS, cookies, headers, proxies va API traffic",
        "Packet capture o'qish: handshake, SYN/ACK, reset, retransmission va latency",
      ],
      en: [
        "OSI/TCP-IP model, subnetting, routing, NAT, VLANs, and firewalls",
        "DNS, HTTP/S, TLS, cookies, headers, proxies, and API traffic",
        "Packet capture reading: handshakes, SYN/ACK, resets, retransmission, and latency",
      ],
    },
    practice: {
      uz: [
        "Nmap natijasini Wireshark capture bilan solishtiring",
        "DNS va HTTP request/response oqimini terminalda ko'rsating",
      ],
      en: [
        "Compare Nmap output with a Wireshark capture",
        "Show DNS and HTTP request/response flow from the terminal",
      ],
    },
    tools: ["ip", "ss", "dig", "curl", "nmap", "tcpdump", "Wireshark"],
    evidence: k(
      "Port scan, packet capture va topilgan servislar bo'yicha izohli jadval.",
      "An annotated table of port scans, packet captures, and discovered services.",
    ),
  },
  {
    id: "programming-automation",
    level: "foundation",
    title: k("Dasturlash va avtomatlashtirish", "Programming and automation"),
    summary: k(
      "Professional xaker tayyor tool ishlatish bilan cheklanmaydi; kichik parser, scanner va report helper yozadi.",
      "A professional hacker does more than run tools; they write parsers, scanners, and report helpers.",
    ),
    mustKnow: {
      uz: [
        "Python scripting, requests, argparse, JSON/CSV parsing va regex",
        "Bash pipeline, exit codes, redirection, cron va safe file handling",
        "JavaScript/TypeScript asoslari: browser, DOM, fetch, auth token va API logic",
      ],
      en: [
        "Python scripting, requests, argparse, JSON/CSV parsing, and regex",
        "Bash pipelines, exit codes, redirection, cron, and safe file handling",
        "JavaScript/TypeScript basics: browser, DOM, fetch, auth tokens, and API logic",
      ],
    },
    practice: {
      uz: [
        "Nmap XML/JSON outputdan servis inventory generator yozing",
        "HTTP endpointlarni tekshiruvchi kichik Python script yozing",
      ],
      en: [
        "Write a service inventory generator from Nmap XML/JSON output",
        "Write a small Python script that checks HTTP endpoints",
      ],
    },
    tools: ["Python", "Bash", "JavaScript", "jq", "regex", "Git"],
    evidence: k(
      "Git repo: input, script, sample output va README bilan kichik security tool.",
      "A Git repo with input, script, sample output, and README for a small security tool.",
    ),
  },
  {
    id: "web-appsec",
    level: "lab",
    title: k("Web va API xavfsizligi", "Web and API security"),
    summary: k(
      "Bug bounty va web pentestning markazi: access control, auth, injection, SSRF, XSS va API authorization.",
      "The core of bug bounty and web pentesting: access control, auth, injection, SSRF, XSS, and API authorization.",
    ),
    mustKnow: {
      uz: [
        "OWASP Top 10: access control, security misconfiguration, supply chain, crypto va injection",
        "Session management, JWT, OAuth/OIDC, CSRF, CORS, rate limit va business logic",
        "API testing: IDOR/BOLA, mass assignment, broken object property authorization",
      ],
      en: [
        "OWASP Top 10: access control, security misconfiguration, supply chain, crypto, and injection",
        "Session management, JWT, OAuth/OIDC, CSRF, CORS, rate limits, and business logic",
        "API testing: IDOR/BOLA, mass assignment, and broken object property authorization",
      ],
    },
    practice: {
      uz: [
        "DVWA/Juice Shop'da zaiflikni toping, PoC yozing va remediation bering",
        "Burp Repeater yordamida role-based access control test qiling",
      ],
      en: [
        "Find a vulnerability in DVWA/Juice Shop, write a PoC, and provide remediation",
        "Use Burp Repeater to test role-based access control",
      ],
    },
    tools: ["Burp Suite", "OWASP ZAP", "curl", "Postman", "sqlmap", "ffuf", "gobuster"],
    evidence: k(
      "Har bir zaiflik uchun request/response, impact, PoC va fix recommendation.",
      "For each finding: request/response, impact, PoC, and fix recommendation.",
    ),
  },
  {
    id: "recon-enumeration",
    level: "lab",
    title: k("Recon va enumeration", "Recon and enumeration"),
    summary: k(
      "Yaxshi pentest ko'p hollarda yaxshi inventorydan boshlanadi: asset, port, servis, texnologiya va attack surface.",
      "Good pentests often start with good inventory: assets, ports, services, technologies, and attack surface.",
    ),
    mustKnow: {
      uz: [
        "Passive OSINT va active scanning farqi, scopega hurmat",
        "DNS/subdomain enumeration, port scanning, service fingerprinting va screenshotting",
        "False positive/negative tushunchasi va topilmalarni prioritetlash",
      ],
      en: [
        "Difference between passive OSINT and active scanning, with respect for scope",
        "DNS/subdomain enumeration, port scanning, service fingerprinting, and screenshotting",
        "False positives/negatives and prioritizing discoveries",
      ],
    },
    practice: {
      uz: [
        "Lab domen uchun subdomain, DNS, port va web tech inventory tuzing",
        "Topilgan servislarni risk va keyingi test qadami bo'yicha saralang",
      ],
      en: [
        "Build subdomain, DNS, port, and web tech inventory for a lab domain",
        "Sort discovered services by risk and next testing step",
      ],
    },
    tools: ["amass", "subfinder", "httpx", "nmap", "whatweb", "EyeWitness"],
    evidence: k(
      "Asset inventory jadvali: hostname, IP, port, service, tech, risk note.",
      "Asset inventory table: hostname, IP, port, service, tech, risk note.",
    ),
  },
  {
    id: "exploitation-privesc",
    level: "lab",
    title: k("Exploitation va privilege escalation", "Exploitation and privilege escalation"),
    summary: k(
      "Exploit maqsad emas; maqsad zaiflikning real impactini scope ichida, xavfsiz va qaytariladigan tarzda isbotlash.",
      "Exploitation is not the goal; the goal is proving real impact safely, reversibly, and inside scope.",
    ),
    mustKnow: {
      uz: [
        "Exploit chain, payload risk, crash risk, cleanup va rollback",
        "Linux/Windows privilege escalation: misconfig, weak permissions, credential exposure",
        "Post-exploitation etikasi: data minimization, no backdoor, no persistence unless explicitly allowed",
      ],
      en: [
        "Exploit chains, payload risk, crash risk, cleanup, and rollback",
        "Linux/Windows privilege escalation: misconfigurations, weak permissions, credential exposure",
        "Post-exploitation ethics: data minimization, no backdoors, no persistence unless explicitly allowed",
      ],
    },
    practice: {
      uz: [
        "Metasploitable yoki HTB-style labda footholddan root/admin impactgacha hujjatlashtiring",
        "Exploitdan keyingi cleanup checklist tuzing",
      ],
      en: [
        "Document foothold-to-root/admin impact in a Metasploitable or HTB-style lab",
        "Create a post-exploitation cleanup checklist",
      ],
    },
    tools: ["Metasploit", "searchsploit", "linPEAS", "winPEAS", "GTFOBins", "LOLBAS"],
    evidence: k(
      "Exploit chain diagram, terminal transcript, screenshots va cleanup proof.",
      "Exploit chain diagram, terminal transcript, screenshots, and cleanup proof.",
    ),
  },
  {
    id: "cloud-devsecops",
    level: "professional",
    title: k("Cloud, container va DevSecOps", "Cloud, containers, and DevSecOps"),
    summary: k(
      "Zamonaviy platformalar cloud, container, CI/CD va secrets bilan yashaydi; pentester ham shu muhitni tushunishi kerak.",
      "Modern platforms live in cloud, containers, CI/CD, and secrets; testers must understand those environments.",
    ),
    mustKnow: {
      uz: [
        "Cloud IAM, storage exposure, metadata service, network security groups va audit logs",
        "Docker image, registry, Kubernetes RBAC, secrets, ingress va pod security",
        "CI/CD secrets, dependency risk, SAST/DAST, SBOM va supply chain xavflari",
      ],
      en: [
        "Cloud IAM, storage exposure, metadata service, network security groups, and audit logs",
        "Docker images, registries, Kubernetes RBAC, secrets, ingress, and pod security",
        "CI/CD secrets, dependency risk, SAST/DAST, SBOM, and supply chain risks",
      ],
    },
    practice: {
      uz: [
        "Lab cloud accountda IAM misconfig va public bucket riskini toping",
        "Docker/Kubernetes labda exposed secret yoki weak RBAC topilmasini yozing",
      ],
      en: [
        "Find IAM misconfiguration and public bucket risk in a lab cloud account",
        "Document an exposed secret or weak RBAC finding in a Docker/Kubernetes lab",
      ],
    },
    tools: ["Docker", "kubectl", "Trivy", "Semgrep", "gitleaks", "ScoutSuite", "Prowler"],
    evidence: k(
      "Cloud/container finding: affected resource, misconfig, blast radius va fix.",
      "Cloud/container finding: affected resource, misconfig, blast radius, and fix.",
    ),
  },
  {
    id: "wireless-iot",
    level: "lab",
    title: k("Wireless, IoT va hardware asoslari", "Wireless, IoT, and hardware basics"),
    summary: k(
      "WiFi va IoT testlari faqat o'z labingizda va ruxsatli muhitda bajariladi; RF asoslari va monitoringni bilish zarur.",
      "WiFi and IoT testing belongs only in your own lab or authorized environments; RF basics and monitoring are essential.",
    ),
    mustKnow: {
      uz: [
        "WPA2/WPA3, WPS, PMF, handshake, PMKID va deauth tushunchalari",
        "2.4/5 GHz kanallar, monitor mode, adapter chipset va legal RF chegaralari",
        "IoT firmware, default credentials, insecure protocols va update risklari",
      ],
      en: [
        "WPA2/WPA3, WPS, PMF, handshakes, PMKID, and deauth concepts",
        "2.4/5 GHz channels, monitor mode, adapter chipsets, and legal RF boundaries",
        "IoT firmware, default credentials, insecure protocols, and update risks",
      ],
    },
    practice: {
      uz: [
        "O'zingizning routeringizda WPA2/WPA3 hardening checklist bajaring",
        "Lab SSID uchun monitor mode, capture va defensive recommendation yozing",
      ],
      en: [
        "Run a WPA2/WPA3 hardening checklist on your own router",
        "For a lab SSID, document monitor mode, capture, and defensive recommendations",
      ],
    },
    tools: ["aircrack-ng", "airodump-ng", "iwconfig", "Wireshark", "hashcat", "Firmware analysis tools"],
    evidence: k(
      "Wireless lab report: adapter, channel, capture evidence, risk va hardening.",
      "Wireless lab report: adapter, channel, capture evidence, risk, and hardening.",
    ),
  },
  {
    id: "blue-team-detection",
    level: "professional",
    title: k("Blue team va detection fikrlashi", "Blue team and detection mindset"),
    summary: k(
      "Yaxshi red teamer himoyachi qanday ko'rishini tushunadi: log, alert, detection engineering va MITRE ATT&CK mapping.",
      "A good red teamer understands the defender's view: logs, alerts, detection engineering, and MITRE ATT&CK mapping.",
    ),
    mustKnow: {
      uz: [
        "Authentication logs, web logs, endpoint telemetry, EDR/SIEM asoslari",
        "MITRE ATT&CK tactic/technique mapping va detection gap tahlili",
        "Purple team: testdan keyin detection va hardeningni yaxshilash",
      ],
      en: [
        "Authentication logs, web logs, endpoint telemetry, and EDR/SIEM basics",
        "MITRE ATT&CK tactic/technique mapping and detection gap analysis",
        "Purple team: improving detection and hardening after testing",
      ],
    },
    practice: {
      uz: [
        "Nmap scan va login failure loglarini SIEM queryga aylantiring",
        "Topilmaga ATT&CK technique va detection recommendation qo'shing",
      ],
      en: [
        "Turn Nmap scan and login failure logs into SIEM queries",
        "Add ATT&CK technique and detection recommendation to a finding",
      ],
    },
    tools: ["MITRE ATT&CK", "Sigma", "YARA", "Splunk", "Elastic", "Wazuh"],
    evidence: k(
      "Finding reportga ATT&CK mapping, log artifact va detection query qo'shilgan bo'lishi.",
      "A finding report with ATT&CK mapping, log artifact, and detection query.",
    ),
  },
  {
    id: "reporting-communication",
    level: "professional",
    title: k("Hisobot, kommunikatsiya va remediation", "Reporting, communication, and remediation"),
    summary: k(
      "Pentestning eng qimmat mahsuloti report: aniq impact, takrorlanadigan PoC va tuzatish rejasi.",
      "The most valuable pentest deliverable is the report: clear impact, reproducible PoC, and remediation plan.",
    ),
    mustKnow: {
      uz: [
        "Executive summary, technical finding, severity, CVSS va business impact",
        "Evidence: screenshot, request/response, logs, timestamps va test environment",
        "Remediation, retest, risk acceptance va mijoz bilan professional yozishmalar",
      ],
      en: [
        "Executive summary, technical findings, severity, CVSS, and business impact",
        "Evidence: screenshots, request/response, logs, timestamps, and test environment",
        "Remediation, retesting, risk acceptance, and professional client communication",
      ],
    },
    practice: {
      uz: [
        "Bitta zaiflikni executive va technical auditoriya uchun ikki formatda yozing",
        "Remediationdan keyingi retest natijasini oldingi evidence bilan solishtiring",
      ],
      en: [
        "Write one vulnerability in both executive and technical formats",
        "Compare retest results with the original evidence after remediation",
      ],
    },
    tools: ["Markdown", "CVSS calculator", "Screenshots", "Evidence log", "Report template"],
    evidence: k(
      "Professional pentest report: summary, scope, findings, evidence, remediation, retest.",
      "Professional pentest report: summary, scope, findings, evidence, remediation, retest.",
    ),
  },
];

export const REFERENCE_STANDARDS: ReferenceStandard[] = [
  {
    title: "NIST NICE Framework",
    url: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-cybersecurity-workforce-framework",
    description: k(
      "Kiberxavfsizlik ishi, bilim va ko'nikmalarini umumiy tilda tasvirlaydigan framework.",
      "A common-language framework for cybersecurity work and the knowledge and skills required.",
    ),
  },
  {
    title: "OWASP Top 10:2025",
    url: "https://owasp.org/Top10/2025/",
    description: k(
      "Web ilovalar uchun eng muhim xavfsizlik risklari bo'yicha sanoatdagi awareness standarti.",
      "An industry awareness standard for the most critical web application security risks.",
    ),
  },
  {
    title: "MITRE ATT&CK",
    url: "https://attack.mitre.org/",
    description: k(
      "Hujumchi xatti-harakatlarini tactic va technique sifatida xaritalash uchun knowledge base.",
      "A knowledge base for mapping adversary behavior into tactics and techniques.",
    ),
  },
  {
    title: "PTES",
    url: "https://www.pentest-standard.org/index.php/Main_Page",
    description: k(
      "Pentest jarayonini pre-engagementdan reportinggacha bosqichlarga ajratadigan metodologiya.",
      "A methodology that structures penetration testing from pre-engagement through reporting.",
    ),
  },
];
