import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { createSession, execCommand, type SessionState } from "@/lib/terminal/sim";

type Props = {
  fs?: Record<string, string>;
  cwd?: string;
  onOutput?: (output: string, command: string) => void;
};

export type CyberTerminalHandle = {
  run: (command: string) => void;
  focus: () => void;
};

export const CyberTerminal = forwardRef<CyberTerminalHandle, Props>(function CyberTerminal(
  { fs, cwd, onOutput },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const stateRef = useRef<SessionState>(createSession({ fs, cwd }));
  const bufferRef = useRef<string>("");
  const runLineRef = useRef<(line: string) => void>(() => {});
  const onOutputRef = useRef(onOutput);
  onOutputRef.current = onOutput;

  useImperativeHandle(
    ref,
    () => ({
      run(command: string) {
        const line = command.trim();
        const term = termRef.current;
        if (!line || !term) return;
        bufferRef.current = "";
        term.write(line);
        runLineRef.current(line);
        term.focus();
      },
      focus() {
        termRef.current?.focus();
      },
    }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 13,
      lineHeight: 1.35,
      theme: {
        background: "#0a120e",
        foreground: "#9bff9b",
        cursor: "#5fff8a",
        cursorAccent: "#0a120e",
        black: "#0a120e",
        green: "#5fff8a",
        brightGreen: "#a0ffb0",
        yellow: "#ffb86b",
        brightYellow: "#ffd28a",
        red: "#ff6b6b",
        blue: "#6bd1ff",
        magenta: "#d18bff",
        cyan: "#7af0ff",
        white: "#e6ffe6",
      },
      allowTransparency: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    termRef.current = term;

    const ro = new ResizeObserver(() => {
      try { fit.fit(); } catch { /* ignore */ }
    });
    ro.observe(containerRef.current);

    const prompt = () => {
      const cwd = stateRef.current.cwd.replace(/^\/home\/hacker/, "~");
      term.write(`\r\n\x1b[1;32mhacker@cyber\x1b[0m:\x1b[1;34m${cwd}\x1b[0m$ `);
    };

    term.writeln("\x1b[1;32mCyber Alsamos\x1b[0m — interactive terminal v1.0");
    term.writeln("Alsamos Corporation Company. Type \x1b[1mhelp\x1b[0m to see commands.");
    prompt();

    const runLine = (line: string) => {
      const result = execCommand(stateRef.current, line);
      stateRef.current = result.state;
      if (result.out === "\u0000CLEAR") {
        term.clear();
      } else if (result.out) {
        term.write("\r\n" + result.out.replace(/\n/g, "\r\n"));
      }
      onOutputRef.current?.(result.out, line);
      prompt();
    };
    runLineRef.current = runLine;

    const onData = term.onData((data: string) => {
      for (const ch of data) {
        const code = ch.charCodeAt(0);
        if (code === 13) {
          // enter
          const cmd = bufferRef.current;
          bufferRef.current = "";
          runLine(cmd);
        } else if (code === 127) {
          // backspace
          if (bufferRef.current.length > 0) {
            bufferRef.current = bufferRef.current.slice(0, -1);
            term.write("\b \b");
          }
        } else if (code === 3) {
          // Ctrl+C
          bufferRef.current = "";
          term.write("^C");
          prompt();
        } else if (code >= 32) {
          bufferRef.current += ch;
          term.write(ch);
        }
      }
    });

    return () => {
      onData.dispose();
      ro.disconnect();
      runLineRef.current = () => {};
      term.dispose();
      termRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass relative overflow-hidden rounded-lg">
      <div className="flex items-center gap-2 border-b border-border/50 bg-background/30 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          hacker@cyber.alsamos — bash
        </span>
      </div>
      <div ref={containerRef} className="h-[320px] w-full bg-[#0a120e] p-2 sm:h-[400px] sm:p-3 md:h-[460px]" />
    </div>
  );
});
