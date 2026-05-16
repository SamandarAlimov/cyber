// Lightweight terminal simulator: virtual FS + a handful of commands.
// Returns text output for a command relative to a session state.

export type SessionState = {
  cwd: string;
  fs: Record<string, string | null>; // null = directory marker, string = file content
  history: string[];
};

const DEFAULT_FS: Record<string, string | null> = {
  "/home/hacker": null,
  "/home/hacker/notes.txt":
    "Welcome to Cyber Alsamos lab.\nFLAG{alsamos_first_step}\nKeep going!",
  "/home/hacker/script.sh": "#!/bin/bash\necho executed",
  "/home/hacker/loot": null,
  "/home/hacker/loot/.secret": "shh",
  "/home/hacker/loot/creds.txt": "admin:hunter2",
  "/etc": null,
  "/etc/hosts": "127.0.0.1 localhost\n10.10.10.5 target.lab",
};

const PERMS: Record<string, string> = {
  "/home/hacker/script.sh": "-rw-r--r--",
};

export function createSession(overrides?: {
  cwd?: string;
  fs?: Record<string, string>;
}): SessionState {
  const fs = { ...DEFAULT_FS };
  if (overrides?.fs)
    for (const [k, v] of Object.entries(overrides.fs)) fs[k] = v;
  return { cwd: overrides?.cwd ?? "/home/hacker", fs, history: [] };
}

