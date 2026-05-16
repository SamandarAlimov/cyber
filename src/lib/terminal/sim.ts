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
  if (line.startsWith("#")) {
    return { out: line.slice(1).trim(), state: s };
  }

  // handle redirection: echo "x" > file.txt
  const redirMatch = line.match(/^(.*?)\s*>\s*(\S+)\s*$/);
  if (redirMatch) {
    const [, leftRaw, target] = redirMatch;
    const leftRes = execCommand(s, leftRaw);
    const path = norm(s.cwd, target);
    const newFs = { ...leftRes.state.fs, [path]: leftRes.out.replace(/\n$/, "") };
    return { out: "", state: { ...leftRes.state, fs: newFs } };
  }

  // handle pipe: cmd | grep x  (simple, only one pipe)
  if (line.includes(" | ")) {
    const [a, b] = line.split(" | ");
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
    return r2;
  }

  const tokens = line.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
  const argv = tokens.map((t) => t.replace(/^['"]|['"]$/g, ""));
  const cmd = argv[0];
  const args = argv.slice(1);

  const handlers: Record<string, () => string | { out: string; state?: SessionState }> = {
    help: () =>
      "Available: pwd, ls, cd, cat, grep, echo, chmod, ping, nslookup, nmap, curl, whoami, clear, history",
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
    chmod: () => {
      const [mode, file] = args;
      if (!mode || !file) return "chmod: missing operand";
      const p = norm(s.cwd, file);
      if (s.fs[p] === undefined) return `chmod: ${file}: No such file`;
      if (mode.includes("x")) PERMS[p] = "-rwxr-xr-x";
      return "";
    },
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
