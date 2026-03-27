# Erlang / Elixir Backend

## Tổng quan

Erlang và Elixir là ngôn ngữ lập trình được thiết kế cho các hệ thống phân tán, fault-tolerant, real-time với uptime cao. Erlang VM (BEAM) là runtime nền tảng cho cả hai ngôn ngữ.

### Đặc điểm cốt lõi

| Đặc điểm | Mô tả |
|-----------|--------|
| **Actor Model** | Mỗi actor là một lightweight process riêng biệt |
| **Fault Tolerance** | "Let it crash" — process failure không ảnh hưởng hệ thống |
| **Soft Real-time** | Garbage collection per-process, không pause toàn bộ hệ thống |
| **Hot Code Reloading** | Deploy code không downtime |
| **Distributed** | Native hỗ trợ cluster qua Erlang distribution |

## Các chủ đề con

| Chủ đề | Mô tả |
|---------|-------|
| **Elixir Syntax** | Syntax cơ bản, data structures, pattern matching, protocols |
| **Concurrency & OTP** | GenServer, Task, Supervisor, ETS, distributed Erlang |
| **Phoenix Framework** | Router, Controllers, LiveView, Ecto, Channels |

## Elixir và Erlang

Elixir chạy trên BEAM (Erlang VM), compile xuống bytecode Erlang. Elixir cung cấp syntax hiện đại hơn, macro system mạnh, và tooling tốt hơn (Mix, ExUnit, Phoenix). Erlang cung cấp ngữ pháp truyền thống, otpstdlib sẵn có. Logic runtime hoàn toàn tương thích.