const norm = (cwd: string, p: string): string => {
  if (!p || p === ".") return cwd;
  if (p === "~" || p.startsWith("~/")) p = "/home/hacker" + p.slice(1);
  let abs = p.startsWith("/") ? p : cwd.replace(/\/$/, "") + "/" + p;
  const parts: string[] = [];
  for (const seg of abs.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
};

const isDir = (s: SessionState, path: string) =>
  s.fs[path] === null || Object.keys(s.fs).some((k) => k.startsWith(path + "/"));

const listDir = (s: SessionState, path: string, all = false): string[] => {
  const prefix = path === "/" ? "/" : path + "/";
  const set = new Set<string>();
  for (const key of Object.keys(s.fs)) {
    if (key === path) continue;
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    const name = rest.split("/")[0];
    if (!all && name.startsWith(".")) continue;
    set.add(name);
  }
  return Array.from(set).sort();
};

export type ExecResult = { out: string; state: SessionState };

export function execCommand(state: SessionState, raw: string): ExecResult {
  const line = raw.trim();
  if (!line) return { out: "", state };
  const s: SessionState = { ...state, history: [...state.history, line] };
  let execLine = line.replace(/^sudo\s+/, "");
  if (line.startsWith("#")) {
    return { out: line.slice(1).trim(), state: s };
  }

  if (execLine.includes(" && ")) {
    let current = s;
    const outputs: string[] = [];
    for (const part of execLine.split(" && ")) {
      const result = execCommand(current, part);
      current = result.state;
      if (result.out) outputs.push(result.out);
    }
    return { out: outputs.join("\n"), state: current };
  }

  // handle redirection: echo "x" > file.txt
  const redirMatch = execLine.match(/^(.*?)\s*>\s*(\S+)\s*$/);
  if (redirMatch) {
    const [, leftRaw, target] = redirMatch;
    const leftRes = execCommand(s, leftRaw);
    const path = norm(s.cwd, target);
    const newFs = { ...leftRes.state.fs, [path]: leftRes.out.replace(/\n$/, "") };
    return { out: "", state: { ...leftRes.state, fs: newFs } };
  }

  // handle pipe: cmd | grep x  (simple, only one pipe)
  if (execLine.includes(" | ")) {
    const [a, b] = execLine.split(" | ");
    const r1 = execCommand(s, a);
    const r2 = execCommand(r1.state, b + " --stdin");
    // For simplicity, naive: re-run grep with input embedded
    if (b.trim().startsWith("grep")) {
      const arg = b.trim().split(/\s+/)[1] ?? "";
      const matched = r1.out
        .split("\n")
        .filter((l) => l.includes(arg))
        .join("\n");
      return { out: matched, state: r1.state };
    }
    if (b.trim().startsWith("head")) {
      const countArg = b.trim().split(/\s+/).find((arg) => /^-\d+$/.test(arg));
      const count = countArg ? Number(countArg.slice(1)) : 10;
      return { out: r1.out.split("\n").slice(0, count).join("\n"), state: r1.state };
    }
    return r2;
  }

  const tokens = execLine.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
  const argv = tokens.map((t) => t.replace(/^['"]|['"]$/g, ""));
  const cmd = argv[0];
  const args = argv.slice(1);

  const handlers: Record<string, () => string | { out: string; state?: SessionState }> = {
    help: () =>
      "Available: pwd, ls, cd, cat, grep, echo, chmod, ping, nslookup, nmap, curl, airmon-ng, iwconfig, airodump-ng, aireplay-ng, aircrack-ng, whoami, clear, history",
    whoami: () => "hacker",
    pwd: () => s.cwd,
    history: () => s.history.map((h, i) => `${i + 1}  ${h}`).join("\n"),
    clear: () => "\u0000CLEAR",
    ls: () => {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const targets = args.filter((a) => !a.startsWith("-"));
      const targetPath = norm(s.cwd, targets[0] ?? ".");
      if (!isDir(s, targetPath) && s.fs[targetPath] !== undefined) {
        // single file
        if (flags.includes("l")) {
          const perm = PERMS[targetPath] ?? "-rw-r--r--";
          return `${perm} 1 hacker hacker  ${(s.fs[targetPath] ?? "").length} Jan 01 12:00 ${targetPath.split("/").pop()}`;
        }
        return targetPath.split("/").pop() ?? "";
      }
      const all = flags.includes("a");
      const long = flags.includes("l");
      const names = listDir(s, targetPath, all);
      if (!long) return names.join("  ");
      return names
        .map((n) => {
          const full = norm(targetPath, n);
          const dir = isDir(s, full);
          const perm = dir ? "drwxr-xr-x" : PERMS[full] ?? "-rw-r--r--";
          const size = dir ? 4096 : (s.fs[full] ?? "").length;
          return `${perm} 1 hacker hacker  ${size} Jan 01 12:00 ${n}`;
        })
        .join("\n");
    },
    cd: () => {
      const target = norm(s.cwd, args[0] ?? "/home/hacker");
      if (!isDir(s, target)) return { out: `cd: ${args[0]}: No such directory` };
      return { out: "", state: { ...s, cwd: target } };
    },
    cat: () => {
      if (!args[0]) return "";
      const p = norm(s.cwd, args[0]);
      const v = s.fs[p];
      if (v === undefined || v === null) return `cat: ${args[0]}: No such file`;
      return v;
    },
    grep: () => {
      const [pattern, file] = args.filter((a) => !a.startsWith("--"));
      if (!pattern) return "";
      if (!file) return "";
      const p = norm(s.cwd, file);
      const v = s.fs[p];
      if (typeof v !== "string") return `grep: ${file}: No such file`;
      return v.split("\n").filter((l) => l.includes(pattern)).join("\n");
    },
    echo: () => args.join(" "),
    tee: () => args.join(" ").replace(/^-a\s+/, ""),
    chmod: () => {
      const [mode, file] = args;
      if (!mode || !file) return "chmod: missing operand";
      const p = norm(s.cwd, file);
      if (s.fs[p] === undefined) return `chmod: ${file}: No such file`;
      if (mode.includes("x")) PERMS[p] = "-rwxr-xr-x";
      return "";
    },
    "sha256sum": () => "a91f4f8c2d85e742c7aa1b3f9117f3f8f1e7c73a4b7c64d0bbccdf4b4b1e8c2f  important.txt",
    openssl: () => "enter AES-256-CBC encryption password:\nVerifying - enter AES-256-CBC encryption password:\nsecret.enc created",
    VBoxManage: () => {
      if (args[0] === "--version") return "7.0.18r162988";
      if (args[0] === "list") return '"Kali" {a1b2c3d4-1111-2222-3333-abcdefabcdef}\n"Metasploitable" {b2c3d4e5-2222-3333-4444-bcdefabcdefa}';
      if (args[0] === "snapshot") return "0%...10%...20%...100%\nSnapshot taken. UUID: 3f2f85cf-9a86-4c34-b75c-cleaninstall";
      return "VirtualBox VM manager command completed";
    },
    apt: () => {
      if (args[0] === "install") return "Reading package lists... Done\nBuilding dependency tree... Done\nThe following packages were installed successfully.";
      return "Hit:1 http://http.kali.org/kali kali-rolling InRelease\nReading package lists... Done\nAll packages are up to date.";
    },
    "kali-tweaks": () => "Kali Tweaks opened. Recommended: enable virtualization guest tools and default terminal settings.",
    ip: () => {
      if (args[0] === "route") return "default via 10.0.2.2 dev eth0 proto dhcp\n10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15";
      return "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0\n3: wlan0: <BROADCAST,MULTICAST> mtu 1500\n    inet 192.168.1.23/24 brd 192.168.1.255 scope global wlan0";
    },
    arp: () => "? (10.10.10.1) at 08:00:27:aa:bb:01 [ether] on eth0\n? (10.10.10.5) at 08:00:27:aa:bb:05 [ether] on eth0",
    docker: () => "Unable to find image locally\nPull complete\nContainer started. Lab is available on http://127.0.0.1",
    find: () => "/etc/ssh/ssh_config\n/etc/nginx/nginx.conf\n/etc/mysql/my.cnf\n/usr/share/doc/example.conf",
    "useradd": () => "",
    id: () => "uid=1001(alice) gid=1001(alice) groups=1001(alice)",
    "ssh-keygen": () => "Generating public/private ed25519 key pair.\nYour identification has been saved in /home/hacker/.ssh/id_ed25519\nYour public key has been saved in /home/hacker/.ssh/id_ed25519.pub",
    "ssh-copy-id": () => "Number of key(s) added: 1\nNow try logging into the machine.",
    ufw: () => "Rules updated\nFirewall is active and enabled on system startup",
    systemctl: () => "● fail2ban.service - Fail2Ban Service\n     Loaded: loaded\n     Active: active (running)",
    tcpdump: () => "listening on eth0, link-type EN10MB (Ethernet)\n10:21:04 IP 10.10.10.5.80 > 10.0.2.15.51544: Flags [P.], length 512",
    wireshark: () => "Opening capture.pcap in Wireshark...",
    airmon-ng: () => {
      if (args[0] === "check" && args[1] === "kill") {
        return [
          "Killing these processes:",
          "",
          "  PID Name",
          "  839 NetworkManager",
          " 1000 wpa_supplicant",
        ].join("\n");
      }
      if (args[0] === "start") {
        return [
          "Found 2 processes that could cause trouble.",
          "Kill them using 'airmon-ng check kill' before putting",
          "the card in monitor mode, they will interfere by changing channels",
          "and sometimes putting the interface back in managed mode",
          "",
          "  PID Name",
          "  839 NetworkManager",
          " 1000 wpa_supplicant",
          "",
          "PHY     Interface       Driver          Chipset",
          "",
          "phy0    wlan0           mt7921e         MEDIATEK Corp. MT7921 802.11ax PCIe Wireless Network Adapter",
          "",
          "        (mac80211 monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)",
          "        (mac80211 station mode vif disabled for [phy0]wlan0)",
        ].join("\n");
      }
      if (args[0] === "stop") return "PHY     Interface       Driver          Chipset\nphy0    wlan0mon        mt7921e         MEDIATEK Corp. MT7921\n\n(mac80211 station mode vif enabled on [phy0]wlan0)";
      return [
        "PHY     Interface       Driver          Chipset",
        "",
        "phy0    wlan0           mt7921e         MEDIATEK Corp. MT7921 802.11ax PCIe Wireless Network Adapter",
      ].join("\n");
    },
    iwconfig: () =>
      [
        "lo        no wireless extensions.",
        "",
        "eth0      no wireless extensions.",
        "",
        "docker0   no wireless extensions.",
        "",
        "wlan0mon  IEEE 802.11  Mode:Monitor  Frequency:2.457 GHz",
        "          Retry short limit:7   RTS thr:off   Fragment thr:off",
        "          Power Management:on",
      ].join("\n"),
    "airodump-ng": () =>
      [
        " CH  5 ][ Elapsed: 0 mins ][ 2026-05-16 23:31",
        "",
        " BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID",
        "",
        " 7C:8B:CA:B8:B3:B4  -42      128       44    2   5  130   WPA2 CCMP   PSK  Alsamos-Lab",
        " 18:31:BF:44:10:90  -71       84        0    0   1  130   WPA2 CCMP   PSK  Guest-WiFi",
        "",
        " BSSID              STATION            PWR   Rate    Lost    Frames  Notes",
        " 7C:8B:CA:B8:B3:B4  A4:6B:40:79:76:AE  -51    0 - 1      0       32",
      ].join("\n"),
    "aireplay-ng": () =>
      [
        "23:31:11  Waiting for beacon frame (BSSID: 7C:8B:CA:B8:B3:B4) on channel 5",
        "23:31:12  Sending 64 directed DeAuth (code 7). STMAC: [A4:6B:40:79:76:AE] [ 0|64 ACKs]",
        "23:31:13  WPA handshake captured in capture_handshake-01.cap",
      ].join("\n"),
    "aircrack-ng": () =>
      [
        "Opening capture_handshake-01.cap",
        "Read 1287 packets.",
        "",
        "   #  BSSID              ESSID                     Encryption",
        "   1  7C:8B:CA:B8:B3:B4  Alsamos-Lab               WPA (1 handshake)",
        "",
        "KEY FOUND! [ alsamos-lab-2026 ]",
      ].join("\n"),
    wash: () =>
      "BSSID               Ch  dBm  WPS  Lck  Vendor    ESSID\n7C:8B:CA:B8:B3:B4    5  -42  2.0  No   TP-Link   Alsamos-Lab",
    reaver: () =>
      "[+] Waiting for beacon from 7C:8B:CA:B8:B3:B4\n[+] Associated with 7C:8B:CA:B8:B3:B4\n[!] WPS pin testing started in lab mode",
    bully: () =>
      "[+] Using interface wlan0mon\n[+] Associated with 7C:8B:CA:B8:B3:B4\n[+] WPS transaction started",
    hcxdumptool: () =>
      "initialization of hcxdumptool 6.3.4\ninterface wlan0mon is up\nPMKID captured from 7C:8B:CA:B8:B3:B4",
    hcxpcapngtool: () => "summary capture file\nPMKID written to hash.22000",
    hashcat: () =>
      "hashcat (v6.2.6) starting\nStatus...........: Cracked\nRecovered........: 1/1\nCandidate........: alsamos-lab-2026",
    ping: () => {
      const host = args[args.length - 1];
      if (!host) return "ping: usage: ping [-c N] host";
      return [
        `PING ${host} (10.10.10.5): 56 data bytes`,
        `64 bytes from 10.10.10.5: icmp_seq=0 ttl=64 time=12.3 ms`,
        `64 bytes from 10.10.10.5: icmp_seq=1 ttl=64 time=11.8 ms`,
        `--- ${host} ping statistics ---`,
        `2 packets transmitted, 2 received, 0% packet loss`,
      ].join("\n");
    },
    nslookup: () => {
      const host = args[0];
      if (!host) return "nslookup: missing host";
      if (host === "target.lab")
        return `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\nName:    target.lab\nAddress: 10.10.10.5`;
      return `Server:  1.1.1.1\nAddress: 1.1.1.1#53\n\n** server can't find ${host}: NXDOMAIN`;
    },
    nmap: () => {
      const host = args[args.length - 1];
      if (!host) return "Nmap: usage: nmap [opts] host";
      const fast = args.includes("-F");
      const sv = args.includes("-sV");
      const portArg = args[args.indexOf("-p") + 1];
      const lines = [`Starting Nmap 7.94 ( https://nmap.org )`, `Nmap scan report for ${host} (10.10.10.5)`, `Host is up (0.012s latency).`];
      if (sv && portArg === "80") {
        lines.push(`PORT   STATE SERVICE VERSION`);
        lines.push(`80/tcp open  http    Apache httpd 2.4.41`);
      } else if (fast) {
        lines.push(`PORT     STATE SERVICE`);
        lines.push(`22/tcp   open  ssh`);
        lines.push(`80/tcp   open  http`);
        lines.push(`443/tcp  open  https`);
      } else {
        lines.push(`PORT     STATE SERVICE`);
        lines.push(`22/tcp   open  ssh`);
        lines.push(`80/tcp   open  http`);
      }
      lines.push(`Nmap done: 1 IP address scanned in 1.42 seconds`);
      return lines.join("\n");
    },
    curl: () => {
      const showHeaders = args.includes("-I");
      const url = args.find((a) => a.startsWith("http")) ?? "";
      if (showHeaders)
        return [
          "HTTP/1.1 200 OK",
          "Server: Apache/2.4.41 (Ubuntu)",
          "Content-Type: text/html",
          "Content-Length: 312",
        ].join("\n");
      if (url.includes("/login")) {
        if (url.includes("'--") || url.includes("%27--"))
          return "Welcome admin — auth bypassed";
        return "Invalid credentials";
      }
      return "<html><body><h1>Welcome to target.lab</h1></body></html>";
    },
    "./script.sh": () => "executed",
  };

  const handler = handlers[cmd];
  if (!handler) {
    return {
      out: [
        `${cmd}: this browser simulator does not include that tool yet.`,
        "Copy the command and run it inside your authorized Kali Linux lab.",
      ].join("\n"),
      state: s,
    };
  }
  const res = handler();
  if (typeof res === "string") return { out: res, state: s };
  return { out: res.out, state: res.state ?? s };
}
