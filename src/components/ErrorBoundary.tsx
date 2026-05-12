"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children:  ReactNode;
  fallback?: ReactNode;
}
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.20)" }}>
          ⛰️
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            This section ran into an issue
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Refresh the page or tap Retry below.
          </p>
        </div>
        <button
          onClick={() => this.setState({ hasError: false })}
          className="px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "rgba(220,38,38,0.12)",
            border:     "1px solid rgba(220,38,38,0.30)",
            color:      "#dc2626",
          }}
        >
          Retry ↺
        </button>
      </div>
    );
  }
}
